<?php

namespace App\Http\Controllers\API;

use App\Console\Commands\AddCallbackServer;
use App\Consts;
use App\Http\Controllers\Controller as Controller;
use App\Models\Petition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use VK\Client\Enums\VKLanguage;
use VK\Client\VKApiClient;

class CallbackController extends Controller
{
    public function store(Request $request)
    {
        if ($request->secret !== config('app.callback_secret')) {
            return;
        }
        $vk = new VKApiClient(Consts::API_VERSION, VKLanguage::RUSSIAN);
        switch ($request->type) {
            case 'confirmation':
                echo Redis::get(AddCallbackServer::KEY);
                return;

            case 'message_event':
                if ($request->object['peer_id'] !== (int)config('app.reports_peer_id')) {
                    break;
                }
                $petition = Petition::where('id', '=', $request->object['payload']['petitionId'])
                    ->first();
                $message = '@id' . $request->object['payload']['userId'] . ' оставил жалобу на петицию №' . $petition['id'] . ' «' . $petition['title'] . '»' . "\n\n#user" . $request->object['payload']['userId'];
                if ($request->object['payload']['action'] === 'delete') {
                    if ($petition) {
                        if (!is_null($petition->mobile_photo_url)) {
                            $mobilePhotoUrl = explode(config('app.server_url'), $petition->mobile_photo_url)[1];
                            unlink(base_path() . '/storage/app/public/' . $mobilePhotoUrl);
                        }
                        if (!is_null($petition->web_photo_url)) {
                            $webPhotoUrl = explode(config('app.server_url'), $petition->web_photo_url)[1];
                            unlink(base_path() . '/storage/app/public/' . $webPhotoUrl);
                        }
                        $petition->delete();
                    }
                    $vk->messages()->edit(config('app.group_api_key'), [
                        'peer_id' => $request->object['peer_id'],
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
                                    ]
                                ],
                                'inline' => true
                            ]
                        ),
                        'message' => "Удалена\n\n" . $message,
                        'conversation_message_id' => $request->object['conversation_message_id']
                    ]);
                    break;
                }
                $vk->messages()->edit(config('app.group_api_key'), [
                    'peer_id' => $request->object['peer_id'],
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
                                ]
                            ],
                            'inline' => true
                        ]
                    ),
                    'message' => "Все ок\n\n" . $message,
                    'conversation_message_id' => $request->object['conversation_message_id']
                ]);
                break;
        }
        echo 'ok';
    }
}
