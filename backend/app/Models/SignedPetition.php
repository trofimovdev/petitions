<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SignedPetition extends Model
{
    protected $table = 'signed_petitions';

    protected $fillable = [
        'petition_id',
        'user_id',
        'signed_at'
    ];

    public $timestamps = false;

    public static function getSigned(int $userId, int $offset = 0)
    {
        $petitions = SignedPetition::latest('signed_at')
            ->where('user_id', '=', $userId)
            ->offset($offset)
            ->limit(10)
            ->get();
        $petitionIds = [];
        foreach ($petitions as $petition) {
            if (!($petition instanceof SignedPetition)) {
                continue;
            }
            $petitionIds[] = $petition->petition_id;
        }
        $response = Petition::getPetitions($petitionIds);
        return $response;
    }
}
