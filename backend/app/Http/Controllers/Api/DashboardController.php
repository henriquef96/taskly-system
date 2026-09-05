<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use App\Models\Project;
use App\Models\User;
use App\Services\DashboardService;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {}

    public function __invoke(): DashboardResource
    {
        $user = request()->user();
        abort_unless($user instanceof User, 401);
        Gate::authorize('viewAny', Project::class);

        return new DashboardResource($this->dashboardService->forUser($user));
    }
}
