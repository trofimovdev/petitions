<?php

namespace App\Models;

use App\Models\Signature;
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
        'completed'
    ];

    public $timestamps = true;

    public static function getLast(int $offset = 0, array $friendIds = [])
    {
        $petitions = Petition::latest('created_at')
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
            $response[] = $loadedPetitions[$petitionId];
        }
        return $response;
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
        ];
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
