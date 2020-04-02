<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\SignedPetition;
use Faker\Generator as Faker;

$factory->define(SignedPetition::class, function (Faker $faker) {
    return [
        'petition_id' => 13,
        'user_id' => '165275777',
        'signed_at' => $faker->dateTime($max = 'now'),
    ];
});
