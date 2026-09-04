<?php

namespace Tests\Feature\Requests\Auth;

use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class RegisterRequestTest extends TestCase
{
    use RefreshDatabase;

    private function validate(array $data): \Illuminate\Contracts\Validation\Validator
    {
        return Validator::make($data, (new RegisterRequest())->rules());
    }

    public function test_passes_with_valid_data(): void
    {
        $validator = $this->validate([
            'name' => 'Ana Silva',
            'email' => 'ana@example.com',
            'password' => 'Senha@123',
            'password_confirmation' => 'Senha@123',
        ]);

        $this->assertTrue($validator->passes());
    }

    public function test_fails_when_email_is_already_registered(): void
    {
        User::factory()->create(['email' => 'ana@example.com']);

        $validator = $this->validate([
            'name' => 'Ana Silva',
            'email' => 'ana@example.com',
            'password' => 'Senha@123',
            'password_confirmation' => 'Senha@123',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
    }

    public function test_fails_when_password_is_not_strong(): void
    {
        $validator = $this->validate([
            'name' => 'Ana Silva',
            'email' => 'ana@example.com',
            'password' => 'senha123',
            'password_confirmation' => 'senha123',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('password', $validator->errors()->toArray());
    }

    public function test_fails_when_password_confirmation_does_not_match(): void
    {
        $validator = $this->validate([
            'name' => 'Ana Silva',
            'email' => 'ana@example.com',
            'password' => 'Senha@123',
            'password_confirmation' => 'Outra@123',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('password', $validator->errors()->toArray());
    }

    public function test_fails_when_required_fields_are_missing(): void
    {
        $validator = $this->validate([]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('name', $validator->errors()->toArray());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
        $this->assertArrayHasKey('password', $validator->errors()->toArray());
    }
}
