<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;
use VK\Client\Enums\VKLanguage;
use VK\Client\VKApiClient;

class AddCallbackServer extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'callback:add {title}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add callback server';

    const KEY = 'callback_confirmation_code';
    const TTL = 3600;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $vk = new VKApiClient(config('app.api_version'), VKLanguage::RUSSIAN);
        $code = $vk->groups()->getCallbackConfirmationCode(config('app.group_api_key'), [
            'group_id' => config('app.group_id')
        ]);
        Redis::setex(AddCallbackServer::KEY, AddCallbackServer::TTL, $code['code']);
        $server_id = $vk->groups()->addCallbackServer(config('app.group_api_key'), [
            'group_id' => config('app.group_id'),
            'url' => config('app.server_url') . 'api/callback',
            'title' => $this->argument('title'),
            'secret_key' => config('app.callback_secret')
        ]);
        $vk->groups()->setCallbackSettings(config('app.group_api_key'), [
            'group_id' => config('app.group_id'),
            'server_id' => $server_id['server_id'],
            'api_version' => config('app.api_version'),
            'message_new' => 1,
            'message_event' => 1
        ]);

    }
}
