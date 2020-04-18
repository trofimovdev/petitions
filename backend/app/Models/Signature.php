<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signature extends Model
{
    protected $table = 'signatures';

    protected $fillable = [
        'petition_id',
        'user_id',
        'signed_at'
    ];

    public $timestamps = false;

    protected $primaryKey = null;

    public $incrementing = false;

    public static function get(int $userId, int $offset = 0)
    {
        $petitionIds = Signature::latest('signed_at')
            ->where('user_id', '=', $userId)
            ->offset($offset)
            ->limit(10)
            ->get();
        $response = [];
        foreach ($petitionIds as $petition) {
            if (!($petition instanceof Signature)) {
                continue;
            }
            $response[] = $petition->petition_id;
        }
        return $response;
    }
}
