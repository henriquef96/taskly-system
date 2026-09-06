<?php

namespace Database\Factories;

use App\Models\Tag;
use App\Models\User;
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
    private const TAGS = [
        ['name' => 'Desenvolvimento', 'color' => '#BFDBFE'],
        ['name' => 'Revisão', 'color' => '#DDD6FE'],
        ['name' => 'Documentação', 'color' => '#FEF3C7'],
        ['name' => 'Deploy', 'color' => '#BBF7D0'],
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            ...fake()->randomElement(self::TAGS),
        ];
    }
}
