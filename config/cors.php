<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => env('APP_ENV') === 'local' ? ['*'] : ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // In development, use environment variable or fallback to localhost origins
        ...(env('APP_ENV') === 'local' ?
            explode(',', env('CORS_ALLOWED_ORIGINS', 'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:8000,http://localhost:8000'))
        : []),
        // In production, allow specific configured domains
        ...(env('APP_ENV') === 'production' ? [
            env('APP_URL', 'https://app.licitacao-project.orb.local'),
        ] : []),
    ],

    'allowed_origins_patterns' => [
        // Allow all localhost ports in development
        ...(env('APP_ENV') === 'local' ? [
            'http://localhost:*',
            'http://127.0.0.1:*',
        ] : []),
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => env('CORS_SUPPORTS_CREDENTIALS', env('APP_ENV') === 'local'),

];
