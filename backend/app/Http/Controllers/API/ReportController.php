<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use App\Models\Report;

class ReportController extends Controller
{
    public function store(SignRequest $request)
    {
        $petitionId = (int)$request->petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Недействительные параметры');
        }

        if (Report::getCounter($request->userId) > Report::MAX_REPORTS_PER_DAY) {
            return new ErrorResponse(403, 'В последнее время вы оставляли слишком много жалоб, попробуйте позже');
        }

        $petition = Petition::getPetitions([$petitionId]);
        if (!$petition) {
            return new ErrorResponse(404, 'Петиция не найдена');
        }

        return new OkResponse(Report::create($petitionId, $request->userId, $petition[0]));
    }
}
