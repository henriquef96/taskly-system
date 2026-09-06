<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        Tag::query()->delete();

        $tags = [
            ['name' => 'Desenvolvimento', 'color' => '#BFDBFE'],
            ['name' => 'Revisão', 'color' => '#DDD6FE'],
            ['name' => 'Documentação', 'color' => '#FEF3C7'],
            ['name' => 'Deploy', 'color' => '#BBF7D0'],
        ];

        User::query()->each(function (User $user) use ($tags): void {
            $user->tags()->createMany($tags);
        });
    }
}
