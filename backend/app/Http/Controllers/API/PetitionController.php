<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller as Controller;
use App\Http\Requests\SignRequest;
use App\Http\Responses\ErrorResponse;
use App\Http\Responses\OkResponse;
use App\Models\Link;
use App\Models\Petition;
use App\Models\User;
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
        $defaultImages = (bool)($request->type !== Petition::ACTION_TYPE_EDIT);
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Недействительные параметры');
        }
        return new OkResponse(Petition::getPetitions([$petitionId], true, [], true, $request->userId, true, true, $defaultImages));
    }

    public function store(SignRequest $request)
    {
        if (User::checkIsBanned($request->userId)) {
            return new ErrorResponse(403, 'Подозрительный аккаунт');
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
                if (!Petition::checkPermissions($request)) {
                    return new ErrorResponse(403, 'Доступ запрещен');
                }

                $title = (string)$request->title;
                $text = (string)$request->text;
                $needSignatures = (int)$request->need_signatures;
                $directedTo = (string)$request->directed_to;
                $photo = null;
                $mobilePhoto = null;
                $webPhoto = null;

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

                $title = Petition::filterString(Link::filterText($title));
                $text = Petition::filterString(Link::filterText($text));
                $directedTo = Petition::filterString(Link::filterText($directedTo));
                $directedTo = isset($directedTo) && !is_null($directedTo) ? $directedTo : null;

                if (is_null($title) || is_null($text) || is_null($needSignatures)) {
                    return new ErrorResponse(400, 'Недействительные параметры');
                }

                if (mb_strlen($title) === 0 || mb_strlen($title) > 150 ||
                    mb_strlen($text) === 0 || mb_strlen($text) > 3000 ||
                    $needSignatures < 1 || $needSignatures > 10000000 ||
                    mb_strlen($directedTo) > 255
                ) {
                    return new ErrorResponse(400, 'Недействительные параметры');
                }

                if (!is_null($mobilePhoto)) {
                    $mobilePhotoSize = getimagesize($mobilePhoto);
                    if ($mobilePhotoSize[0] < 100 || $mobilePhotoSize[1] < 100) {
                        return new ErrorResponse(400, 'Слишком маленькое изображение');
                    }
                }

                if (!is_null($webPhoto)) {
                    $webPhotoSize = getimagesize($webPhoto);
                    if ($webPhotoSize[0] < 100 || $webPhotoSize[1] < 100) {
                        return new ErrorResponse(400, 'Слишком маленькое изображение');
                    }
                }

                if ((is_null($mobilePhoto) || is_null($webPhoto)) && !is_null($photo)) {
                    $mobilePhoto = $photo;
                    $webPhoto = $photo;
                }

                if (Petition::getCreatedPetitionsNumber($request->userId) > Petition::MAX_PETITIONS_PER_HOUR) {
                    return new ErrorResponse(403, 'В последнее время вы создавали слишком много петиций');
                }

                $createdPetition = Petition::createPetition($request, $title, $text, $needSignatures, $directedTo, $mobilePhoto, $webPhoto);
                if (is_null($createdPetition['mobile_photo_url'])) {
                    $createdPetition['mobile_photo_url'] = config('app.server_url') . 'static/' . Petition::DEFAULT_MOBILE_IMAGE_NAME;
                }
                if (is_null($createdPetition['web_photo_url'])) {
                    $createdPetition['web_photo_url'] = config('app.server_url') . 'static/' . Petition::DEFAULT_WEB_IMAGE_NAME;
                }
                return new OkResponse($createdPetition);
        }

        return $this->getPetitions($request, $type, $offset, $petitionId, $friendIds);
    }

    public function destroy(SignRequest $request, $petitionId)
    {
        if (!Petition::checkPermissions($request)) {
            return new ErrorResponse(403, 'Доступ запрещен');
        }

        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Недействительные параметры');
        }

        if (User::checkIsBanned($request->userId)) {
            return new ErrorResponse(403, 'Подозрительный аккаунт');
        }

        $petition = Petition::where('id', '=', $petitionId)
            ->first();
        if (!$petition) {
            return new ErrorResponse(404, 'Петиция не найдена');
        }
        if (!Petition::checkPermissions($request, $petition)) {
            return new ErrorResponse(403, 'Доступ запрещен');
        }

        if (!is_null($petition->mobile_photo_url)) {
            $mobilePhotoUrl = explode(config('app.server_url'), $petition->mobile_photo_url)[1];
            unlink(base_path() . '/storage/app/public/' . $mobilePhotoUrl);
        }
        if (!is_null($petition->web_photo_url)) {
            $webPhotoUrl = explode(config('app.server_url'), $petition->web_photo_url)[1];
            unlink(base_path() . '/storage/app/public/' . $webPhotoUrl);
        }
        $petition->delete();
        return new OkResponse(true);
    }

    public function update(SignRequest $request, $petitionId)
    {
        if (!Petition::checkPermissions($request)) {
            return new ErrorResponse(403, 'Доступ запрещен');
        }

        $petitionId = (int)$petitionId;
        if (empty($petitionId)) {
            return new ErrorResponse(400, 'Недействительные параметры');
        }

        if (User::checkIsBanned($request->userId)) {
            return new ErrorResponse(403, 'Подозрительный аккаунт');
        }

        $petition = Petition::where('id', '=', $petitionId)
            ->first();
        if (!$petition) {
            return new ErrorResponse(404, 'Петиция не найдена');
        }
        if (!Petition::checkPermissions($request, $petition)) {
            return new ErrorResponse(403, 'Доступ запрещен');
        }
        if ($petition['completed'] && is_null($request->completed)) {
            return new ErrorResponse(403, 'Петиция уже завершена');
        }

        $text = Petition::filterString(Link::filterText((string)$request->text));
        $directedTo = Petition::filterString(Link::filterText((string)$request->directed_to));

        $data = [];
        if (isset($request->text) && !is_null($text)) {
            $data['text'] = $text;
        }
        if (isset($request->need_signatures)) {
            $data['need_signatures'] = (integer)$request->need_signatures;
        }
        if (isset($request->directed_to) && !is_null($directedTo)) {
            $data['directed_to'] = $directedTo;
        }
        if (isset($request->completed)) {
            $data['completed'] = (bool)$request->completed;
        }

        if (
            (isset($data['text']) && (mb_strlen($data['text']) === 0 || mb_strlen($data['text']) > 3000)) ||
            (isset($data['need_signatures']) && ($data['need_signatures'] < 1 || $data['need_signatures'] > 10000000)) ||
            (isset($data['directed_to']) && mb_strlen($data['directed_to']) > 255)
        ) {
            return new ErrorResponse(400, 'Недействительные параметры');
        }

        $photo = null;
        $mobilePhoto = null;
        $webPhoto = null;

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

        if (!is_null($mobilePhoto)) {
            $mobilePhotoSize = getimagesize($mobilePhoto);
            if ($mobilePhotoSize[0] < 100 || $mobilePhotoSize[1] < 100) {
                return new ErrorResponse(400, 'Слишком маленькое изображение');
            }
        }

        if (!is_null($webPhoto)) {
            $webPhotoSize = getimagesize($webPhoto);
            if ($webPhotoSize[0] < 100 || $webPhotoSize[1] < 100) {
                return new ErrorResponse(400, 'Слишком маленькое изображение');
            }
        }

        if ((is_null($mobilePhoto) || is_null($webPhoto)) && !is_null($photo)) {
            $mobilePhoto = $photo;
            $webPhoto = $photo;
        }

        $name = time() . bin2hex(random_bytes(5));

        if (!is_null($petition['mobile_photo_url']) && ($request->file === 'delete' || $request->file1 === 'delete' || !is_null($mobilePhoto))) {
            $data['mobile_photo_url'] = null;
            $mobilePhotoUrl = explode(config('app.server_url'), $petition['mobile_photo_url'])[1];
            unlink(base_path() . '/storage/app/public/' . $mobilePhotoUrl);
        }
        if (!is_null($mobilePhoto)) {
            $mobilePhotoName = Petition::saveImage($mobilePhoto, Petition::IMAGE_TYPE_MOBILE, $name);
            $data['mobile_photo_url'] = config('app.server_url') . 'static/' . $mobilePhotoName;
        }


        if (!is_null($petition['web_photo_url']) && ($request->file === 'delete' || $request->file2 === 'delete' || !is_null($webPhoto))) {
            $data['web_photo_url'] = null;
            $webPhotoUrl = explode(config('app.server_url'), $petition['web_photo_url'])[1];
            unlink(base_path() . '/storage/app/public/' . $webPhotoUrl);
        }
        if (!is_null($webPhoto)) {
            $webPhotoName = Petition::saveImage($webPhoto, Petition::IMAGE_TYPE_WEB, $name);
            $data['web_photo_url'] = config('app.server_url') . 'static/' . $webPhotoName;
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

        switch ($type) {
            case Petition::TYPE_POPULAR:
                return new OkResponse(Petition::getPopular($offset, $friendIds));

            case Petition::TYPE_LAST:
                return new OkResponse(Petition::getLast($offset, $friendIds, $request->groupId));

            case Petition::TYPE_SIGNED:
                return new OkResponse(Petition::getSigned($request->userId, $offset, $friendIds));

            case Petition::TYPE_MANAGED:
                if ($request->groupId && in_array($request->viewerGroupRole, ['moder', 'editor', 'admin'])) {
                    return new OkResponse(Petition::getManaged($request->userId, $offset, $friendIds, $request->groupId));
                }
                return new OkResponse(Petition::getManaged($request->userId, $offset, $friendIds));

            default:
                if ($request->groupId && in_array($request->viewerGroupRole, ['moder', 'editor', 'admin'])) {
                    return new OkResponse([
                        Petition::TYPE_LAST => Petition::getLast(0, $friendIds, $request->groupId),
                        Petition::TYPE_MANAGED => Petition::getManaged($request->userId, 0, $friendIds, $request->groupId),
                    ]);
                } else if ($request->groupId) {
                    return new OkResponse([
                        Petition::TYPE_LAST => Petition::getLast(0, $friendIds, $request->groupId)
                    ]);
                }
                return new OkResponse([
                    Petition::TYPE_POPULAR => Petition::getPopular(0, $friendIds),
                    Petition::TYPE_LAST => Petition::getLast(0, $friendIds),
                    Petition::TYPE_SIGNED => Petition::getSigned($request->userId, 0, $friendIds),
                    Petition::TYPE_MANAGED => Petition::getManaged($request->userId, 0, $friendIds),
                    'vkopt' => Link::filterText('lol kek как дела vkopt.ru у меня все найс')
                ]);
        }
    }
}
