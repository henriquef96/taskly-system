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
        Tag::factory()->count(20)->create();
    }
}
