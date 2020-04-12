<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use App\Models\SignedPetition;
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
        return 'store';
    }

    private function getBootstrap(SignRequest $request, array $friends = []) {
        $test = Redis::lrange('popular_petitions', 0, -1);
        if (!$test) {
            $p = ["2"];
        }
        return new OkResponse([
            'popular' => Petition::getPetitions($p),
            'last' => Petition::getLast(),
            'signed' => SignedPetition::getSigned($request->userId),
            'managed' => Petition::getManaged($request->userId),
        ]);
    }
}

