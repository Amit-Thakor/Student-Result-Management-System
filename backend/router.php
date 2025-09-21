<?php
// Simple router for PHP built-in server
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Handle static files
if (preg_match('/\.(?:png|jpg|jpeg|gif|css|js|ico|svg)$/', $uri)) {
    return false; // Let the server handle static files
}

// Route all requests to index.php
require_once 'index.php';
?>