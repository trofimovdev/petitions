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

    public static function getLast(int $offset = 0)
    {
        $petitions = Petition::latest('created_at')->offset($offset)->limit(10)->get();
        $response = [];
        foreach ($petitions as $petition) {
            if ($petition instanceof Petition) {
                $response[] = $petition->toPetitionView();
            } else {
                $response[] = null;
            }
        }
        return $response;
    }

//    public static function getPetitions(array $petitionIds)
//    {
//        $petitions = Petition::where('id', $petitionIds)->get();
//        $response = [];
//        foreach ($petitions as $petition) {
//            if ($petition instanceof Petition) {
//                $response[] = $petition->toPetitionView();
//            } else {
//                $response[] = null;
//            }
//        }
//        return $response;
//    }


//    public static function getPetitionsByType(string $type, int $offset)
//    {
//        // get {type} petitions
//        $petitionIds = [1,2,3,4,5,6,7,8,9,10];
//        return Petition::getPetitions($petitionIds);
//    }

    public function toPetitionView()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'text' => $this->text,
            'need_signatures' => $this->need_signatures,
            'count_signatures' => $this->count_signatures,
            'owner_id' => $this->owner_id,
            'mobile_photo_url' => $this->mobile_photo_url,
            'web_photo_url' => $this->web_photo_url,
        ];
    }
}
