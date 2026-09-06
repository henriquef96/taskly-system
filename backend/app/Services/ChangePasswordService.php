<?php

namespace App\Services;

use App\Models\User;

class ChangePasswordService
{
    public function execute(User $user, string $password): void
    {
        $user->update([
            'password' => $password,
        ]);
    }
}
