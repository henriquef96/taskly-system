<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadProjectAttachmentRequest;
use App\Http\Resources\ProjectAttachmentResource;
use App\Models\Project;
use App\Models\ProjectAttachment;
use App\Services\ProjectAttachmentService;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProjectAttachmentController extends Controller
{
    public function __construct(private readonly ProjectAttachmentService $service) {}

    public function store(UploadProjectAttachmentRequest $request, Project $project): ProjectAttachmentResource
    {
        Gate::authorize('update', $project);
        $file = $request->file('file');
        abort_unless($file instanceof UploadedFile, 422, 'The uploaded file is invalid.');

        return new ProjectAttachmentResource($this->service->store($project, $file));
    }

    public function destroy(Project $project, ProjectAttachment $attachment): Response
    {
        Gate::authorize('delete', $project);
        abort_unless($attachment->project_id === $project->id, 404);
        $this->service->delete($attachment);

        return response()->noContent();
    }

    public function download(Project $project, ProjectAttachment $attachment): BinaryFileResponse
    {
        Gate::authorize('view', $project);
        abort_unless($attachment->project_id === $project->id, 404);

        $disk = Storage::disk('local');

        return response()->download(
            $disk->path($attachment->file_path),
            $attachment->file_name,
            ['Content-Type' => $attachment->mime_type],
        );
    }
}
