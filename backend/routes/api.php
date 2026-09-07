<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProjectAttachmentController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;

// Rotas públicas de autenticação que emitem tokens Sanctum.
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth-register');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth-login');

// Rotas protegidas via Sanctum
Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::patch('/password', [AuthController::class, 'updatePassword'])->middleware('throttle:password-change');
    Route::get('/dashboard', DashboardController::class);
    Route::get('/tags', [TagController::class, 'index']);
    
    Route::apiResource('projects', ProjectController::class)->except(['create', 'edit']);

    Route::scopeBindings()->group(function (): void {
        Route::apiResource('projects.tasks', TaskController::class)->except(['create', 'edit']);
    });

    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus']);
    Route::post('/projects/{project}/attachments', [ProjectAttachmentController::class, 'store']);

    Route::scopeBindings()->group(function (): void {
        Route::get('/projects/{project}/attachments/{attachment}/download', [ProjectAttachmentController::class, 'download'])
            ->name('project-attachments.download');
        Route::delete('/projects/{project}/attachments/{attachment}', [ProjectAttachmentController::class, 'destroy']);
        Route::get('/tasks/{task}/attachments/{attachment}/download', [TaskController::class, 'downloadAttachment'])
            ->name('attachments.download');
        Route::delete('/tasks/{task}/attachments/{attachment}', [TaskController::class, 'deleteAttachment']);
    });

    Route::post('/tasks/{task}/attachments', [TaskController::class, 'uploadAttachment']);
});