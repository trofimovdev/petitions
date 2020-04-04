<?php

namespace App\Models;

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

    public $timestamps = true;

    public static function getLast(int $offset = 0)
    {
        $petitions = Petition::latest('created_at')
            ->offset($offset)
            ->limit(10)
            ->get();
        $response = [];
        foreach ($petitions as $petition) {
            if ($petition instanceof Petition) {
                $response[] = $petition->toPetitionView($text = false, $owner_id = false);
            } else {
                $response[] = null;
            }
        }
        return $response;
    }

    public static function getPetitions(array $petitionIds)
    {
        $petitions = Petition::whereIn('id', $petitionIds)->get();
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

    public function toPetitionView(bool $text = true, bool $owner_id = true)
    {
        $petition = [
            'id' => $this->id,
            'title' => $this->title,
            'need_signatures' => $this->need_signatures,
            'count_signatures' => $this->count_signatures,
            'mobile_photo_url' => $this->mobile_photo_url,
            'web_photo_url' => $this->web_photo_url,
        ];
        if ($text) {
            $petition['text'] = $this->text;
        }
        if ($owner_id) {
            $petition['owner_id'] = $this->owner_id;
        }
        return $petition;
    }
}
