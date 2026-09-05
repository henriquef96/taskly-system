<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table): void {
            $table->index(['user_id', 'created_at'], 'projects_user_created_index');
        });

        Schema::table('tasks', function (Blueprint $table): void {
            $table->index(['project_id', 'position', 'id'], 'tasks_project_position_id_index');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table): void {
            $table->dropIndex('tasks_project_position_id_index');
        });

        Schema::table('projects', function (Blueprint $table): void {
            $table->dropIndex('projects_user_created_index');
        });
    }
};
