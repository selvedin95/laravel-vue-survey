<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function ($request){
    return $request->user();
});
Route::post('/register', [AuthController::class, 'register']);