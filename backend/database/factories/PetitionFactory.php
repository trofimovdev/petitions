<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Petition;
use Faker\Generator as Faker;

$factory->define(Petition::class, function (Faker $faker) {
    return [
        'title' => $faker->sentence($nbWords = 6, $variableNbWords = true),
        'text' => $faker->realText($maxNbChars = 200, $indexSize = 2),
        'need_signatures' => $faker->numberBetween($min = 10000, $max = 500000),
        'count_signatures' => $faker->numberBetween($min = 1000, $max = 1000000),
        'owner_id' => $faker->numberBetween($min = 1, $max = 165275777),
        'mobile_photo_url' => $faker->imageUrl($width = 1440, $height = 768),
        'web_photo_url' => $faker->imageUrl($width = 1360, $height = 300),
    ];
});
