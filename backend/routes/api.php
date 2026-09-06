<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\ProjectAttachmentController;
use Illuminate\Support\Facades\Route;
use Illuminate\Session\Middleware\StartSession;

Route::middleware(StartSession::class)->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::patch('/password', [AuthController::class, 'updatePassword']);
        Route::get('/dashboard', DashboardController::class);
        Route::get('/tags', [TagController::class, 'index']);
        Route::apiResource('projects', ProjectController::class)->except(['create', 'edit']);
        Route::scopeBindings()->group(function (): void {
            Route::apiResource('projects.tasks', TaskController::class)->except(['create', 'edit']);
        });
        Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus']);
        Route::post('/projects/{project}/attachments', [ProjectAttachmentController::class, 'store']);
        Route::get('/project-attachments/{attachment}/download', [ProjectAttachmentController::class, 'download'])
            ->name('project-attachments.download');
        Route::delete('/project-attachments/{attachment}', [ProjectAttachmentController::class, 'destroy']);
        Route::post('/tasks/{task}/attachments', [TaskController::class, 'uploadAttachment']);
        Route::get('/tasks/{task}/attachments/{attachment}/download', [TaskController::class, 'downloadAttachment']);
        Route::get('/attachments/{attachment}/download', [TaskController::class, 'downloadAttachment'])
            ->name('attachments.download');
        Route::delete('/attachments/{attachment}', [TaskController::class, 'deleteAttachment']);
    });
});
