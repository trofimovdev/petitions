<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
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
        $signature = Signature::where('petition_id', '=', $petitionId)
            ->where('user_id', '=', $request->userId)
            ->exists();
        if ($signature) {
            return new ErrorResponse(409, 'Already signed');
        }

        $signature = new Signature;
        $signature->user_id = $request->userId;
        $signature->petition_id = $petitionId;
        $signature->signed_at = now();

        $signature->save();

        return new OkResponse(true);
    }

    public function destroy(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;

        $signature = Signature::where('petition_id', '=', $petitionId)
            ->where('user_id', '=', $request->userId)
            ->delete();

        if (!$signature) {
            return new ErrorResponse(404, 'Signature not found');
        }

        return new OkResponse(true);
    }
}
