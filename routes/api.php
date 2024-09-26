<?php 

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Ruta za registraciju
Route::post('/register', [AuthController::class, 'register']);

// Ruta za dobijanje trenutnog korisnika (zaštićena ruta)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
