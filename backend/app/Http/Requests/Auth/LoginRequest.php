<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Endpoint público de login: qualquer visitante pode tentar autenticar.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normaliza o e-mail antes da validação para manter consistência com
     * o valor gravado no cadastro (ver RegisterRequest).
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->email)) {
            $this->merge([
                'email' => strtolower(trim($this->email)),
            ]);
        }
    }

    /**
     * Apenas formato é validado aqui; a senha não precisa seguir a regra de
     * senha forte no login — essa é responsabilidade do cadastro. A
     * verificação das credenciais (e-mail existe, senha confere) é feita
     * pelo service/controller de autenticação, não pelo Form Request.
     *
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'O e-mail é obrigatório.',
            'email.email' => 'Informe um e-mail válido.',
            'password.required' => 'A senha é obrigatória.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'email' => 'e-mail',
            'password' => 'senha',
        ];
    }
}
