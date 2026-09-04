<?php

namespace Database\Factories;

use App\Enums\TaskStatus;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'title' => ucfirst(fake()->sentence(rand(3, 6))),
            'short_description' => fake()->sentence(),
            'full_description' => fake()->boolean(70) ? fake()->paragraph() : null,
            'status' => fake()->randomElement(TaskStatus::cases()),
            'due_date' => fake()->boolean(60) ? fake()->dateTimeBetween('-1 month', '+2 months') : null,
            'position' => fake()->numberBetween(0, 20),
        ];
    }

    /**
     * Indicate that the task is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TaskStatus::Pending,
        ]);
    }

    /**
     * Indicate that the task is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TaskStatus::Completed,
        ]);
    }
}
