<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TagController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $order = ['Desenvolvimento', 'Revisão', 'Documentação', 'Deploy'];
        $bindings = [];
        $case = collect($order)->map(function (string $name, int $index) use (&$bindings): string {
            $bindings[] = $name;

            return "WHEN ? THEN {$index}";
        })->implode(' ');

        return TagResource::collection(
            Tag::query()->orderByRaw("CASE name {$case} ELSE 999 END", $bindings)->get(),
        );
    }
}
