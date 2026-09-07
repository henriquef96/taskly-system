<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_merge(
        explode(',', env('CORS_ALLOWED_ORIGINS', '')),
        [
            'https://henriquef96.github.io',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ]
    ),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['X-XSRF-TOKEN'],

    'max_age' => 0,

    'supports_credentials' => true,

];