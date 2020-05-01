<?php

namespace App\Models;

use ErrorException;
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
    public static function checkIsBanned(int $userId)
    {
        $user = User::getUsersFromAPI([$userId], [], false);
        if (!$user) {
            return null;
        }
        return array_key_exists('deactivated', $user[$userId]);
    }

    public static function getUsersFromAPI(array $userIds, array $fields = [], bool $cache = true, int $try = 0)
    {
        if (!$userIds) {
            return [];
        }

        $users = [];
        try {
            $usersData = json_decode(file_get_contents('https://api.vk.com/method/users.get?user_ids=' . join(',', $userIds) . '&fields=' . join(',', $fields) . '&access_token=' . config('app.service') . '&v=5.103'))->response;
        } catch (ErrorException $e) {
            if ($try === 5) {
                return null;
            }
            return User::getUsersFromAPI($userIds, $fields, true, $try + 1);
        }

        foreach ($usersData as $userData) {
            $user = [];
            $users[$userData->id] = (array)$userData;
            if ($cache) {
                Redis::hmset('u' . $userData->id, $user);
                Redis::expire('u' . $userData->id, User::CACHE_TTL);
            }
        }
        return $users;
    }
}
