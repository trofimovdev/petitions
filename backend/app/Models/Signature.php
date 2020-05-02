<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signature extends Model
{
    protected $table = 'signatures';

    protected $fillable = [
        'petition_id',
        'user_id',
        'user_agent',
        'ip',
        'signed_at'
    ];

    public $timestamps = false;

    protected $primaryKey = null;

    public $incrementing = false;

    public static function getSignatures(array $userIds, int $offset = 0)
    {
        $signatures = Signature::latest('signed_at')
            ->whereIn('user_id', $userIds)
            ->offset($offset)
            ->limit(10)
            ->get();
        $response = [];
        foreach ($signatures as $signature) {
            if ($signature instanceof Signature) {
                $response[] = $signature->toSignatureView($signatureId = true);
            } else {
                $response[] = null;
            }
        }
        return $response;
    }

    public static function getUsers(int $petitionId, array $userIds)
    {
        $friendIds = [];
        $signatures = Signature::latest('signed_at')
            ->where('petition_id', '=', $petitionId)
            ->whereIn('user_id', $userIds)
            ->get();
        foreach ($signatures as $signature) {
            if (!$signature instanceof Signature) {
                continue;
            }
            $friendIds[] = $signature->user_id;
        }

        $users = [];
        if ($friendIds) {
            $users = User::getUsers($friendIds);
        }

        $response = [];
        foreach ($signatures as $signature) {
            if ($signature instanceof Signature) {
                if ($friendIds) {
                    $signature->user = $users[$signature->user_id];
                }
                $response[] = $signature->toSignatureView();
            } else {
                $response[] = null;
            }
        }
        return $response;
    }

    public function toSignatureView(bool $signatureId = false, bool $signedAt = false)
    {
        $signature = [
            'user_id' => $this->user_id
        ];
        if ($signatureId) {
            $signature['petition_id'] = $this->petition_id;
        }
        if ($signedAt) {
            $signature['signed_at'] = $this->signed_at;
        }
        if ($this->user) {
            $signature['user'] = $this->user;
        }
        return $signature;
    }
}
