<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use App\Models\Report;
use Illuminate\Http\Request;
use VK\Client\Enums\VKLanguage;
use VK\Client\VKApiClient;

class CallbackController extends Controller
{
    const CHAT_OFFSET = 2000000000;
    const CHAT_ID = 1;

    public function store(Request $request)
    {
        if ($request->secret !== config('app.callback_secret')) {
            return;
        }
        $vk = new VKApiClient(config('app.api_version'), VKLanguage::RUSSIAN);

//        $vk->messages()->send(config('app.group_api_key'), [
//            'user_id' => 165275777,
//            'random_id' => rand(PHP_INT_MIN, PHP_INT_MAX),
//            'message' => 'new event'
//        ]);

//        $vk->messages()->send(config('app.group_api_key'), [
//            'peer_id' => CallbackController::CHAT_OFFSET + CallbackController::CHAT_ID,
//            'random_id' => rand(PHP_INT_MIN, PHP_INT_MAX),
//            'message' => json_encode($request->object)
//        ]);

//        $data = $vk->messages()->getConversations(config('app.group_api_key'));
//
//        $vk->messages()->send(config('app.group_api_key'), [
//            'user_id' => 165275777,
//            'random_id' => rand(PHP_INT_MIN, PHP_INT_MAX),
//            'message' => json_encode($data)
//        ]);

        switch ($request->type) {
            case 'confirmation':
                echo config('app.callback_confirmation_code');
                break;

            case 'message_event':
                if ($request->object['payload']['action'] === 'delete') {
                    $petition = Petition::where('id', '=', $request->object['payload']['petitionId'])
                        ->first();
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
                        'keyboard' => [],
                        'message' => "Удалена\n\n" . $request->object['payload']['message'],
                        'conversation_message_id' => $request->object['conversation_message_id']
                    ]);
                    break;
                }
                $vk->messages()->edit(config('app.group_api_key'), [
                    'peer_id' => $request->object['peer_id'],
                    'keyboard' => [],
                    'message' => "Все ок\n\n" . $request->object['payload']['message'],
                    'conversation_message_id' => $request->object['conversation_message_id']
                ]);
                break;
        }
        echo 'ok';
    }
}
