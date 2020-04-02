<?php

use Illuminate\Database\Seeder;

class SignedPetitionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Models\SignedPetition::class, 1)->create();
    }
}
