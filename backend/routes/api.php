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

//Route::resource('v1.0/bootstrap', 'API\v1.0\BootstrapController', ['only' => 'index']);

//Route::resource('v1.0/friends', 'FriendController', ['only' => ['index', 'store', 'show', 'destroy']]);
//Route::resource('v1.0/user', 'Api\v1.0\UserController', ['only' => ['store', 'update']]);
Route::resource('petitions', 'API\PetitionController');

