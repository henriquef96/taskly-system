<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Seed the application's projects.
     *
     * Cada usuário recebe entre 2 e 5 projetos, garantindo volume
     * suficiente para validar a paginação da API.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            Project::factory()
                ->count(fake()->numberBetween(2, 5))
                ->create(['user_id' => $user->id]);
        });
    }
}
