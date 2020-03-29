<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

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
        'web_photo_url'
    ];

    public static function getPetition($petitionId)
    {
        $response = Petition::where('id', $petitionId)->first();
        if ($state instanceof Petition) {
            return $state->toUserView();
        } else {
            return null;
        }
    }

    public function toUserView()
    {
        return [
            'id' => $this->id,
            'title' => $this->state_date,
            'text' => $this->text,
            'need_signatures' => $this->need_signatures,
            'count_signatures' => $this->count_signatures,
            'owner_id' => $this->owner_id,
            'mobile_photo_url' => $this->mobile_photo_url,
            'web_photo_url' => $this->web_photo_url,
        ];
    }
}
