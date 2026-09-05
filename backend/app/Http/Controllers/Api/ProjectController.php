<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        $user = $this->authenticatedUser();
        Gate::authorize('viewAny', Project::class);

        return ProjectResource::collection($this->projectService->listForUser($user));
    }

    public function store(StoreProjectRequest $request): ProjectResource
    {
        $user = $this->authenticatedUser();
        Gate::authorize('create', Project::class);

        return new ProjectResource(
            $this->projectService->create($user, $request->validated())->loadCount('tasks'),
        );
    }

    public function show(Project $project): ProjectResource
    {
        Gate::authorize('view', $project);

        return new ProjectResource($project->load(['attachments'])->loadCount('tasks'));
    }

    public function update(UpdateProjectRequest $request, Project $project): ProjectResource
    {
        Gate::authorize('update', $project);

        return new ProjectResource(
            $this->projectService->update($project, $request->validated())->loadCount('tasks'),
        );
    }

    public function destroy(Project $project): Response
    {
        Gate::authorize('delete', $project);
        $this->projectService->delete($project);

        return response()->noContent();
    }

    private function authenticatedUser(): User
    {
        $user = request()->user();

        abort_unless($user instanceof User, 401);

        return $user;
    }
}
