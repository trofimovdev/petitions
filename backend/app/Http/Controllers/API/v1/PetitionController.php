<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\SignRequest;
use App\Http\Controllers\Controller;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Petition;

class PetitionController extends BaseController
{
    public function show(SignRequest $request)
    {
//        $stateDate = (int) $date;
//        if (empty($stateDate)) {
//            return new ErrorResponse(400, 'Invalid params');
//        }
        return new OkResponse(Petition::getPetition($request->userId));
    }

    public function test()
    {
//        $stateDate = (int) $date;
//        if (empty($stateDate)) {
//            return new ErrorResponse(400, 'Invalid params');
//        }
        return 'ok test';
    }
}
