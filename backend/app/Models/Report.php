<?php

namespace App\Models;

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
        if (!Redis::exists(Report::PREFIX . $userId)) {
            Redis::setex(Report::PREFIX . $userId, Report::TTL, 1);
            return;
        }
        Redis::incr(Report::PREFIX . $userId);
        return;
    }

    public static function getCounter(int $userId)
    {
        return (int)Redis::get(Report::PREFIX . $userId);
    }

    public static function create(int $userId, array $petition)
    {
        Report::incrementCounter($userId);
        $message = '@id' . $userId . ' оставил жалобу на петицию №' . $petition['id'] . ' «' . $petition['title'] . '»' . "\n\n#user" . $userId;
        $vk = new VKApiClient(config('app.api_version'), VKLanguage::RUSSIAN);
        $vk->messages()->send(config('app.group_api_key'), [
            'peer_id' => CallbackController::CHAT_OFFSET + CallbackController::CHAT_ID,
            'random_id' => rand(PHP_INT_MIN, PHP_INT_MAX),
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
                                    'payload' => '{"action": "delete", "petitionId": ' . $petition['id'] . ', "message": ' . json_encode($message) . '}',
                                    'label' => 'Удалить'
                                ],
                                'color' => 'negative'
                            ],
                            [
                                'action' => [
                                    'type' => 'callback',
                                    'payload' => '{"action": "ok", "petitionId": ' . $petition['id'] . ', "message": ' . json_encode($message) . '}',
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
