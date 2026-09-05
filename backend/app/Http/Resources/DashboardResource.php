<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'projects' => ProjectResource::collection($this->resource['projects']),
            'tasks' => DashboardTaskResource::collection($this->resource['tasks']),
        ];
    }
}
