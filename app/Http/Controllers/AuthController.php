<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Metoda za registraciju korisnika
    public function register(Request $request)
    {
        try {
            // Validacija podataka za registraciju
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|string|max:255|unique:users,email',
                'password' => [
                    'required',
                    'confirmed',
                    Password::min(8)->mixedCase()->numbers()->symbols()
                ]
            ]);

            // Kreiraj novog korisnika u bazi
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            // Kreiraj token za autentifikaciju
            $token = $user->createToken('main')->plainTextToken;

            return response()->json([
                'user' => $user,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    // Metoda za prijavu korisnika
    public function login(Request $request)
    {
        // Validacija podataka za login
        $credentials = $request->validate([
            'email' => 'required|email|string|exists:users,email',
            'password' => 'required|string',
            'remember' => 'boolean',
        ]);

        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        // Pokušaj prijave sa kredencijalima
        if (!Auth::attempt($credentials, $remember)) {
            return response()->json([
                'error' => 'The provided credentials are incorrect.'
            ], 422);
        }

        // Ako je prijava uspješna, preuzmi korisnika i generiši token
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    // Metoda za odjavu korisnika
    public function logout(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        // Provjeri da li je korisnik prijavljen
        if ($user) {
            // Oduzmi token koji je korišćen za autentifikaciju trenutnog zahtjeva
            $user->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out.',
            ]);
        }

        return response()->json([
            'error' => 'User not authenticated.',
        ], 401);
    }
}
