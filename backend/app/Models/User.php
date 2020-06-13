<?php

namespace App\Models;

use ErrorException;
use Illuminate\Support\Facades\Redis;
use VK\Client\VKApiClient;
use VK\Client\Enums\VKLanguage;

class User
{
    const CACHE_TTL = 900;
    const PREFIX = 'u';

    public static function getUsers(array $userIds = [])
    {
        $missingUserIds = [];
        $users = [];
        foreach ($userIds as $userId) {
            $user = Redis::hgetall(User::PREFIX . $userId);
            if (!$user) {
                $missingUserIds[] = $userId;
                continue;
            }
            $users[$userId] = $user;
        }

        $tempMissingUserIds = [];
        $userFields = ['photo_100', 'sex'];
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
            $vk = new VKApiClient('5.103', VKLanguage::RUSSIAN);
            $usersData = $vk->users()->get(config('app.service'), [
                'user_ids'  => $userIds,
                'fields'    => $fields,
            ]);
        } catch (ErrorException $e) {
            if ($try === 5) {
                return null;
            }
            return User::getUsersFromAPI($userIds, $fields, true, $try + 1);
        }

        foreach ($usersData as $user) {
            $user = (array)$user;
            $users[$user['id']] = $user;
            if ($cache) {
                Redis::hmset(User::PREFIX . $user['id'], $user);
                Redis::expire(User::PREFIX . $user['id'], User::CACHE_TTL);
            }
        }
        return $users;
    }
}
