<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Petition;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
        return new OkResponse(Petition::getPetitions([$petitionId], $withOwner = true, [], true, $request->userId, true));
    }

    public function store(SignRequest $request)
    {
        if (User::checkIsBanned($request->userId)) {
            return new ErrorResponse(403, 'Suspicious account');
        }

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
                $needSignatures = (int)$request->need_signatures;
                $directedTo = (string)$request->directed_to;

                $files = [];
                $rules = [];
                if ($request->hasFile('file1')) {
                    $mobilePhoto = $request->file('file1');
                    $files['file1'] = $mobilePhoto;
                    $rules['file1'] = 'required|image|mimes:png,jpeg,jpg|max:10240'; // 10mb
                }
                if ($request->hasFile('file2')) {
                    $webPhoto = $request->file('file2');
                    $files['file2'] = $webPhoto;
                    $rules['file2'] = 'required|image|mimes:png,jpeg,jpg|max:10240'; // 10mb
                }
                if ($request->hasFile('file')) {
                    $photo = $request->file('file');
                    $files['file'] = $photo;
                    $rules['file'] = 'required|image|mimes:png,jpeg,jpg|max:10240'; // 10mb
                }
                $validator = Validator::make($files, $rules);
                if ($validator->fails()) {
                    return new ErrorResponse(400, 'Недействительные изображения');
                }

                $title = Petition::filterString($title);
                $text = Petition::filterString($text);
                $directedTo = Petition::filterString($directedTo);
                if (
                    empty($title) || empty($text) || empty($needSignatures) || ((empty($mobilePhoto) || empty($webPhoto)) && empty($photo)) ||
                    !Petition::filterString($title) || !Petition::filterString($text) || ($directedTo && !Petition::filterString($directedTo))
                ) {
                    return new ErrorResponse(400, 'Недействительное изображение');
                }
                if (empty($mobilePhoto) || empty($webPhoto)) {
                    $mobilePhoto = $photo;
                    $webPhoto = $photo;
                }

                if (mb_strlen($title) === 0 || mb_strlen($title) > 150 || mb_strlen($text) === 0 || mb_strlen($text) > 3000 || $needSignatures === 0 || $needSignatures > 10000000) {
                    return new ErrorResponse(400, 'Превышены ограничения');
                }

                $mobilePhotoSize = getimagesize($mobilePhoto);
                $webPhotoSize = getimagesize($webPhoto);
                if ($mobilePhotoSize[0] < 100 || $mobilePhotoSize[1] < 100 || $webPhotoSize[0] < 100 || $webPhotoSize[1] < 100) {
                    return new ErrorResponse(400, 'Слишком маленькое изображение');
                }

                return new OkResponse(Petition::createPetition($request, $title, $text, $needSignatures, $directedTo, $mobilePhoto, $webPhoto, $request->userId));

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

        if (User::checkIsBanned($request->userId)) {
            return new ErrorResponse(403, 'Suspicious account');
        }

        $petition = Petition::where('id', '=', $petitionId)
            ->first();
        if (!$petition) {
            return new ErrorResponse(404, 'Petition not found');
        }
        if ($petition['owner_id'] !== $request->userId) {
            return new ErrorResponse(403, 'Access denied');
        }
        $mobilePhotoUrl = explode(config('app.server_url'), $petition->mobile_photo_url)[1];
        $webPhotoUrl = explode(config('app.server_url'), $petition->web_photo_url)[1];
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

        if (User::checkIsBanned($request->userId)) {
            return new ErrorResponse(403, 'Suspicious account');
        }

        $petition = Petition::where('id', '=', $petitionId)
            ->first();
        if (!$petition) {
            return new ErrorResponse(404, 'Петиция не найдена');
        }
        if ($petition['owner_id'] !== $request->userId) {
            return new ErrorResponse(403, 'Access denied');
        }
        if ($petition['completed'] && is_null($request->completed)) {
            return new ErrorResponse(403, 'Петиция уже завершена');
        }

        $data = [];
        if (!is_null($request->title)) {
            $data['title'] = Petition::filterString((string)$request->title);
        }
        if (!is_null($request->text)) {
            $data['text'] = Petition::filterString((string)$request->text);
        }
        if (!is_null($request->need_signatures)) {
            $data['need_signatures'] = (integer)$request->need_signatures;
        }
        if ($request->directed_to) {
            $data['directed_to'] = Petition::filterString((string)$request->directed_to);
        }
        if (!is_null($request->images)) {
            if (!$request->hasFile('file1') && !$request->hasFile('file2') && !$request->hasFile('file')) {
                return new ErrorResponse(400, 'Invalid params');
            } else if ($request->hasFile('file')) {
                $photo = $request->file('file');
                $files['file'] = $photo;
                $rules['file'] = 'required|image|mimes:png,jpeg,jpg|max:10240'; // 10mb
                $validator = Validator::make($files, $rules);
                if ($validator->fails()) {
                    return new ErrorResponse(400, 'Недействительное изображение');
                }
                $photoSize = getimagesize($photo);
                if ($photoSize[0] < 100 || $photoSize[1] < 100) {
                    return new ErrorResponse(400, 'Слишком маленькое изображение');
                }
                $saveData = Petition::saveImages($photo, $photo);
                $data['mobile_photo_url'] = config('app.server_url') . 'static/' . $saveData['name'] . '_mobile.png';
                $data['web_photo_url'] = config('app.server_url') . 'static/' . $saveData['name'] . '_web.png';
                $mobilePhotoUrl = explode(config('app.server_url'), $petition['mobile_photo_url'])[1];
                $webPhotoUrl = explode(config('app.server_url'), $petition['web_photo_url'])[1];
                unlink(base_path() . '/storage/app/public/' . $mobilePhotoUrl);
                unlink(base_path() . '/storage/app/public/' . $webPhotoUrl);

            } else if ($request->hasFile('file1') || $request->hasFile('file2')) {
                $mobilePhoto = null;
                $webPhoto = null;
                if ($request->hasFile('file1')) {
                    $mobilePhoto = $request->file('file1');
                    $files['file1'] = $mobilePhoto;
                    $rules['file1'] = 'required|image|mimes:png,jpeg,jpg|max:10240'; // 10mb
                }
                if ($request->hasFile('file2')) {
                    $webPhoto = $request->file('file2');
                    $files['file2'] = $webPhoto;
                    $rules['file2'] = 'required|image|mimes:png,jpeg,jpg|max:10240'; // 10mb
                }
                $validator = Validator::make($files, $rules);
                if ($validator->fails()) {
                    return new ErrorResponse(400, 'Недействительные изображения');
                }

                if ($mobilePhoto) {
                    $mobilePhotoSize = getimagesize($mobilePhoto);
                    if ($mobilePhotoSize[0] < 100 || $mobilePhotoSize[1] < 100) {
                        return new ErrorResponse(400, 'Слишком маленькое изображение');
                    }
                }
                if ($webPhoto) {
                    $webPhotoSize = getimagesize($webPhoto);
                    if ($webPhotoSize[0] < 100 || $webPhotoSize[1] < 100) {
                        return new ErrorResponse(400, 'Слишком маленькое изображение');
                    }
                }

                $saveData = Petition::saveImages($mobilePhoto, $webPhoto);
                if ($saveData['mobilePhoto']) {
                    $data['mobile_photo_url'] = config('app.server_url') . 'static/' . $saveData['name'] . '_mobile.png';
                    $mobilePhotoUrl = explode(config('app.server_url'), $petition['mobile_photo_url'])[1];
                    unlink(base_path() . '/storage/app/public/' . $mobilePhotoUrl);
                }
                if ($saveData['webPhoto']) {
                    $data['web_photo_url'] = config('app.server_url') . 'static/' . $saveData['name'] . '_web.png';
                    $webPhotoUrl = explode(config('app.server_url'), $petition['web_photo_url'])[1];
                    unlink(base_path() . '/storage/app/public/' . $webPhotoUrl);
                }
            } else {
                return new ErrorResponse(400, 'Invalid params');
            }
        }
        if (!is_null($request->completed)) {
            $data['completed'] = (bool)$request->completed;
        }
        Petition::where('id', '=', $petitionId)
            ->update($data);

        return new OkResponse($data);
    }

    private function getPetitions(SignRequest $request, string $type = '', int $offset = 0, int $petitionId = 0, array $friendIds = [])
    {
        if ($petitionId) {
            return new OkResponse(Petition::getPetitions([$petitionId], $withOwner = true, $friendIds, true, $request->userId, true));
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
            'managed' => Petition::getManaged($request->userId, 0, $friendIds),
            'test' => $request->server('HTTP_USER_AGENT'),
            'ip' => $request->ip()
        ]);
    }
}
