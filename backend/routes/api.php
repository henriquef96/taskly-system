<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::scopeBindings()->group(function (): void {
        Route::apiResource('projects.tasks', TaskController::class)->except(['create', 'edit']);
    });
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus']);
    Route::post('/tasks/{task}/attachments', [TaskController::class, 'uploadAttachment']);
    Route::delete('/attachments/{attachment}', [TaskController::class, 'deleteAttachment']);
});
