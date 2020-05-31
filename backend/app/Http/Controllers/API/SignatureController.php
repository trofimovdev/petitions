<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use App\Models\Signature;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SignatureController extends Controller
{
    public function show(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Недействительные параметры');
        }
        return new OkResponse(Signature::getUsers($petitionId, [$request->userId]));
    }

    public function update(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Недействительные параметры');
        }

        if (User::checkIsBanned($request->userId)) {
            return new ErrorResponse(403, 'Подозрительный аккаунт');
        }

        $signature = Signature::where('petition_id', '=', $petitionId)
            ->where('user_id', '=', $request->userId)
            ->exists();
        if ($signature) {
            return new ErrorResponse(409, 'Петиция уже подписана');
        }

        $petitions = Petition::getPetitions([$petitionId]);
        if (count($petitions) !== 1) {
            return new ErrorResponse(404, 'Петиция не найдена' . count($petitions));
        }
        $petition = $petitions[0];
        if ($petition['completed'] === true) {
            return new ErrorResponse(403, 'Сбор подписей уже завершен');
        }

        $signature = new Signature;
        $signature->petition_id = $petitionId;
        $signature->user_id = $request->userId;
        $signature->user_agent = $request->server('HTTP_USER_AGENT');
        $signature->ip = $request->ip(); // without CloudFlare
        $signature->signed_at = now();

        DB::transaction(function() use ($signature, $petitionId) {
            $signature->save();
            Petition::where('id', '=', $petitionId)
                ->increment('count_signatures');
        });

        return new OkResponse($petition['count_signatures'] + 1);
    }

    public function destroy(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Invalid params');
        }

        if (User::checkIsBanned($request->userId)) {
            return new ErrorResponse(403, 'Suspicious account');
        }

        $signature = Signature::where('petition_id', '=', $petitionId)
            ->where('user_id', '=', $request->userId)
            ->exists();
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

        $signature = Signature::where('petition_id', '=', $petitionId)
            ->where('user_id', '=', $request->userId)
            ->delete();
        if (!$signature) {
            return new ErrorResponse(500, 'Signature not deleted');
        }

        Petition::where('id', '=', $petitionId)
            ->decrement('count_signatures');
        return new OkResponse($petition['count_signatures'] - 1);
    }
}
