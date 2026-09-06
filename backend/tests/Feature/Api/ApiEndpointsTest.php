<?php

namespace Tests\Feature\Api;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_a_user_and_starts_a_session(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Ana Silva',
            'email' => 'ana@example.com',
            'password' => 'Senha@123',
            'password_confirmation' => 'Senha@123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email']])
            ->assertJsonMissingPath('token')
            ->assertJsonPath('user.email', 'ana@example.com');
        $this->assertTrue(
            DB::table('users')->where('email', 'ana@example.com')->exists(),
            'O cadastro deve persistir o usuário.',
        );
    }

    public function test_login_starts_a_session_for_valid_credentials_and_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'ana@example.com',
            'password' => 'Senha@123',
        ]);

        $this->withHeaders([
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/login',
        ])->postJson('/api/login', [
            'email' => 'ana@example.com',
            'password' => 'Senha@123',
        ])->assertOk()->assertJsonStructure(['user'])->assertJsonMissingPath('token');

        $this->withHeaders([
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/dashboard',
        ])->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('user.email', 'ana@example.com');

        $this->postJson('/api/login', [
            'email' => 'ana@example.com',
            'password' => 'senha-incorreta',
        ])->assertUnauthorized()->assertJson([
            'message' => 'As credenciais informadas são inválidas.',
        ]);
    }

    public function test_authenticated_user_can_logout_with_the_same_http_method_used_by_the_frontend(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token');

        $this->withToken($token->plainTextToken)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJson(['message' => 'Logout realizado com sucesso.']);

        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->accessToken->id]);
    }

    public function test_cookie_session_user_can_logout_and_is_no_longer_authenticated(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'web')
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJson(['message' => 'Logout realizado com sucesso.']);

        $this->assertGuest('web');
    }

    public function test_authenticated_user_can_change_their_password_with_the_current_password(): void
    {
        $user = User::factory()->create(['password' => 'Senha@123']);

        $this->actingAs($user, 'web')
            ->patchJson('/api/password', [
                'current_password' => 'Senha@123',
                'password' => 'NovaSenha@456',
                'password_confirmation' => 'NovaSenha@456',
            ])
            ->assertOk()
            ->assertJson(['message' => 'Senha alterada com sucesso.']);

        $this->assertTrue(password_verify('NovaSenha@456', $user->refresh()->password));
    }

    public function test_password_change_rejects_an_incorrect_current_password(): void
    {
        $user = User::factory()->create(['password' => 'Senha@123']);

        $this->actingAs($user, 'web')
            ->patchJson('/api/password', [
                'current_password' => 'senha-incorreta',
                'password' => 'NovaSenha@456',
                'password_confirmation' => 'NovaSenha@456',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_authenticated_user_can_read_their_projects_and_cannot_read_another_users_project(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $ownedProject = Project::factory()->create(['user_id' => $user->id]);
        $otherProject = Project::factory()->create(['user_id' => $otherUser->id]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/projects')
            ->assertOk()
            ->assertJsonPath('data.0.id', $ownedProject->id);

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/projects/{$otherProject->id}")
            ->assertForbidden();
    }

    public function test_authenticated_user_can_load_the_dashboard_without_other_users_data(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $user->id]);
        $otherProject = Project::factory()->create(['user_id' => $otherUser->id]);
        $task = Task::factory()->for($project)->create(['title' => 'Tarefa do dashboard']);
        Task::factory()->for($otherProject)->create(['title' => 'Tarefa de outro usuário']);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/dashboard')
            ->assertOk()
            ->assertJsonPath('data.projects.0.id', $project->id)
            ->assertJsonPath('data.tasks.0.id', $task->id)
            ->assertJsonMissing(['title' => 'Tarefa de outro usuário']);
    }

    public function test_authenticated_user_can_create_update_and_delete_a_project(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/projects', [
            'name' => 'Projeto API',
            'description' => 'Projeto criado pelo teste de integração.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Projeto API')
            ->assertJsonPath('data.ticket_number', $response->json('data.id'));
        $projectId = $response->json('data.id');

        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/projects/{$projectId}", ['name' => 'Projeto atualizado'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Projeto atualizado');

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/projects/{$projectId}")
            ->assertNoContent();
        $this->assertFalse(
            DB::table('projects')->where('id', $projectId)->exists(),
            'A exclusão deve remover o projeto.',
        );
    }

    public function test_project_owner_can_create_update_status_and_delete_a_task(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/projects/{$project->id}/tasks", [
            'title' => 'Tarefa de integração',
            'short_description' => 'Validar o fluxo principal da API.',
        ]);

        $response->assertCreated()->assertJsonPath('data.status', 'pending');
        $taskId = $response->json('data.id');

        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/projects/{$project->id}/tasks/{$taskId}", ['title' => 'Tarefa atualizada'])
            ->assertOk()
            ->assertJsonPath('data.title', 'Tarefa atualizada');

        $this->actingAs($user, 'sanctum')
            ->patchJson("/api/tasks/{$taskId}/status", ['status' => 'completed'])
            ->assertOk()
            ->assertJsonPath('data.status', 'completed');

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/projects/{$project->id}/tasks/{$taskId}")
            ->assertNoContent();
        $this->assertFalse(
            DB::table('tasks')->where('id', $taskId)->exists(),
            'A exclusão deve remover a tarefa.',
        );
    }

    public function test_protected_api_endpoints_require_authentication(): void
    {
        $this->getJson('/api/projects')
            ->assertUnauthorized()
            ->assertJsonStructure(['message']);
    }

    public function test_task_owner_can_upload_and_delete_an_attachment(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $task = Task::factory()->for(Project::factory()->create(['user_id' => $user->id]))->create();
        $file = UploadedFile::fake()->create('manual.pdf', 100, 'application/pdf');

        $response = $this->actingAs($user, 'sanctum')
            ->post("/api/tasks/{$task->id}/attachments", ['file' => $file]);

        $response->assertCreated()
            ->assertJsonPath('data.file_name', 'manual.pdf')
            ->assertJsonPath('data.mime_type', 'application/pdf');

        $attachmentId = $response->json('data.id');
        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/attachments/{$attachmentId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('task_attachments', ['id' => $attachmentId]);
    }
}
