<?php

namespace App\Models;

use Illuminate\Support\Facades\Redis;

class User
{
    const CACHE_TTL = 900;

    public static function getUser(int $owner_id)
    {
        $user = Redis::hgetall('u' . $owner_id);
        if (!$user) {
            $user = [];
            $userData = json_decode(file_get_contents('https://api.vk.com/method/users.get?user_ids=' . $owner_id . '&fields=photo_50&access_token=' . config('app.service') . '&v=5.103'))->response[0];
            $user['id'] = (string)$userData->id;
            $user['first_name'] = (string)$userData->first_name;
            $user['last_name'] = (string)$userData->last_name;
            $user['photo_50'] = (string)$userData->photo_50;
            Redis::hmset('u' . $owner_id, $user);
            Redis::expire('u' . $owner_id, User::CACHE_TTL);
        }
        return $user;
    }
}
