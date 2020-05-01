<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use Illuminate\Support\Facades\Storage;

class PetitionController extends Controller
{
    public function index(SignRequest $request)
    {
        $type = (string)$request->type;
        $offset = (int)$request->offset;
        return $this->getPetitions($request, $type, $offset);
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
        $friendIds = [];
        if ($request->friends) {
            $friendIds = explode(",", $request->friends);
        }

        if (empty($petitionId) && !$type) {
            return $this->getPetitions($request, '', $offset, 0, $friendIds);
        }

        switch ($type) {
            case 'create':
                $title = (string)$request->title;
                $text = (string)$request->text;
                $needSignatures = (int)$request->signatures;
                $directedTo = (string)$request->directed_to;
                $mobilePhoto = (string)$request->file_1;
                $webPhoto = (string)$request->file_2;
                $photo = (string)$request->file;

                $title = Petition::filterString($title);
                $text = Petition::filterString($text);
                $directedTo = Petition::filterString($directedTo);
                if (
                    empty($title) || empty($text) || empty($needSignatures) || ((empty($mobilePhoto) || empty($webPhoto)) && empty($photo)) ||
                    !Petition::filterString($title) || !Petition::filterString($text) || ($directedTo && !Petition::filterString($directedTo))
                ) {
                    return new ErrorResponse(400, 'Invalid params');
                }
                if (empty($mobilePhoto) || empty($webPhoto)) {
                    $mobilePhoto = $photo;
                    $webPhoto = $photo;
                }

                if (!Petition::isBase64Image($mobilePhoto) || !Petition::isBase64Image($webPhoto)) {
                    return new ErrorResponse(400, 'Invalid image');
                }

                $mobilePhotoSize = getimagesize($mobilePhoto);
                $webPhotoSize = getimagesize($webPhoto);
                if ($mobilePhotoSize[0] < 100 || $mobilePhotoSize[1] < 100 || $webPhotoSize[0] < 100 || $webPhotoSize[1] < 100) {
                    return new ErrorResponse(400, 'Слишком маленькое изображение');
                }

                $mobilePhotoSize = $mobilePhotoSize[0] * $mobilePhotoSize[1] * $mobilePhotoSize["bits"];
                $webPhotoSize = $webPhotoSize[0] * $webPhotoSize[1] * $webPhotoSize["bits"];

                if (mb_strlen($title) === 0 || mb_strlen($title) > 150 || mb_strlen($text) === 0 || mb_strlen($text) > 3000 || $needSignatures === 0 || $needSignatures > 10000000 || $mobilePhotoSize / 8 / 1024 / 1024 > 7 || $webPhotoSize / 8 / 1024 / 1024 > 7) {
                    return new ErrorResponse(400, 'Too large');
                }

                return new OkResponse(Petition::createPetition($title, $text, $needSignatures, $directedTo, $mobilePhoto, $webPhoto, $request->userId));

            case 'upload':
                $uploadUrl = (string)$request->upload_url;
                if (empty($petitionId) || !$uploadUrl) {
                    return new ErrorResponse(400, 'Invalid params');
                }
                return new OkResponse(Petition::upload($petitionId, $uploadUrl, 'mobile'));
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
        $mobilePhotoUrl = explode('https://petitions.trofimov.dev/', $petition->mobile_photo_url)[1];
        $webPhotoUrl = explode('https://petitions.trofimov.dev/', $petition->web_photo_url)[1];
        unlink(base_path() . '/storage/app/public/' . $mobilePhotoUrl);
        unlink(base_path() . '/storage/app/public/' . $webPhotoUrl);
        $petition->delete();
        return new OkResponse(true);
    }

    public function update(SignRequest $request, $petitionId)
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

        $data = [];
        if (!is_null($request->title)) {
            $data['title'] = Petition::filterString((string)$request->title);
        }
        if (!is_null($request->text)) {
            $data['text'] = Petition::filterString((string)$request->text);
        }
        if (!is_null($request->signatures)) {
            $data['need_signatures'] = (integer)$request->signatures;
        }
        if ($request->directed_to && !is_null($request->signatures)) {
            $data['directed_to'] = Petition::filterString((string)$request->directed_to);
        }
        if (!is_null($request->images)) {
            if (is_null($request->file_1) && is_null($request->file_2) && is_null($request->file)) {
                return new ErrorResponse(400, 'Invalid params');
            } else if (!is_null($request->file)) {
                if (!Petition::isBase64Image($request->file)) {
                    return new ErrorResponse(400, 'Invalid image');
                }
                $photoSize = getimagesize($request->file);
                if ($photoSize[0] < 100 || $photoSize[1] < 100) {
                    return new ErrorResponse(400, 'Слишком маленькое изображение');
                }
                $name = Petition::saveImages($request->file, $request->file);
                $data['mobile_photo_url'] = 'https://petitions.trofimov.dev/static/' . $name . '_mobile.png';
                $data['web_photo_url'] = 'https://petitions.trofimov.dev/static/' . $name . '_web.png';
            } else if (!is_null($request->file_1) && !is_null($request->file_2)) {
                if (!Petition::isBase64Image($request->file_1) || !Petition::isBase64Image($request->file_2)) {
                    return new ErrorResponse(400, 'Invalid image');
                }
                $name = time() . bin2hex(random_bytes(5));
                $mobilePhoto = explode(',', $request->file_1)[1];
                $webPhoto = explode(',', $request->file_2)[1];
                Storage::put('public/static/' . $name . '_mobile.png', base64_decode($mobilePhoto));
                Storage::put('public/static/' . $name . '_web.png', base64_decode($webPhoto));
                $data['mobile_photo_url'] = 'https://petitions.trofimov.dev/static/' . $name . '_mobile.png';
                $data['web_photo_url'] = 'https://petitions.trofimov.dev/static/' . $name . '_web.png';
            }
        }
        if (!is_null($request->completed)) {
            $data['completed'] = (bool)$request->completed;
        }
        $petition = Petition::where('id', '=', $petitionId)
            ->update($data);

        return new OkResponse($data);
    }

    private function getPetitions(SignRequest $request, string $type = '', int $offset = 0, int $petitionId = 0, array $friendIds = [])
    {
        if ($petitionId) {
            return new OkResponse(Petition::getPetitions([$petitionId], $withOwner = true, $friendIds, true, $request->userId));
        }

        // TODO: move to consts
        switch ($type) {
            case 'popular':
                return new OkResponse(Petition::getPopular($offset, $friendIds));

            case 'last':
                return new OkResponse(Petition::getLast($offset, $friendIds));

            case 'signed':
                return new OkResponse(Petition::getSigned($request->userId, $offset, $friendIds));

            case 'managed':
                return new OkResponse(Petition::getManaged($request->userId, $offset, $friendIds));
        }

        return new OkResponse([
            'popular' => Petition::getPopular(0, $friendIds),
            'last' => Petition::getLast(0, $friendIds),
            'signed' => Petition::getSigned($request->userId, 0, $friendIds),
            'managed' => Petition::getManaged($request->userId, 0, $friendIds)
        ]);
    }
}
