<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validacija podataka
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|string|max:255|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols() // Prilagođena pravila
            ]
        ]);

        // Kreiraj novog korisnika
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']), // Koristi Hash::make()
        ]);

        // Kreiraj token za autentifikaciju
        $token = $user->createToken('main')->plainTextToken;

        // Vrati odgovor sa korisničkim podacima i tokenom
        return response([
            'user' => $user,
            'token' => $token,
        ], 201); // Status 201 - Created
    }
}
