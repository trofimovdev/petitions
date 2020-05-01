<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use App\Models\Signature;

class SignatureController extends Controller
{
    public function show(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Invalid params');
        }
        return new OkResponse(Signature::getUsers($petitionId, [$request->userId]));
    }

    public function update(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Invalid params');
        }

        $signature = Signature::where('petition_id', '=', $petitionId)
            ->where('user_id', '=', $request->userId)
            ->exists();
        if ($signature) {
            return new ErrorResponse(409, 'Already signed');
        }

        $petitions = Petition::getPetitions([$petitionId]);
        if (count($petitions) !== 1) {
            return new ErrorResponse(404, 'Petition not found');
        }
        $petition = $petitions[0];
        if ($petition['completed'] === true) {
            return new ErrorResponse(403, 'Signature completed');
        }

        $signature = new Signature;
        $signature->user_id = $request->userId;
        $signature->petition_id = $petitionId;
        $signature->signed_at = now();
        $signature->save();
        Petition::where('id', '=', $petitionId)
            ->update(['count_signatures' => $petition['count_signatures'] + 1]);

        return new OkResponse($petition['count_signatures'] + 1);
    }

    public function destroy(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Invalid params');
        }

        $signature = Signature::where('petition_id', '=', $petitionId)
            ->where('user_id', '=', $request->userId);
        if (!$signature) {
            return new ErrorResponse(404, 'Signature not found');
        }

        $petitions = Petition::getPetitions([$petitionId]);
        if (count($petitions) !== 1) {
            return new ErrorResponse(404, 'Petition not found');
        }
        $petition = $petitions[0];
        if ($petition['completed'] === true) {
            return new ErrorResponse(403, 'Signature completed');
        }

        $signature->delete();
        Petition::where('id', '=', $petitionId)
            ->update(['count_signatures' => $petition['count_signatures'] - 1]);

        return new OkResponse($petition['count_signatures'] - 1);
    }
}
