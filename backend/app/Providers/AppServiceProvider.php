<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth-login', fn ($request) => [
            Limit::perMinute(5)->by(strtolower((string) $request->input('email')).'|'.$request->ip()),
        ]);
        RateLimiter::for('auth-register', fn ($request) => [
            Limit::perMinute(3)->by($request->ip()),
        ]);
        RateLimiter::for('password-change', fn ($request) => [
            Limit::perMinute(5)->by((string) ($request->user()?->id ?? $request->ip())),
        ]);
    }
}
