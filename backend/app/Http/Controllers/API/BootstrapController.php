<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use App\Models\SignedPetition;
use App\Models\User;
use Illuminate\Support\Facades\Redis;

class BootstrapController extends Controller
{
    public function index(SignRequest $request)
    {
        $test = Redis::lrange('popular_petitions', 0, -1);
        if (!$test) {
            $p = ["1", "2", "3", "4"];
        }
        $popular = Petition::getPetitions($p);
        return new OkResponse([
            'test' => $popular,
//            'popular' => Petition::getPopular(),
            'last' => Petition::getLast(),
            'signed' => SignedPetition::getSigned($request->userId),
        ]);
    }
}
