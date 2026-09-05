<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProjectAttachmentService
{
    public function store(Project $project, UploadedFile $file): ProjectAttachment
    {
        $disk = Storage::disk('local');
        $directory = "projects/{$project->id}/attachments";
        $path = $disk->putFile($directory, $file);

        if ($path === false) {
            throw new \RuntimeException('Unable to store the project attachment.');
        }

        return $project->attachments()->create([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ]);
    }

    public function delete(ProjectAttachment $attachment): void
    {
        if (! Storage::delete($attachment->file_path)) {
            throw new \RuntimeException('Unable to delete the project attachment file.');
        }

        $attachment->delete();
    }
}
