<?php

namespace App\Services;

use App\Enums\ProjectStatus;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    /** @return Collection<int, Project> */
    public function listForUser(User $user): Collection
    {
        return $user->projects()->withCount('tasks')->latest()->get();
    }

    public function create(User $user, array $data): Project
    {
        $data['status'] ??= ProjectStatus::Active;

        return $user->projects()->create($data);
    }

    public function update(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->refresh();
    }

    public function delete(Project $project): void
    {
        $project->delete();
    }
}
