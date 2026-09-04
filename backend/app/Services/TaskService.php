<?php

namespace App\Services;

use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TaskService
{
    /** @return Collection<int, Task> */
    public function listForProject(Project $project): Collection
    {
        return $project->tasks()->with('tags')->orderBy('position')->latest('id')->get();
    }

    /** @param array<string, mixed> $data */
    public function create(Project $project, array $data): Task
    {
        $tags = $data['tags'] ?? null;
        unset($data['tags']);

        return DB::transaction(function () use ($project, $data, $tags): Task {
            $task = $project->tasks()->create($data);

            if ($tags !== null) {
                $task->tags()->sync($tags);
            }

            return $task->load('tags');
        });
    }

    /** @param array<string, mixed> $data */
    public function update(Task $task, array $data): Task
    {
        $tags = $data['tags'] ?? null;
        unset($data['tags']);

        return DB::transaction(function () use ($task, $data, $tags): Task {
            $task->update($data);

            if ($tags !== null) {
                $task->tags()->sync($tags);
            }

            return $task->refresh()->load('tags');
        });
    }

    public function updateStatus(Task $task, TaskStatus $status): Task
    {
        $task->update(['status' => $status]);

        return $task->refresh()->load('tags');
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }
}
