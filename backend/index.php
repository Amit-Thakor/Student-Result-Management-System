<?php
// Simple redirect to api.php for compatibility
// This ensures the backend works with the existing frontend configuration

// Check if this is a simple root request
if ($_SERVER['REQUEST_URI'] === '/' || $_SERVER['REQUEST_URI'] === '') {
    // Return a simple API info response
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
    
    echo json_encode([
        'success' => true,
        'message' => 'Student Result Management API v1.0',
        'data' => [
            'endpoints' => ['students', 'courses', 'results', 'auth'],
            'version' => '1.0.0',
            'status' => 'active'
        ]
    ]);
    exit;
}

// For all other requests, include the api.php file
require_once 'api.php';
exit;

// Original complex routing system (commented out for now)
/*
require_once 'config/cors.php';
// Use mock database for testing - replace with real database.php when PostgreSQL is set up
require_once 'config/database_mock.php';
require_once 'utils/Response.php';
require_once 'utils/JWTHandler.php';
require_once 'models/Student.php';
require_once 'models/Course.php';
require_once 'models/Result.php';
require_once 'models/MockResult.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/StudentController.php';
require_once 'controllers/CourseController.php';
require_once 'controllers/ResultController.php';

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($path, '/');
$segments = explode('/', $path);

// Remove 'api' from path if present
if ($segments[0] === 'api') {
    array_shift($segments);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    // Route handling
    switch($segments[0]) {
        case 'auth':
            $controller = new AuthController($db);
            break;
        case 'students':
            $controller = new StudentController($db);
            break;
        case 'courses':
            $controller = new CourseController($db);
            break;
        case 'results':
            $controller = new ResultController($db);
            break;
        default:
            Response::error("Endpoint not found", 404);
    }

    // Call appropriate method
    $action = isset($segments[1]) ? $segments[1] : null;
    $id = isset($segments[2]) ? $segments[2] : null;

    switch($method) {
        case 'GET':
            if ($action && $id) {
                $controller->show($action, $id);
            } elseif ($action) {
                $controller->index($action);
            } else {
                $controller->index();
            }
            break;
        case 'POST':
            $controller->create($action);
            break;
        case 'PUT':
            $controller->update($action, $id);
            break;
        case 'DELETE':
            $controller->delete($action, $id);
            break;
        default:
            Response::error("Method not allowed", 405);
    }

} catch(Exception $e) {
    error_log($e->getMessage());
    Response::error("Internal server error", 500);
}
*/
?>