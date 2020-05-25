<?php

namespace App\Models;

use App\Http\Requests\SignRequest;
use ErrorException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Redis;

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
        'directed_to',
        'group_id'
    ];

    public $timestamps = true;

    const POPULAR_CACHE_TTL = 3600;
    const IMAGE_TYPE_MOBILE = 'mobile';
    const IMAGE_TYPE_WEB = 'web';
    const DEFAULT_MOBILE_IMAGE_NAME = '1440x768.png';
    const DEFAULT_WEB_IMAGE_NAME = '1360x320.png';
    const TYPE_POPULAR = 'popular';
    const TYPE_LAST = 'last';
    const TYPE_SIGNED = 'signed';
    const TYPE_MANAGED = 'managed';
    const TYPE_GROUP = 'group';
    const ACTION_TYPE_EDIT = 'edit';

    public static function getPopular(int $offset = 0, array $friendIds = [])
    {
        if ($offset >= 100) {
            return [];
        }
        $redisPetitionIds = Redis::lrange(Petition::TYPE_POPULAR, $offset, $offset + 10);
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
            Redis::rpush(Petition::TYPE_POPULAR, ...$petitionIds);
            Redis::expire(Petition::TYPE_POPULAR, Petition::POPULAR_CACHE_TTL);
            $petitionIds = array_slice($petitionIds, $offset, 10);
        }
        $petitions = Petition::getPetitions($petitionIds, false, $friendIds);
        return $petitions;
    }


    public static function getLast(int $offset = 0, array $friendIds = [], int $groupId = 0)
    {
        if ($groupId) {
            $petitions = Petition::where('completed', '=', 'false')
                ->where('group_id', '=', $groupId)
                ->latest('created_at')
                ->offset($offset)
                ->limit(10)
                ->get();
        } else {
            $petitions = Petition::where('completed', '=', 'false')
                ->latest('created_at')
                ->offset($offset)
                ->limit(10)
                ->get();
        }
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

    public static function getManaged(int $userId, int $offset = 0, array $friendIds = [], int $groupId = 0)
    {
        if ($groupId) {
            $petitions = Petition::where('group_id', '=', $groupId)
                ->latest('created_at')
                ->offset($offset)
                ->limit(10)
                ->get();
        } else {
            $petitions = Petition::where('group_id', '=', 0)
                ->where('owner_id', '=', $userId)
                ->latest('created_at')
                ->offset($offset)
                ->limit(10)
                ->get();
        }
        $response = [];
        foreach ($petitions as $petition) {
            if ($friendIds) {
                $petition->friends = Signature::getUsers($petition->id, $friendIds);
            }
            $response[] = $petition->toPetitionView($text = false, $ownerId = true);
        }
        return $response;
    }

    public static function getPetitions(array $petitionIds, bool $withOwner = false, array $friendIds = [], bool $withSignedStatus = false, int $userId = 0, bool $text = false, bool $ownerId = true, bool $defaultImages = true)
    {
        $petitions = Petition::whereIn('id', $petitionIds)->get();
        $loadedPetitions = [];
        foreach ($petitions as $petition) {
            if ($withOwner) {
                if ($petition->group_id) {
                    $petition->owner = Group::getGroups([$petition->group_id])[$petition->group_id];
                } else {
                    $petition->owner = User::getUsers([$petition->owner_id])[$petition->owner_id];
                }
            }
            if ($friendIds) {
                $petition->friends = Signature::getUsers($petition->id, $friendIds);
            }
            if ($withSignedStatus) {
                $petition->signed = (bool)Signature::getUsers($petition->id, [$userId]);
            }
            $loadedPetitions[$petition->id] = $petition->toPetitionView($text, $ownerId, $defaultImages);
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

    public static function createPetition(SignRequest $request, string $title, string $text, int $needSignatures, string $directedTo, $mobilePhoto, $webPhoto)
    {
        $name = time() . bin2hex(random_bytes(5));
        $mobilePhotoName = null;
        $webPhotoName = null;
        if (!is_null($mobilePhoto)) {
            $mobilePhotoName = Petition::saveImage($mobilePhoto, Petition::IMAGE_TYPE_MOBILE, $name);
        }
        if (!is_null($webPhoto)) {
            $webPhotoName = Petition::saveImage($webPhoto, Petition::IMAGE_TYPE_WEB, $name);
        }
        $row = [
            'title' => $title,
            'text' => $text,
            'need_signatures' => $needSignatures,
            'count_signatures' => 1,
            'owner_id' => $request->userId,
            'mobile_photo_url' => is_null($mobilePhotoName) ? null : config('app.server_url') . 'static/' . $mobilePhotoName,
            'web_photo_url' => is_null($webPhotoName) ? null : config('app.server_url') . 'static/' . $webPhotoName,
            'completed' => false,
            'directed_to' => $directedTo,
            'group_id' => $request->groupId
        ];
        $petition = Petition::create($row);
        $signature_row = [
            'petition_id' => $petition['id'],
            'user_id' => $request->userId,
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

    public static function saveImage($photo, string $type, string $name)
    {
        if (empty($name)) {
            $name = time() . bin2hex(random_bytes(5));
        }
        $photo = Petition::exifRotate($photo);
        $photoWidth = imagesx($photo);
        $photoHeight = imagesy($photo);
        switch ($type) {
            case Petition::IMAGE_TYPE_MOBILE:
                if ($photoWidth > $photoHeight && round($photoHeight * 1.875) < $photoWidth) {
                    $height = $photoHeight;
                    $width = round($photoHeight * 1.875);
                } else {
                    $width = $photoWidth;
                    $height = round($photoWidth / 1.875);
                }
                break;

            case Petition::IMAGE_TYPE_WEB:
                if ($photoWidth > $photoHeight && round($photoHeight * 4.25) < $photoWidth) {
                    $height = $photoHeight;
                    $width = round($photoHeight * 4.25);
                } else {
                    $width = $photoWidth;
                    $height = round($photoWidth / 4.25);
                }
                break;

            default:
                return null;
        }

        $photo = imagecrop($photo, ['x' => round(($photoWidth - $width) / 2), 'y' => 0, 'width' => $width, 'height' => $height]);
        $extension = '.png';
        imagepng($photo, base_path() . '/storage/app/public/static/' . $name . $type . $extension);

        return $name . $type . $extension;
    }

    public function toPetitionView(bool $text = true, bool $ownerId = true, bool $defaultImages = true)
    {
        $petition = [
            'id' => $this->id,
            'title' => $this->title,
            'need_signatures' => $this->need_signatures,
            'count_signatures' => $this->count_signatures,
            'mobile_photo_url' => $defaultImages ? config('app.server_url') . 'static/' . Petition::DEFAULT_MOBILE_IMAGE_NAME : '',
            'web_photo_url' => $defaultImages ? config('app.server_url') . 'static/' . Petition::DEFAULT_WEB_IMAGE_NAME : '',
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
            $petition['owner_id'] = $this->group_id ? -$this->group_id : $this->owner_id;
        }
        if ($this->owner) {
            $petition['owner'] = $this->owner;
        }
        if ($this->friends) {
            $petition['friends'] = $this->friends;
        }
        if (!is_null($this->signed)) {
            $petition['signed'] = $this->signed;
        }
        if (!is_null($this->mobile_photo_url)) {
            $petition['mobile_photo_url'] = $this->mobile_photo_url;
        }
        if (!is_null($this->web_photo_url)) {
            $petition['web_photo_url'] = $this->web_photo_url;
        }
        return $petition;
    }
}
