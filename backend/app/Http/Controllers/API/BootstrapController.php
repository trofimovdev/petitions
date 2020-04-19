<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use App\Models\Signature;
use App\Models\User;
use Illuminate\Support\Facades\Redis;

class BootstrapController extends Controller
{
    public function index(SignRequest $request)
    {
        return $this->getBootstrap($request);
    }

    public function store(SignRequest $request)
    {
        if ($request->with_friends) {
            return $this->getBootstrap($request, explode(',', $request->friends));
        }
        return $this->getBootstrap($request);
    }

    private function getBootstrap(SignRequest $request, array $friendIds = []) {
        $test = Redis::lrange('popular_petitions', 0, -1);
        if (!$test) {
            $p = ["3"];
        }
        return new OkResponse([
            'popular' => Petition::getPetitions($p),
            'last' => Petition::getLast(0, $friendIds),
            'signed' => Petition::getSigned($request->userId, 0, $friendIds),
            'managed' => Petition::getManaged($request->userId, 0)
        ]);
    }
}

