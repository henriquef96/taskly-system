<?php

namespace Tests\Feature\Api;

use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OwnershipAndAttachmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_tags_are_limited_to_the_authenticated_user(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Tag::factory()->for($user, 'owner')->create(['name' => 'Minha tag']);
        Tag::factory()->for($otherUser, 'owner')->create(['name' => 'Tag privada']);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/tags')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Minha tag'])
            ->assertJsonMissing(['name' => 'Tag privada']);
    }

    public function test_task_attachment_download_requires_task_ownership(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $task = Task::factory()->for(Project::factory()->create(['user_id' => $user->id]))->create();
        $attachment = $task->attachments()->create([
            'file_path' => 'tasks/'.$task->id.'/attachments/manual.pdf',
            'file_name' => 'manual.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 10,
        ]);
        Storage::disk('local')->put($attachment->file_path, 'content');

        $this->actingAs($otherUser, 'sanctum')
            ->get("/api/tasks/{$task->id}/attachments/{$attachment->id}/download")
            ->assertForbidden();

        $this->actingAs($user, 'sanctum')
            ->get("/api/tasks/{$task->id}/attachments/{$attachment->id}/download")
            ->assertDownload('manual.pdf');
    }

    public function test_task_attachment_binding_rejects_an_attachment_from_another_task(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = Task::factory()->for($project)->create();
        $otherTask = Task::factory()->for($project)->create();
        $attachment = $otherTask->attachments()->create([
            'file_path' => 'tasks/'.$otherTask->id.'/attachments/other.pdf',
            'file_name' => 'other.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 10,
        ]);

        $this->actingAs($user, 'sanctum')
            ->get("/api/tasks/{$task->id}/attachments/{$attachment->id}/download")
            ->assertNotFound();
    }
}
