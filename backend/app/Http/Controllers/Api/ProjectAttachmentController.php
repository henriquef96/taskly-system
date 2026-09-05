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

    public function destroy(ProjectAttachment $attachment): Response
    {
        Gate::authorize('delete', $attachment->project);
        $this->service->delete($attachment);

        return response()->noContent();
    }
}
