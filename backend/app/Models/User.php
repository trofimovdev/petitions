<?php

namespace App\Models;

use Illuminate\Support\Facades\Redis;

class User
{
    const CACHE_TTL = 900;

    public static function getUsers(array $userIds = [])
    {
        $missingUserIds = [];
        $users = [];
        foreach ($userIds as $userId) {
            $user = Redis::hgetall('u' . $userId);
            if (!$user) {
                $missingUserIds[] = $userId;
                continue;
            }
            $users[$userId] = $user;
        }

        $tempMissingUserIds = [];
        foreach ($missingUserIds as $missingUserId) {
            if (sizeof($tempMissingUserIds) === 1000) {
                $users = $users + User::getUsersFromAPI($tempMissingUserIds);
                $tempMissingUserIds = [];
            }
            $tempMissingUserIds[] = $missingUserId;
        }
        $users = $users + User::getUsersFromAPI($tempMissingUserIds);
        return $users;
    }

    public static function getUsersFromAPI(array $userIds, bool $cache = true)
    {
        if (!$userIds) {
            return [];
        }

        $users = [];
        $usersData = json_decode(file_get_contents('https://api.vk.com/method/users.get?user_ids=' . join(',', $userIds) . '&fields=photo_50,sex&access_token=' . config('app.service') . '&v=5.103'))->response;
        foreach ($usersData as $userData) {
            $user = [];
            $user['first_name'] = $userData->first_name;
            $user['last_name'] = $userData->last_name;
            $user['photo_50'] = $userData->photo_50;
            $user['sex'] = $userData->sex;
            $users[$userData->id] = $user;
            if ($cache) {
                Redis::hmset('u' . $userData->id, $user);
                Redis::expire('u' . $userData->id, User::CACHE_TTL);
            }
        }
        return $users;
    }
}
