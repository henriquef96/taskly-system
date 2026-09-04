<?php

namespace Tests\Feature\Api;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_a_user_and_returns_a_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Ana Silva',
            'email' => 'ana@example.com',
            'password' => 'Senha@123',
            'password_confirmation' => 'Senha@123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token'])
            ->assertJsonPath('user.email', 'ana@example.com');
        $this->assertTrue(
            DB::table('users')->where('email', 'ana@example.com')->exists(),
            'O cadastro deve persistir o usuário.',
        );
    }

    public function test_login_returns_a_token_for_valid_credentials_and_rejects_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'ana@example.com',
            'password' => 'Senha@123',
        ]);

        $this->postJson('/api/login', [
            'email' => 'ana@example.com',
            'password' => 'Senha@123',
        ])->assertOk()->assertJsonStructure(['user', 'token']);

        $this->postJson('/api/login', [
            'email' => 'ana@example.com',
            'password' => 'senha-incorreta',
        ])->assertUnauthorized()->assertJson([
            'message' => 'As credenciais informadas são inválidas.',
        ]);
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

    public function test_authenticated_user_can_create_update_and_delete_a_project(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/projects', [
            'name' => 'Projeto API',
            'description' => 'Projeto criado pelo teste de integração.',
        ]);

        $response->assertCreated()->assertJsonPath('data.name', 'Projeto API');
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
}
