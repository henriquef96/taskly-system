<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Seed the application's tasks.
     *
     * Cada projeto recebe entre 5 e 20 tarefas, cada tarefa é atribuída
     * a um usuário já existente (ou fica sem responsável) e recebe de
     * 0 a 3 tags aleatórias, gerando volume coerente para testar
     * paginação e filtros da API sem criar usuários "órfãos".
     */
    public function run(): void
    {
        $tagIds = Tag::pluck('id');
        $userIds = User::pluck('id');

        Project::all()->each(function (Project $project) use ($tagIds, $userIds) {
            Task::factory()
                ->count(fake()->numberBetween(5, 20))
                ->state(fn () => [
                    'project_id' => $project->id,
                    'user_id' => fake()->boolean(70) ? $userIds->random() : null,
                ])
                ->create()
                ->each(function (Task $task) use ($tagIds) {
                    $tagsToAttach = fake()->numberBetween(0, min(3, $tagIds->count()));

                    if ($tagsToAttach > 0) {
                        $task->tags()->attach($tagIds->random($tagsToAttach));
                    }
                });
        });
    }
}
