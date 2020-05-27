<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Petition;
use Faker\Generator as Faker;

$factory->define(Petition::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence($nbWords = 6, $variableNbWords = true),
        'text' => $faker->realText($maxNbChars = 1500, $indexSize = 2),
        'need_signatures' => $faker->numberBetween($min = 10000, $max = 500000),
        'count_signatures' => $faker->numberBetween($min = 1000, $max = 510000),
        'owner_id' => '165275777',
        'mobile_photo_url' => 'https://petitions.trofimov.dev/static/1440x768.png',
        'web_photo_url' => 'https://petitions.trofimov.dev/static/1360x320.png',
        'completed' => $faker->randomElement($array = [true, false]),
        'directed_to' => preg_replace("/[^\Wa-zA-Z0-9 ]/", "", 'Администрации, Модераторам'),
    ];
});
