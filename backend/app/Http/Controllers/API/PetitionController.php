<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Petition;

class PetitionController extends Controller
{
    public function show($petitionId)
    {
//        $stateDate = (int) $date;
//        if (empty($stateDate)) {
//            return new ErrorResponse(400, 'Invalid params');
//        }
        return new OkResponse(Petition::getPetition($petitionId));
    }

    public function test()
    {
//        $stateDate = (int) $date;
//        if (empty($stateDate)) {
//            return new ErrorResponse(400, 'Invalid params');
//        }
        return 'ok petition test';
    }
}
