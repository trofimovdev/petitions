<?php

namespace App\Models;

use CURLFile;
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
        'completed'
    ];

    public $timestamps = true;

    public static function getLast(int $offset = 0, array $friendIds = [])
    {
        $petitions = Petition::where('completed', '=', 'false')
            ->latest('created_at')
            ->offset($offset)
            ->limit(10)
            ->get();
        $response = [];
        foreach ($petitions as $petition) {
            if ($petition instanceof Petition) {
                if ($friendIds) {
                    $petition->friends = Signature::getUsers($petition->id, $friendIds);
                }
                $response[] = $petition->toPetitionView($text = false, $ownerId = true);
            } else {
                $response[] = null;
            }
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
            if ($petition instanceof Petition) {
                if ($friendIds) {
                    $petition->friends = Signature::getUsers($petition->id, $friendIds);
                }
                $response[] = $petition->toPetitionView($text = false, $ownerId = true);
            } else {
                $response[] = null;
            }
        }
        return $response;
    }

    public static function upload(int $petitionId, string $uploadUrl, string $type)
    {
        $petition = Petition::getPetitions([$petitionId])[0];

        switch ($type) {
            case 'mobile':
            default:
                $imgPath = explode('https://petitions.trofimov.dev/', $petition['mobile_photo_url'])[1];
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

    public static function getPetitions(array $petitionIds, bool $withOwner = false, array $friendIds = [], bool $withSignedStatus = false, int $userId = 0)
    {
        $petitions = Petition::whereIn('id', $petitionIds)->get();
        $loadedPetitions = [];
        foreach ($petitions as $petition) {
            if ($petition instanceof Petition) {
                if ($withOwner) {
                    $petition->owner = User::getUsers([$petition->owner_id])[$petition->owner_id];
                }
                if ($friendIds) {
                    $petition->friends = Signature::getUsers($petition->id, $friendIds);
                }
                if ($withSignedStatus) {
                    $petition->signed = (bool)Signature::getUsers($petition->id, [$userId]);
                }
                $loadedPetitions[$petition->id] = $petition->toPetitionView();
            } else {
                $loadedPetitions[] = null;
            }
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

    public static function createPetition(string $title, string $text, int $needSignatures, string $directedTo, string $mobilePhoto, string $webPhoto, int $userId)
    {
        $name = bin2hex(random_bytes(5));
        $mobilePhoto = explode(',', $mobilePhoto)[1];
        $webPhoto = explode(',', $webPhoto)[1];
        Storage::put('public/static/' . $name . '_mobile.png', base64_decode($mobilePhoto));
        Storage::put('public/static/' . $name . '_web.png', base64_decode($webPhoto));
        $row = [
            'title' => $title,
            'text' => $text,
            'need_signatures' => $needSignatures,
            'count_signatures' => 1,
            'owner_id' => $userId,
            'mobile_photo_url' => 'https://petitions.trofimov.dev/static/' . $name . '_mobile.png',
            'web_photo_url' => 'https://petitions.trofimov.dev/static/' . $name . '_web.png',
            'completed' => false
        ];
        $petition = Petition::create($row);
        $signature_row = [
            'user_id' => $userId,
            'petition_id' => $petition['id'],
            'signed_at' => now()
        ];
        Signature::create($signature_row);
        return $petition;
    }

    public static function filterString(string $string)
    {
        return preg_replace("/[^\Wa-zA-Z0-9 ]/", "", $string);
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
