<?php

use Illuminate\Database\Seeder;

class PetitionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Petition::class, 10)->create();
    }
}
