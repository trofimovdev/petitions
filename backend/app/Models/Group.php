<?php

namespace App\Models;

use ErrorException;
use Illuminate\Support\Facades\Redis;

class Group
{
    const CACHE_TTL = 900;
    const PREFIX = 'g';

    public static function getGroups(array $groupIds = [])
    {
        $missingGroupIds = [];
        $groups = [];
        foreach ($groupIds as $groupId) {
            $group = Redis::hgetall(Group::PREFIX . $groupId);
            if (!$group) {
                $missingGroupIds[] = $groupId;
                continue;
            }
            $groups[$groupId] = $group;
        }

        $tempMissingGroupIds = [];
        $groupFields = ['photo_50'];
        foreach ($missingGroupIds as $missingGroupId) {
            if (sizeof($tempMissingGroupIds) === 500) {
                $missingGroups = Group::getGroupsFromAPI($tempMissingGroupIds, $groupFields);
                if ($missingGroups) {
                    $groups = $groups + $missingGroups;
                }
                $tempMissingGroupIds = [];
            }
            $tempMissingGroupIds[] = $missingGroupId;
        }
        $missingGroups = Group::getGroupsFromAPI($tempMissingGroupIds, $groupFields);
        if ($missingGroups) {
            $groups = $groups + $missingGroups;
        }
        return $groups;
    }

    public static function checkIsBanned(int $groupId)
    {
        $group = Group::getGroupsFromAPI([$groupId], [], false);
        if (!$group) {
            return null;
        }
        return array_key_exists('deactivated', $group[$groupId]);
    }

    public static function getGroupsFromAPI(array $groupIds, array $fields = [], bool $cache = true, int $try = 0)
    {
        if (!$groupIds) {
            return [];
        }

        $groups = [];
        try {
            $groupsData = json_decode(file_get_contents('https://api.vk.com/method/groups.getById?group_ids=' . join(',', $groupIds) . '&fields=' . join(',', $fields) . '&access_token=' . config('app.service') . '&v=5.103&lang=ru'))->response;
        } catch (ErrorException $e) {
            if ($try === 5) {
                return null;
            }
            return Group::getGroupsFromAPI($groupIds, $fields, true, $try + 1);
        }

        foreach ($groupsData as $groupData) {
            $group = (array)$groupData;
            $groups[$groupData->id] = $group;
            if ($cache) {
                Redis::hmset(Group::PREFIX . $groupData->id, $group);
                Redis::expire(Group::PREFIX . $groupData->id, Group::CACHE_TTL);
            }
        }
        return $groups;
    }
}
