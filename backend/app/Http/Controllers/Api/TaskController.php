<?php

namespace App\Http\Controllers\Api;

use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Requests\UpdateTaskStatusRequest;
use App\Http\Requests\UploadAttachmentRequest;
use App\Http\Resources\TaskAttachmentResource;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskAttachment;
use App\Services\TaskAttachmentService;
use App\Services\TaskService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function __construct(
        private readonly TaskService $taskService,
        private readonly TaskAttachmentService $taskAttachmentService,
    ) {}

    public function index(Project $project): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', [Task::class, $project]);

        return TaskResource::collection($this->taskService->listForProject($project));
    }

    public function store(StoreTaskRequest $request, Project $project): TaskResource
    {
        Gate::authorize('create', [Task::class, $project]);

        return new TaskResource($this->taskService->create($project, $request->validated()));
    }

    public function show(Project $project, Task $task): TaskResource
    {
        Gate::authorize('view', $task);

        return new TaskResource($task->load(['tags', 'attachments']));
    }

    public function update(UpdateTaskRequest $request, Project $project, Task $task): TaskResource
    {
        Gate::authorize('update', $task);

        return new TaskResource($this->taskService->update($task, $request->validated()));
    }

    public function destroy(Project $project, Task $task): Response
    {
        Gate::authorize('delete', $task);
        $this->taskService->delete($task);

        return response()->noContent();
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task): TaskResource
    {
        Gate::authorize('update', $task);

        return new TaskResource(
            $this->taskService->updateStatus($task, TaskStatus::from($request->validated('status'))),
        );
    }

    public function uploadAttachment(
        UploadAttachmentRequest $request,
        Task $task,
    ): TaskAttachmentResource {
        Gate::authorize('update', $task);

        $file = $request->file('file');

        if (! $file instanceof UploadedFile) {
            abort(422, 'The uploaded file is invalid.');
        }

        return new TaskAttachmentResource(
            $this->taskAttachmentService->store($task, $file),
        );
    }

    public function deleteAttachment(Task $task, TaskAttachment $attachment): Response
    {
        Gate::authorize('delete', $task);
        abort_unless($attachment->task_id === $task->id, 404);
        $this->taskAttachmentService->delete($attachment);

        return response()->noContent();
    }

    public function downloadAttachment(Task $task, TaskAttachment $attachment): BinaryFileResponse
    {
        Gate::authorize('view', $task);
        abort_unless($attachment->task_id === $task->id, 404);

        $disk = Storage::disk('local');

        return response()->download(
            $disk->path($attachment->file_path),
            $attachment->file_name,
            ['Content-Type' => $attachment->mime_type],
        );
    }
}
