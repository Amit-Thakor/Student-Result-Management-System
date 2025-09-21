<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($path, '/');
$segments = explode('/', $path);

// Remove filename from path if present
if (count($segments) > 0 && strpos($segments[0], '.php') !== false) {
    array_shift($segments);
}

function sendResponse($success, $message, $data = null, $status = 200) {
    http_response_code($status);
    $response = [
        'success' => $success,
        'message' => $message
    ];
    if ($data !== null) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit();
}

// Mock data - 30 students
$mockStudents = [
    ['id' => '1', 'roll_number' => '2024001', 'name' => 'John Smith', 'email' => 'john.smith@student.edu', 'class' => '10-A', 'phone' => '123-456-7890', 'guardian_name' => 'Robert Smith', 'guardian_phone' => '123-456-7891', 'is_active' => true, 'created_at' => '2024-01-15T00:00:00Z'],
    ['id' => '2', 'roll_number' => '2024002', 'name' => 'Emily Johnson', 'email' => 'emily.johnson@student.edu', 'class' => '10-A', 'phone' => '123-456-7892', 'guardian_name' => 'Michael Johnson', 'guardian_phone' => '123-456-7893', 'is_active' => true, 'created_at' => '2024-01-16T00:00:00Z'],
    ['id' => '3', 'roll_number' => '2024003', 'name' => 'Sarah Wilson', 'email' => 'sarah.wilson@student.edu', 'class' => '10-B', 'phone' => '123-456-7894', 'guardian_name' => 'David Wilson', 'guardian_phone' => '123-456-7895', 'is_active' => true, 'created_at' => '2024-01-17T00:00:00Z'],
    ['id' => '4', 'roll_number' => '2024004', 'name' => 'Michael Brown', 'email' => 'michael.brown@student.edu', 'class' => '10-B', 'phone' => '123-456-7896', 'guardian_name' => 'Lisa Brown', 'guardian_phone' => '123-456-7897', 'is_active' => true, 'created_at' => '2024-01-18T00:00:00Z'],
    ['id' => '5', 'roll_number' => '2024005', 'name' => 'Jessica Davis', 'email' => 'jessica.davis@student.edu', 'class' => '11-A', 'phone' => '123-456-7898', 'guardian_name' => 'James Davis', 'guardian_phone' => '123-456-7899', 'is_active' => true, 'created_at' => '2024-01-19T00:00:00Z']
];

$mockCourses = [
    ['id' => '1', 'course_name' => 'Mathematics', 'course_code' => 'MATH101', 'description' => 'Basic Mathematics and Algebra', 'credits' => 4, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z'],
    ['id' => '2', 'course_name' => 'Physics', 'course_code' => 'PHY101', 'description' => 'Introduction to Physics', 'credits' => 4, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z']
];

try {
    if (empty($segments) || $segments[0] === '') {
        sendResponse(true, 'Student Result Management API v1.0', [
            'endpoints' => ['students', 'courses', 'results', 'auth']
        ]);
    }
    
    switch($segments[0]) {
        case 'students':
            if ($method === 'GET') {
                sendResponse(true, 'Students retrieved successfully', $mockStudents);
            }
            break;
            
        case 'courses':
            if ($method === 'GET') {
                sendResponse(true, 'Courses retrieved successfully', $mockCourses);
            }
            break;
            
        case 'auth':
            if (isset($segments[1]) && $segments[1] === 'login' && $method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                if ($input['email'] === 'admin@school.edu' && $input['password'] === 'password') {
                    sendResponse(true, 'Login successful', [
                        'user' => [
                            'id' => '1',
                            'name' => 'System Administrator',
                            'email' => 'admin@school.edu',
                            'role' => 'admin'
                        ],
                        'token' => 'mock-jwt-token-admin'
                    ]);
                } else {
                    sendResponse(false, 'Invalid credentials', null, 401);
                }
            }
            break;
            
        default:
            sendResponse(false, 'Endpoint not found: ' . implode('/', $segments), null, 404);
    }
} catch (Exception $e) {
    sendResponse(false, 'Internal server error: ' . $e->getMessage(), null, 500);
}
?>