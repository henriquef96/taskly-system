<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Seed the application's tags.
     *
     * Cria uma tag para cada nome curado na TagFactory, garantindo
     * um conjunto fixo e coerente de tags para o domínio do Taskly.
     */
    public function run(): void
    {
        Tag::query()->delete();

        Tag::query()->insert([
            ['name' => 'Desenvolvimento', 'color' => '#BFDBFE', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Revisão', 'color' => '#DDD6FE', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Documentação', 'color' => '#FEF3C7', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Deploy', 'color' => '#BBF7D0', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
