<?php

namespace Database\Factories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tag>
 */
class TagFactory extends Factory
{
    /**
     * Curated pool of tag names coherent with the Taskly domain (software/task management).
     *
     * @var array<int, string>
     */
    private const NAMES = [
        'Urgente', 'Bug', 'Melhoria', 'Documentação', 'Frontend',
        'Backend', 'Design', 'Testes', 'Infraestrutura', 'Revisão',
        'Bloqueado', 'Pesquisa', 'Refatoração', 'Segurança', 'Performance',
        'API', 'Banco de Dados', 'UX', 'Planejamento', 'Deploy',
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement(self::NAMES),
            'color' => fake()->hexColor(),
        ];
    }
}
