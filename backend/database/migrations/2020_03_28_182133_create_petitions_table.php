<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePetitionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('petitions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->longText('text');
            $table->integer('need_signatures');
            $table->integer('count_signatures');
            $table->integer('owner_id');
            $table->string('mobile_photo_url');
            $table->string('web_photo_url');
            $table->boolean('completed');
            $table->longText('directed_to')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('petitions');
    }
}
