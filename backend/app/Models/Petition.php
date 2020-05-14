<?php

namespace App\Models;

use App\Http\Requests\SignRequest;
use CURLFile;
use ErrorException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;

class Petition extends Model
{
    protected $table = 'petitions';

    protected $fillable = [
        'title',
        'text',
        'need_signatures',
        'count_signatures',
        'owner_id',
        'mobile_photo_url',
        'web_photo_url',
        'completed',
        'directed_to'
    ];

    public $timestamps = true;

    const POPULAR_CACHE_TTL = 3600;

    public static function getPopular(int $offset = 0, array $friendIds = [])
    {
        if ($offset >= 100) {
            return [];
        }
        $redisPetitionIds = Redis::lrange('popular', $offset, $offset + 10);
        $petitionIds = $redisPetitionIds;
        // TODO: replace count(user_id) with prod value
        if (!$redisPetitionIds) {
            $petitions = Signature::select('petition_id', Signature::raw('count(user_id)'), 'completed')
                ->join('petitions', 'petition_id', '=', 'id')
                ->whereRaw('signed_at >= date_trunc(\'second\', current_timestamp - interval \'1 week\')')
                ->groupBy('petition_id', 'completed')
                ->havingRaw('completed = false AND count(user_id) > ?', [2]) // 140 / 7 = 20 signatures per day
                ->orderByRaw('count(user_id) desc, petition_id asc')
                ->limit(100)
                ->get();
            $petitionIds = [];
            foreach ($petitions as $petition) {
                $petitionIds[] = $petition->petition_id;
            }
            Redis::rpush('popular', ...$petitionIds);
            Redis::expire('popular', Petition::POPULAR_CACHE_TTL);
            $petitionIds = array_slice($petitionIds, $offset, 10);
        }
        $petitions = Petition::getPetitions($petitionIds, false, $friendIds);
        return $petitions;
    }


    public static function getLast(int $offset = 0, array $friendIds = [])
    {
        $petitions = Petition::where('completed', '=', 'false')
            ->latest('created_at')
            ->offset($offset)
            ->limit(10)
            ->get();
        $response = [];
        foreach ($petitions as $petition) {
            if ($friendIds) {
                $petition->friends = Signature::getUsers($petition->id, $friendIds);
            }
            $response[] = $petition->toPetitionView($text = false, $ownerId = true);
        }
        return $response;
    }

    public static function getSigned(int $userId, int $offset = 0, array $friendIds = [])
    {
        $signatures = Signature::getSignatures([$userId], $offset);
        $petitionIds = [];
        foreach ($signatures as $signature) {
            $petitionIds[] = $signature['petition_id'];
        }
        return Petition::getPetitions($petitionIds, false, $friendIds);
    }

    public static function getManaged(int $userId, int $offset = 0, array $friendIds = [])
    {
        $petitions = Petition::where('owner_id', '=', $userId)
            ->latest('created_at')
            ->offset($offset)
            ->limit(10)
            ->get();
        $response = [];
        foreach ($petitions as $petition) {
            if ($friendIds) {
                $petition->friends = Signature::getUsers($petition->id, $friendIds);
            }
            $response[] = $petition->toPetitionView($text = false, $ownerId = true);
        }
        return $response;
    }

    public static function upload(int $petitionId, string $uploadUrl, string $device)
    {
        $petition = Petition::getPetitions([$petitionId])[0];

        switch ($device) {
            case 'mobile':
                $imgPath = explode(config('app.server_url'), $petition['mobile_photo_url'])[1];
                break;

            case 'web':
                $imgPath = explode(config('app.server_url'), $petition['web_photo_url'])[1];
                break;
        }

        $options = array(
            CURLOPT_POST        => 1,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS     => ['file1' => new CurlFile(Storage::path('public/' . $imgPath))]
        );

        $ch = curl_init($uploadUrl);
        curl_setopt_array($ch, $options);

        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response);
    }

    public static function getPetitions(array $petitionIds, bool $withOwner = false, array $friendIds = [], bool $withSignedStatus = false, int $userId = 0, bool $text = false, bool $ownerId = true)
    {
        $petitions = Petition::whereIn('id', $petitionIds)->get();
        $loadedPetitions = [];
        foreach ($petitions as $petition) {
            if ($withOwner) {
                $petition->owner = User::getUsers([$petition->owner_id])[$petition->owner_id];
            }
            if ($friendIds) {
                $petition->friends = Signature::getUsers($petition->id, $friendIds);
            }
            if ($withSignedStatus) {
                $petition->signed = (bool)Signature::getUsers($petition->id, [$userId]);
            }
            $loadedPetitions[$petition->id] = $petition->toPetitionView($text, $ownerId);
        }

        $response = [];
        foreach ($petitionIds as $petitionId) {
            if (!array_key_exists($petitionId, $loadedPetitions)) {
                continue;
            }
            $response[] = $loadedPetitions[$petitionId];
        }
        return $response;
    }

    public static function createPetition(SignRequest $request, string $title, string $text, int $needSignatures, string $directedTo, $mobilePhoto, $webPhoto, int $userId)
    {
        $saveData = Petition::saveImages($mobilePhoto, $webPhoto);
        $row = [
            'title' => $title,
            'text' => $text,
            'need_signatures' => $needSignatures,
            'count_signatures' => 1,
            'owner_id' => $userId,
            'mobile_photo_url' => config('app.server_url') . 'static/' . $saveData['name'] . '_mobile.png',
            'web_photo_url' => config('app.server_url') . 'static/' . $saveData['name'] . '_web.png',
            'completed' => false,
            'directed_to' => $directedTo
        ];
        $petition = Petition::create($row);
        $signature_row = [
            'petition_id' => $petition['id'],
            'user_id' => $userId,
            'user_agent' => $request->server('HTTP_USER_AGENT'),
            'ip' => $request->ip(), // without CloudFlare
            'signed_at' => now()
        ];
        Signature::create($signature_row);
        return $petition;
    }

    public static function filterString(string $string)
    {
        return preg_replace("/[^\Wa-zA-Z0-9 ]/", "", $string);
    }

    public static function exifRotate($image)
    {
        try {
            $exif = exif_read_data($image);
        } catch (ErrorException $e) {
            $exif = [];
        } finally {
            $image = imagecreatefromstring(file_get_contents($image));
            if (!empty($exif['Orientation'])) {
                switch ($exif['Orientation']) {
                    case 3:
                        return imagerotate($image, 180, 0);

                    case 6:
                        return imagerotate($image, -90, 0);

                    case 8:
                        return imagerotate($image, 90, 0);
                }
            }
            return $image;
        }
    }

    public static function saveImages($mobilePhoto, $webPhoto)
    {
        $name = time() . bin2hex(random_bytes(5));
        if ($mobilePhoto) {
            $mobilePhoto = Petition::exifRotate($mobilePhoto);
            $mobilePhotoWidth = imagesx($mobilePhoto);
            $mobilePhotoHeight = imagesy($mobilePhoto);
            if ($mobilePhotoWidth > $mobilePhotoHeight && round($mobilePhotoHeight * 1.875) < $mobilePhotoWidth) {
                $height = $mobilePhotoHeight;
                $width = round($mobilePhotoHeight * 1.875);
            } else {
                $width = $mobilePhotoWidth;
                $height = round($mobilePhotoWidth / 1.875);
            }
            $mobilePhoto = imagecrop($mobilePhoto, ['x' => round(($mobilePhotoWidth - $width) / 2), 'y' => 0, 'width' => $width, 'height' => $height]);
            imagepng($mobilePhoto, base_path() . '/storage/app/public/static/' . $name . '_mobile.png');
        }

        if ($webPhoto) {
            $webPhoto = Petition::exifRotate($webPhoto);
            $webPhotoWidth = imagesx($webPhoto);
            $webPhotoHeight = imagesy($webPhoto);
            if ($webPhotoWidth > $webPhotoHeight && round($webPhotoHeight * 4.25) < $webPhotoWidth) {
                $height = $webPhotoHeight;
                $width = round($webPhotoHeight * 4.25);
            } else {
                $width = $webPhotoWidth;
                $height = round($webPhotoWidth / 4.25);
            }
            $webPhoto = imagecrop($webPhoto, ['x' => round(($webPhotoWidth - $width) / 2), 'y' => 0, 'width' => $width, 'height' => $height]);
            imagepng($webPhoto, base_path() . '/storage/app/public/static/' . $name . '_web.png');
        }

        return ['name' => $name, 'mobilePhoto' => (bool)$mobilePhoto, 'webPhoto' => (bool)$webPhoto];
    }

    public static function isBase64Image(string $base64)
    {
        $explode = explode(',', $base64);
        $allow = ['png', 'jpg', 'jpeg'];
        $format = str_replace(
            [
                'data:image/',
                ';',
                'base64',
            ],
            [
                '', '', '',
            ],
            $explode[0]
        );

        if (!in_array($format, $allow)) {
            return false;
        }

        if (!preg_match('%^[a-zA-Z0-9/+]*={0,2}$%', $explode[1])) {
            return false;
        }

        return true;
    }

    public function toPetitionView(bool $text = true, bool $ownerId = true)
    {
        $petition = [
            'id' => $this->id,
            'title' => $this->title,
            'need_signatures' => $this->need_signatures,
            'count_signatures' => $this->count_signatures,
            'mobile_photo_url' => $this->mobile_photo_url,
            'web_photo_url' => $this->web_photo_url,
            'completed' => $this->completed,
            'directed_to' => []
        ];
        if ($this->directed_to) {
            foreach (explode(',', $this->directed_to) as $item) {
                $petition['directed_to'][] = $item;
//            preg_match('/^@\S+ \(.+\)$/', $item, $matches);
//            if (!$matches) {
//                $petition['directed_to'][] = $item;
//                continue;
//            }
//            preg_match('/^@(\S+)/', $matches[0], $link);
//            preg_match('/\((.+)\)$/', $matches[0], $name);
//            if (!$link || !$name) {
//                $petition['directed_to'][] = $item;
//                continue;
//            }
//            $petition['directed_to'][] = [
//                'link' => 'https://vk.com/' . $link[1],
//                'name' => $name[1]
//            ];
            }
        }
        if ($text) {
            $petition['text'] = $this->text;
        }
        if ($ownerId) {
            $petition['owner_id'] = $this->owner_id;
        }
        if ($this->owner) {
            $petition['owner'] = $this->owner;
        }
        if ($this->friends) {
            $petition['friends'] = $this->friends;
        }
        if ($this->signed !== null) {
            $petition['signed'] = $this->signed;
        }
        return $petition;
    }
}
