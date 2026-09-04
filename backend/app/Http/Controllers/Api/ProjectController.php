<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService,
    ) {}

    public function index(): JsonResponse
    {
        $user = $this->authenticatedUser();
        Gate::authorize('viewAny', Project::class);

        return response()->json($this->projectService->listForUser($user));
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $user = $this->authenticatedUser();
        Gate::authorize('create', Project::class);

        return response()->json(
            $this->projectService->create($user, $request->validated()),
            201,
        );
    }

    public function show(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        return response()->json($project);
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        Gate::authorize('update', $project);

        return response()->json(
            $this->projectService->update($project, $request->validated()),
        );
    }

    public function destroy(Project $project): JsonResponse
    {
        Gate::authorize('delete', $project);
        $this->projectService->delete($project);

        return response()->json(status: 204);
    }

    private function authenticatedUser(): User
    {
        $user = auth()->user();

        abort_unless($user instanceof User, 401);

        return $user;
    }
}
