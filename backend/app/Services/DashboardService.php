<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;

class DashboardService
{
    /**
     * @return array{projects: \Illuminate\Database\Eloquent\Collection<int, Project>, tasks: \Illuminate\Database\Eloquent\Collection<int, Task>}
     */
    public function forUser(User $user): array
    {
        $projects = $user->projects()
            ->select(['id', 'ticket_number', 'user_id', 'name', 'description', 'status', 'created_at', 'updated_at'])
            ->withCount('tasks')
            ->latest()
            ->get();

        if ($projects->isEmpty()) {
            return ['projects' => $projects, 'tasks' => (new Task())->newCollection()];
        }

        $tasks = Task::query()
            ->whereIn('project_id', $projects->modelKeys())
            ->with(['tags', 'attachments'])
            ->orderBy('position')
            ->latest('id')
            ->get();

        return ['projects' => $projects, 'tasks' => $tasks];
    }
}
