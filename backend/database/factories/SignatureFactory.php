<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Signature;
use Faker\Generator as Faker;

$factory->define(Signature::class, function (Faker $faker) use (&$id) {
    return [
        'petition_id' => rand(1, 100),
        'user_id' => rand(0, 1000000000),
        'signed_at' => $faker->dateTimeBetween($startDate = '-30 days', $endDate = 'now', $timezone = null),
    ];
});
