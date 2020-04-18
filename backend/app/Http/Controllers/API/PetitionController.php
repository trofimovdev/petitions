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
    public function show(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Invalid params');
        }
        return new OkResponse(Petition::getPetitions([$petitionId], $with_owner = true));
    }

    public function index(SignRequest $request)
    {
        $offset = (int)$request->offset;
        if (
            empty($request->type) ||
            $request->type && !in_array($request->type, ['popular', 'last', 'signed', 'manage']) ||
            $request->offset && empty($offset)
        ) {
            return new ErrorResponse(400, 'Invalid params');
        }

        $petitions = [];
        switch ($request->type) {
            // TODO: вынести в константы
            case 'last':
                $petitions = Petition::getLast($request->offset);
                break;

            case 'signed':
                $petitions = Signature::get($request->offset);
                break;
        }
        return new OkResponse(Petition::getPetitionsByType($request->type, $offset));
    }
}
