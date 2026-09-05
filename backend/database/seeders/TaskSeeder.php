<?php

namespace Database\Seeders;

use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $tagIds = Tag::pluck('id');
        $projects = Project::query()->get();
        $statuses = [
            TaskStatus::Pending,
            TaskStatus::Pending,
            TaskStatus::InProgress,
            TaskStatus::InProgress,
            TaskStatus::Completed,
            TaskStatus::Completed,
            TaskStatus::Completed,
            TaskStatus::Completed,
            TaskStatus::Completed,
            TaskStatus::Cancelled,
            TaskStatus::Pending,
            TaskStatus::InProgress,
            TaskStatus::Completed,
            TaskStatus::Completed,
            TaskStatus::Completed,
            TaskStatus::Cancelled,
        ];

        foreach ($statuses as $index => $status) {
            $task = Task::factory()->create([
                'project_id' => $projects[$index % $projects->count()]->id,
                'status' => $status,
            ]);

            $tagsToAttach = fake()->numberBetween(0, min(3, $tagIds->count()));

            if ($tagsToAttach > 0) {
                $task->tags()->attach($tagIds->random($tagsToAttach));
            }
        }

        Task::query()->whereNull('ticket_number')->each(function (Task $task): void {
            $task->update(['ticket_number' => $task->id]);
        });
    }
}
