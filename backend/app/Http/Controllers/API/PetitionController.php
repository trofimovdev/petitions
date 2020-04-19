<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use App\Models\Signature;

class PetitionController extends Controller
{
//    public function getPetitions(SignRequest $request, array $friendIds = [])
//    {
//        $offset = (int)$request->offset;
//        if (
//            empty($request->type) ||
//            $request->type && !in_array($request->type, ['popular', 'last', 'signed', 'manage']) ||
//            $request->offset && empty($offset)
//        ) {
//            return new ErrorResponse(400, 'Invalid params');
//        }
//
//        $petitions = [];
//        switch ($request->type) {
//            // TODO: вынести в константы
//            case 'last':
//                $petitions = Petition::getLast($request->offset);
//                break;
//        }
//        return new OkResponse($petitions);
//    }

//    public function index(SignRequest $request, $offset = 0)
//    {
//        $offset = (int)$offset;
//        if (empty($offset)) {
//            return new ErrorResponse(400, 'Invalid params');
//        }
//
//    }

    public function store(SignRequest $request)
    {
        $friendIds = [];
        if ($request->friends) {
            $friendIds = explode(",", $request->friends);
        }

        $petitionId = (int)$request->petition_id;
        $offset = (int)$request->offset;
        if ($request->petition_id && !empty($petitionId)) {
            return new OkResponse(Petition::getPetitions([$petitionId], $withOwner = true, $friendIds, true, $request->userId));
        } else if ((!$request->offset || $request->offset && !empty($offset)) && $request->type) {
            switch ($request->type) {
                case 'popular':
                    return [];

                case 'last':
                    return new OkResponse(Petition::getLast($offset, $friendIds));

                case 'signed':
                    return new OkResponse(Petition::getSigned($request->userId, $offset, $friendIds));

                case 'managed':
                    return new OkResponse(Petition::getManaged($request->userId, $offset, $friendIds));
            }
        }
        return new ErrorResponse(400, 'Invalid params');
    }

    public function show(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Invalid params');
        }
        return new OkResponse(Petition::getPetitions([$petitionId], $withOwner = true, [], true, $request->userId));
    }
}
