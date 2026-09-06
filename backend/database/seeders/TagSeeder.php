<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
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
