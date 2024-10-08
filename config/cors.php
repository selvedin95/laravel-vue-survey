<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173'],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Authorization'],  // Dodano 'Authorization'
    'max_age' => 86400,  // Postavljen pozitivan broj (24 sata)
    'supports_credentials' => true,
];
