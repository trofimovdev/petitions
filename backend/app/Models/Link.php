<?php

namespace App\Models;

use ErrorException;
use VK\Client\Enums\VKLanguage;
use VK\Client\VKApiClient;
use VK\Exceptions\Api\VKApiParamException;

class Link
{
    const URL_REGEX = '/\b(?:(?:https):\/\/|[-A-Z0-9+&@#\/%=~_|$?!:,.]+\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/i';

    public static function isBanned(string $link, int $try = 0)
    {
        try {
            $vk = new VKApiClient('5.103', VKLanguage::RUSSIAN);
            $data = $vk->utils()->checkLink(config('app.service'), [
                'url' => $link
            ]);
        } catch (VKApiParamException $e) {
            if ($e->getCode() === 100) {
                return false;
            }
        } catch (ErrorException $e) {
            if ($try === 5) {
                return null;
            }
            return Link::isBanned($link, $try + 1);
        }

        if ($data['status'] === 'processing') {
            return Link::isBanned($link, $try);
        }

        return $data['status'] === 'banned';
    }

    public static function filterText(string $text)
    {
        $links = [];
        preg_match_all(Link::URL_REGEX, $text, $links);
        if (!$links) {
            return $text;
        }
        foreach ($links[0] as $link) {
            if (!Link::isBanned($link)) {
                continue;
            }
            $text = str_replace($link, '', $text);
            continue;
        }
        return $text;
    }
}
