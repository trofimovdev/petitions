<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Petition;

class PetitionController extends Controller
{
    public function index(SignRequest $request)
    {
        $type = (string)$request->type;
        return $this->getPetitions($request, $type);
    }

    public function show(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Invalid params');
        }
        return new OkResponse(Petition::getPetitions([$petitionId], $withOwner = true, [], true, $request->userId));
    }

    public function store(SignRequest $request)
    {
        $type = (string)$request->type;
        $offset = (int)$request->offset;
        $petitionId = (int)$request->petition_id;
        $uploadUrl = (string)$request->upload_url;
        $friendIds = [];
        if ($request->friends) {
            $friendIds = explode(",", $request->friends);
        }

        if (empty($petitionId) && !$type) {
            return $this->getPetitions($request, '', 0, 0, $friendIds);
        }

        switch ($type) {
            case 'create':
                return new OkResponse(Petition::create($request));

            case 'upload':
                if (empty($petitionId) || !$uploadUrl) {
                    return new ErrorResponse(400, 'Invalid params');
                }
                return new OkResponse(Petition::upload($petitionId, $uploadUrl));
        }

        return $this->getPetitions($request, $type, $offset, $petitionId, $friendIds);
    }

    public function destroy(SignRequest $request, $petitionId)
    {
        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Invalid params');
        }

        $petition = Petition::where('id', '=', $petitionId)
            ->first();
        if (!$petition) {
            return new ErrorResponse(404, 'Petition not found');
        }
        if (!$petition['owner_id'] === $request->userId) {
            return new ErrorResponse(403, 'Access denied');
        }
        $petition->delete();
        return new OkResponse(true);
    }

    private function getPetitions(SignRequest $request, string $type = '', int $offset = 0, int $petitionId = 0, array $friendIds = [])
    {
        if ($petitionId) {
            return new OkResponse(Petition::getPetitions([$petitionId], $withOwner = true, $friendIds, true, $request->userId));
        }

        // TODO: move to consts
        switch ($type) {
            case 'popular':
                return new OkResponse(Petition::getPetitions([22]));

            case 'last':
                return new OkResponse(Petition::getLast($offset, $friendIds));

            case 'signed':
                return new OkResponse(Petition::getSigned($request->userId, $offset, $friendIds));

            case 'managed':
                return new OkResponse(Petition::getManaged($request->userId, $offset, $friendIds));
        }

        return new OkResponse([
            'popular' => Petition::getPetitions([22]),
            'last' => Petition::getLast(0, $friendIds),
            'signed' => Petition::getSigned($request->userId, 0, $friendIds),
            'managed' => Petition::getManaged($request->userId, 0, $friendIds)
        ]);
    }
}
