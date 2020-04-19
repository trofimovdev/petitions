<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::resource('bootstrap', 'API\BootstrapController', ['only' => ['index', 'store']]);
Route::resource('petitions', 'API\PetitionController', ['only' => ['store', 'show']]);
Route::resource('signatures', 'API\SignatureController', ['only' => ['show', 'update', 'destroy']]);

