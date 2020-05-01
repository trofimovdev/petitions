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
        $userFields = ['photo_50', 'sex'];
        foreach ($missingUserIds as $missingUserId) {
            if (sizeof($tempMissingUserIds) === 1000) {
                $missingUsers = User::getUsersFromAPI($tempMissingUserIds, $userFields);
                if ($missingUsers) {
                    $users = $users + $missingUsers;
                }
                $tempMissingUserIds = [];
            }
            $tempMissingUserIds[] = $missingUserId;
        }
        $missingUsers = User::getUsersFromAPI($tempMissingUserIds, $userFields);
        if ($missingUsers) {
            $users = $users + $missingUsers;
        }
        return $users;
    }

    public static function getUsersFromAPI(array $userIds, array $fields = [], bool $cache = true, int $try = 0)
    {
        if (!$userIds) {
            return [];
        }

        $users = [];
        try {
            $usersData = json_decode(file_get_contents('https://api.vk.com/method/users.get?user_ids=' . join(',', $userIds) . '&fields=' . join(',', $fields) . '&access_token=' . config('app.service') . '&v=5.103'))->response;
        } catch (Exeception $e) {
            if ($try === 5) {
                return false;
            }
            return User::getUsersFromAPI($userIds, $fields, true, $try + 1);
        }
        foreach ($usersData as $userData) {
            $user = [];
            $user['first_name'] = $userData->first_name;
            $user['last_name'] = $userData->last_name;
            foreach ($fields as $field) {
                $user[$field] = (string)$userData->{$field};
            }
            $users[$userData->id] = $user;
            if ($cache) {
                Redis::hmset('u' . $userData->id, $user);
                Redis::expire('u' . $userData->id, User::CACHE_TTL);
            }
        }
        return $users;
    }
}
