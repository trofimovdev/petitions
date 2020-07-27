<?php

namespace App\Models;

use App\Consts;
use App\Http\Controllers\API\CallbackController;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Redis;
use VK\Client\Enums\VKLanguage;
use VK\Client\VKApiClient;

class Report extends Model
{
    const PREFIX = 'rc';
    const MAX_REPORTS_PER_DAY = 3;
    const TTL = 86400; // 1 day

    public static function incrementCounter(int $userId)
    {
        if (Redis::set(Report::PREFIX . $userId, 1, 'NX', 'EX', Report::TTL)) {
            return;
        }
        Redis::incr(Report::PREFIX . $userId);
    }

    public static function getCounter(int $userId)
    {
        return (int)Redis::get(Report::PREFIX . $userId);
    }

    public static function create(int $userId, array $petition)
    {
        Report::incrementCounter($userId);
        $message = '@id' . $userId . ' оставил жалобу на петицию №' . $petition['id'] . ' «' . $petition['title'] . '»' . "\n\n#user" . $userId;
        $vk = new VKApiClient(Consts::API_VERSION, VKLanguage::RUSSIAN);
        $vk->messages()->send(config('app.group_api_key'), [
            'peer_id' => config('app.reports_peer_id'),
            'random_id' => 0,
            'message' => $message,
            'keyboard' => json_encode(
                [
                    'buttons' => [
                        [
                            [
                                'action' => [
                                    'type' => 'open_app',
                                    'app_id' => config('app.id'),
                                    'payload' => '',
                                    'label' => 'Открыть',
                                    'hash' => 'p' . $petition['id']
                                ]
                            ]
                        ],
                        [
                            [
                                'action' => [
                                    'type' => 'callback',
                                    'payload' => '{"action": "delete", "petitionId": ' . $petition['id'] . ', "userId": ' . $userId . '}',
                                    'label' => 'Удалить'
                                ],
                                'color' => 'negative'
                            ],
                            [
                                'action' => [
                                    'type' => 'callback',
                                    'payload' => '{"action": "ok", "petitionId": ' . $petition['id'] . ', "userId": ' . $userId . '}',
                                    'label' => 'Все ок'
                                ],
                                'color' => 'positive'
                            ]
                        ]
                    ],
                    'inline' => true
                ]
            )
        ]);
    }
}
