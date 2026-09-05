<?php

namespace App\Services;

use App\Models\Task;
use App\Models\TaskAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class TaskAttachmentService
{
    public function store(Task $task, UploadedFile $file): TaskAttachment
    {
        $disk = Storage::disk('local');
        $directory = "tasks/{$task->id}/attachments";
        $path = $disk->putFile($directory, $file);

        if ($path === false) {
            throw new \RuntimeException('Unable to store the attachment.');
        }

        return $task->attachments()->create([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ]);
    }

    public function delete(TaskAttachment $attachment): void
    {
        if (! Storage::delete($attachment->file_path)) {
            throw new \RuntimeException('Unable to delete the attachment file.');
        }

        $attachment->delete();
    }
}
