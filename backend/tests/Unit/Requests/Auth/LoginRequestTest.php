<?php

namespace Tests\Unit\Requests\Auth;

use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class LoginRequestTest extends TestCase
{
    private function validate(array $data): \Illuminate\Contracts\Validation\Validator
    {
        return Validator::make($data, (new LoginRequest())->rules());
    }

    public function test_passes_with_valid_credentials_format(): void
    {
        $validator = $this->validate([
            'email' => 'ana@example.com',
            'password' => 'qualquer-senha',
        ]);

        $this->assertTrue($validator->passes());
    }

    public function test_does_not_require_a_strong_password(): void
    {
        $validator = $this->validate([
            'email' => 'ana@example.com',
            'password' => '123',
        ]);

        $this->assertTrue($validator->passes());
    }

    public function test_fails_when_email_is_invalid(): void
    {
        $validator = $this->validate([
            'email' => 'nao-e-um-email',
            'password' => 'qualquer-senha',
        ]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
    }

    public function test_fails_when_required_fields_are_missing(): void
    {
        $validator = $this->validate([]);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('email', $validator->errors()->toArray());
        $this->assertArrayHasKey('password', $validator->errors()->toArray());
    }
}
