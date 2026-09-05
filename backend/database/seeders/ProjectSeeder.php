<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        User::all()->each(function (User $user): void {
            Project::factory()
                ->count(8)
                ->active()
                ->create(['user_id' => $user->id]);
        });

        Project::query()->whereNull('ticket_number')->each(function (Project $project): void {
            $project->update(['ticket_number' => $project->id]);
        });
    }
}
