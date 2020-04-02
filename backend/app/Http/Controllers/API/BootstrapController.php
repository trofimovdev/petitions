<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\OkResponse;
use App\Models\Petition;

class BootstrapController extends Controller
{
    public function index(SignRequest $request)
    {
        return new OkResponse([
//            'popular' => Petition::getPopular(),
            'last' => Petition::getLast(),
//            'signed' => Petition::getSigned($request->userId),
        ]);
    }
}
