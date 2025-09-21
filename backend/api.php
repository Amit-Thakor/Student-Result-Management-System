<?php
require_once 'utils/jwt.php';

header('Content-Type: application/json');
// Allow multiple origins for development
$allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: *');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// Log all requests for debugging
error_log("Request: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    error_log("POST Body: " . $input);
}

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
    ['id' => '5', 'roll_number' => '2024005', 'name' => 'Jessica Davis', 'email' => 'jessica.davis@student.edu', 'class' => '11-A', 'phone' => '123-456-7898', 'guardian_name' => 'James Davis', 'guardian_phone' => '123-456-7899', 'is_active' => true, 'created_at' => '2024-01-19T00:00:00Z'],
    ['id' => '6', 'roll_number' => '2024006', 'name' => 'David Miller', 'email' => 'david.miller@student.edu', 'class' => '11-A', 'phone' => '123-456-7900', 'guardian_name' => 'Susan Miller', 'guardian_phone' => '123-456-7901', 'is_active' => true, 'created_at' => '2024-01-20T00:00:00Z'],
    ['id' => '7', 'roll_number' => '2024007', 'name' => 'Ashley Garcia', 'email' => 'ashley.garcia@student.edu', 'class' => '11-B', 'phone' => '123-456-7902', 'guardian_name' => 'Carlos Garcia', 'guardian_phone' => '123-456-7903', 'is_active' => true, 'created_at' => '2024-01-21T00:00:00Z'],
    ['id' => '8', 'roll_number' => '2024008', 'name' => 'Christopher Lee', 'email' => 'christopher.lee@student.edu', 'class' => '11-B', 'phone' => '123-456-7904', 'guardian_name' => 'Maria Lee', 'guardian_phone' => '123-456-7905', 'is_active' => true, 'created_at' => '2024-01-22T00:00:00Z'],
    ['id' => '9', 'roll_number' => '2024009', 'name' => 'Amanda Rodriguez', 'email' => 'amanda.rodriguez@student.edu', 'class' => '12-A', 'phone' => '123-456-7906', 'guardian_name' => 'Jose Rodriguez', 'guardian_phone' => '123-456-7907', 'is_active' => true, 'created_at' => '2024-01-23T00:00:00Z'],
    ['id' => '10', 'roll_number' => '2024010', 'name' => 'Matthew Martinez', 'email' => 'matthew.martinez@student.edu', 'class' => '12-A', 'phone' => '123-456-7908', 'guardian_name' => 'Ana Martinez', 'guardian_phone' => '123-456-7909', 'is_active' => true, 'created_at' => '2024-01-24T00:00:00Z'],
    ['id' => '11', 'roll_number' => '2024011', 'name' => 'Lauren Anderson', 'email' => 'lauren.anderson@student.edu', 'class' => '12-B', 'phone' => '123-456-7910', 'guardian_name' => 'Kevin Anderson', 'guardian_phone' => '123-456-7911', 'is_active' => true, 'created_at' => '2024-01-25T00:00:00Z'],
    ['id' => '12', 'roll_number' => '2024012', 'name' => 'Joshua Taylor', 'email' => 'joshua.taylor@student.edu', 'class' => '12-B', 'phone' => '123-456-7912', 'guardian_name' => 'Jennifer Taylor', 'guardian_phone' => '123-456-7913', 'is_active' => true, 'created_at' => '2024-01-26T00:00:00Z'],
    ['id' => '13', 'roll_number' => '2024013', 'name' => 'Samantha Thomas', 'email' => 'samantha.thomas@student.edu', 'class' => '10-A', 'phone' => '123-456-7914', 'guardian_name' => 'Mark Thomas', 'guardian_phone' => '123-456-7915', 'is_active' => true, 'created_at' => '2024-01-27T00:00:00Z'],
    ['id' => '14', 'roll_number' => '2024014', 'name' => 'Daniel Jackson', 'email' => 'daniel.jackson@student.edu', 'class' => '10-A', 'phone' => '123-456-7916', 'guardian_name' => 'Patricia Jackson', 'guardian_phone' => '123-456-7917', 'is_active' => true, 'created_at' => '2024-01-28T00:00:00Z'],
    ['id' => '15', 'roll_number' => '2024015', 'name' => 'Megan White', 'email' => 'megan.white@student.edu', 'class' => '10-B', 'phone' => '123-456-7918', 'guardian_name' => 'Brian White', 'guardian_phone' => '123-456-7919', 'is_active' => true, 'created_at' => '2024-01-29T00:00:00Z'],
    ['id' => '16', 'roll_number' => '2024016', 'name' => 'Andrew Harris', 'email' => 'andrew.harris@student.edu', 'class' => '10-B', 'phone' => '123-456-7920', 'guardian_name' => 'Michelle Harris', 'guardian_phone' => '123-456-7921', 'is_active' => true, 'created_at' => '2024-01-30T00:00:00Z'],
    ['id' => '17', 'roll_number' => '2024017', 'name' => 'Stephanie Clark', 'email' => 'stephanie.clark@student.edu', 'class' => '11-A', 'phone' => '123-456-7922', 'guardian_name' => 'Richard Clark', 'guardian_phone' => '123-456-7923', 'is_active' => true, 'created_at' => '2024-02-01T00:00:00Z'],
    ['id' => '18', 'roll_number' => '2024018', 'name' => 'Kevin Lewis', 'email' => 'kevin.lewis@student.edu', 'class' => '11-A', 'phone' => '123-456-7924', 'guardian_name' => 'Sandra Lewis', 'guardian_phone' => '123-456-7925', 'is_active' => true, 'created_at' => '2024-02-02T00:00:00Z'],
    ['id' => '19', 'roll_number' => '2024019', 'name' => 'Nicole Robinson', 'email' => 'nicole.robinson@student.edu', 'class' => '11-B', 'phone' => '123-456-7926', 'guardian_name' => 'Paul Robinson', 'guardian_phone' => '123-456-7927', 'is_active' => true, 'created_at' => '2024-02-03T00:00:00Z'],
    ['id' => '20', 'roll_number' => '2024020', 'name' => 'Ryan Walker', 'email' => 'ryan.walker@student.edu', 'class' => '11-B', 'phone' => '123-456-7928', 'guardian_name' => 'Donna Walker', 'guardian_phone' => '123-456-7929', 'is_active' => true, 'created_at' => '2024-02-04T00:00:00Z'],
    ['id' => '21', 'roll_number' => '2024021', 'name' => 'Rachel Hall', 'email' => 'rachel.hall@student.edu', 'class' => '12-A', 'phone' => '123-456-7930', 'guardian_name' => 'Steven Hall', 'guardian_phone' => '123-456-7931', 'is_active' => true, 'created_at' => '2024-02-05T00:00:00Z'],
    ['id' => '22', 'roll_number' => '2024022', 'name' => 'Brandon Allen', 'email' => 'brandon.allen@student.edu', 'class' => '12-A', 'phone' => '123-456-7932', 'guardian_name' => 'Karen Allen', 'guardian_phone' => '123-456-7933', 'is_active' => true, 'created_at' => '2024-02-06T00:00:00Z'],
    ['id' => '23', 'roll_number' => '2024023', 'name' => 'Kimberly Young', 'email' => 'kimberly.young@student.edu', 'class' => '12-B', 'phone' => '123-456-7934', 'guardian_name' => 'Edward Young', 'guardian_phone' => '123-456-7935', 'is_active' => true, 'created_at' => '2024-02-07T00:00:00Z'],
    ['id' => '24', 'roll_number' => '2024024', 'name' => 'Jason King', 'email' => 'jason.king@student.edu', 'class' => '12-B', 'phone' => '123-456-7936', 'guardian_name' => 'Nancy King', 'guardian_phone' => '123-456-7937', 'is_active' => true, 'created_at' => '2024-02-08T00:00:00Z'],
    ['id' => '25', 'roll_number' => '2024025', 'name' => 'Michelle Wright', 'email' => 'michelle.wright@student.edu', 'class' => '10-A', 'phone' => '123-456-7938', 'guardian_name' => 'Timothy Wright', 'guardian_phone' => '123-456-7939', 'is_active' => true, 'created_at' => '2024-02-09T00:00:00Z'],
    ['id' => '26', 'roll_number' => '2024026', 'name' => 'Justin Lopez', 'email' => 'justin.lopez@student.edu', 'class' => '10-A', 'phone' => '123-456-7940', 'guardian_name' => 'Betty Lopez', 'guardian_phone' => '123-456-7941', 'is_active' => true, 'created_at' => '2024-02-10T00:00:00Z'],
    ['id' => '27', 'roll_number' => '2024027', 'name' => 'Heather Hill', 'email' => 'heather.hill@student.edu', 'class' => '10-B', 'phone' => '123-456-7942', 'guardian_name' => 'Gary Hill', 'guardian_phone' => '123-456-7943', 'is_active' => true, 'created_at' => '2024-02-11T00:00:00Z'],
    ['id' => '28', 'roll_number' => '2024028', 'name' => 'Tyler Scott', 'email' => 'tyler.scott@student.edu', 'class' => '10-B', 'phone' => '123-456-7944', 'guardian_name' => 'Helen Scott', 'guardian_phone' => '123-456-7945', 'is_active' => true, 'created_at' => '2024-02-12T00:00:00Z'],
    ['id' => '29', 'roll_number' => '2024029', 'name' => 'Crystal Green', 'email' => 'crystal.green@student.edu', 'class' => '11-A', 'phone' => '123-456-7946', 'guardian_name' => 'Frank Green', 'guardian_phone' => '123-456-7947', 'is_active' => true, 'created_at' => '2024-02-13T00:00:00Z'],
    ['id' => '30', 'roll_number' => '2024030', 'name' => 'Nathan Adams', 'email' => 'nathan.adams@student.edu', 'class' => '11-A', 'phone' => '123-456-7948', 'guardian_name' => 'Ruth Adams', 'guardian_phone' => '123-456-7949', 'is_active' => true, 'created_at' => '2024-02-14T00:00:00Z']
];

$mockCourses = [
    ['id' => '1', 'course_name' => 'Mathematics', 'course_code' => 'MATH101', 'description' => 'Basic Mathematics and Algebra', 'credits' => 4, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z'],
    ['id' => '2', 'course_name' => 'Physics', 'course_code' => 'PHY101', 'description' => 'Introduction to Physics', 'credits' => 4, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z'],
    ['id' => '3', 'course_name' => 'Chemistry', 'course_code' => 'CHEM101', 'description' => 'Basic Chemistry Principles', 'credits' => 4, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z'],
    ['id' => '4', 'course_name' => 'English Literature', 'course_code' => 'ENG101', 'description' => 'Introduction to English Literature', 'credits' => 3, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z'],
    ['id' => '5', 'course_name' => 'Biology', 'course_code' => 'BIO101', 'description' => 'Fundamentals of Biology', 'credits' => 4, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z'],
    ['id' => '6', 'course_name' => 'History', 'course_code' => 'HIST101', 'description' => 'World History Overview', 'credits' => 3, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z'],
    ['id' => '7', 'course_name' => 'Computer Science', 'course_code' => 'CS101', 'description' => 'Introduction to Programming', 'credits' => 4, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z'],
    ['id' => '8', 'course_name' => 'Geography', 'course_code' => 'GEO101', 'description' => 'Physical and Human Geography', 'credits' => 3, 'semester' => 'Fall 2024', 'is_active' => true, 'created_at' => '2024-01-01T00:00:00Z']
];

$mockResults = [
    ['id' => '1', 'student_id' => '1', 'course_id' => '1', 'marks' => 95, 'grade' => 'A+', 'percentage' => 95, 'exam_date' => '2024-03-15', 'exam_type' => 'Final Exam', 'student_name' => 'John Smith', 'course_name' => 'Mathematics', 'course_code' => 'MATH101', 'roll_number' => '2024001', 'created_at' => '2024-03-16T00:00:00Z'],
    ['id' => '2', 'student_id' => '2', 'course_id' => '1', 'marks' => 88, 'grade' => 'A', 'percentage' => 88, 'exam_date' => '2024-03-15', 'exam_type' => 'Final Exam', 'student_name' => 'Emily Johnson', 'course_name' => 'Mathematics', 'course_code' => 'MATH101', 'roll_number' => '2024002', 'created_at' => '2024-03-16T00:00:00Z'],
    ['id' => '3', 'student_id' => '3', 'course_id' => '2', 'marks' => 78, 'grade' => 'B+', 'percentage' => 78, 'exam_date' => '2024-03-20', 'exam_type' => 'Final Exam', 'student_name' => 'Sarah Wilson', 'course_name' => 'Physics', 'course_code' => 'PHY101', 'roll_number' => '2024003', 'created_at' => '2024-03-21T00:00:00Z'],
    ['id' => '4', 'student_id' => '4', 'course_id' => '3', 'marks' => 92, 'grade' => 'A+', 'percentage' => 92, 'exam_date' => '2024-03-25', 'exam_type' => 'Final Exam', 'student_name' => 'Michael Brown', 'course_name' => 'Chemistry', 'course_code' => 'CHEM101', 'roll_number' => '2024004', 'created_at' => '2024-03-26T00:00:00Z'],
    ['id' => '5', 'student_id' => '5', 'course_id' => '4', 'marks' => 85, 'grade' => 'A', 'percentage' => 85, 'exam_date' => '2024-03-28', 'exam_type' => 'Final Exam', 'student_name' => 'Jessica Davis', 'course_name' => 'English Literature', 'course_code' => 'ENG101', 'roll_number' => '2024005', 'created_at' => '2024-03-29T00:00:00Z'],
    ['id' => '6', 'student_id' => '6', 'course_id' => '5', 'marks' => 79, 'grade' => 'B+', 'percentage' => 79, 'exam_date' => '2024-04-02', 'exam_type' => 'Final Exam', 'student_name' => 'David Miller', 'course_name' => 'Biology', 'course_code' => 'BIO101', 'roll_number' => '2024006', 'created_at' => '2024-04-03T00:00:00Z'],
    ['id' => '7', 'student_id' => '7', 'course_id' => '6', 'marks' => 82, 'grade' => 'A-', 'percentage' => 82, 'exam_date' => '2024-04-05', 'exam_type' => 'Final Exam', 'student_name' => 'Ashley Garcia', 'course_name' => 'History', 'course_code' => 'HIST101', 'roll_number' => '2024007', 'created_at' => '2024-04-06T00:00:00Z'],
    ['id' => '8', 'student_id' => '8', 'course_id' => '7', 'marks' => 96, 'grade' => 'A+', 'percentage' => 96, 'exam_date' => '2024-04-08', 'exam_type' => 'Final Exam', 'student_name' => 'Christopher Lee', 'course_name' => 'Computer Science', 'course_code' => 'CS101', 'roll_number' => '2024008', 'created_at' => '2024-04-09T00:00:00Z'],
    ['id' => '9', 'student_id' => '9', 'course_id' => '8', 'marks' => 74, 'grade' => 'B', 'percentage' => 74, 'exam_date' => '2024-04-10', 'exam_type' => 'Final Exam', 'student_name' => 'Amanda Rodriguez', 'course_name' => 'Geography', 'course_code' => 'GEO101', 'roll_number' => '2024009', 'created_at' => '2024-04-11T00:00:00Z'],
    ['id' => '10', 'student_id' => '10', 'course_id' => '1', 'marks' => 87, 'grade' => 'A', 'percentage' => 87, 'exam_date' => '2024-04-12', 'exam_type' => 'Final Exam', 'student_name' => 'Matthew Martinez', 'course_name' => 'Mathematics', 'course_code' => 'MATH101', 'roll_number' => '2024010', 'created_at' => '2024-04-13T00:00:00Z']
];

// Route handling
try {
    if (empty($segments) || $segments[0] === '') {
        sendResponse(true, 'Student Result Management API v1.0', [
            'endpoints' => ['students', 'courses', 'results', 'auth'],
            'version' => '1.0.0',
            'status' => 'active'
        ]);
    }
    
    switch($segments[0]) {
        case 'auth':
            if (isset($segments[1]) && $segments[1] === 'login' && $method === 'POST') {
                $rawInput = file_get_contents('php://input');
                error_log("Raw input: " . $rawInput);
                
                $input = json_decode($rawInput, true);
                error_log("Parsed input: " . print_r($input, true));
                
                if (!$input) {
                    sendResponse(false, 'Invalid JSON data', null, 400);
                    break;
                }
                
                if (!isset($input['email']) || !isset($input['password'])) {
                    sendResponse(false, 'Missing email or password', null, 400);
                    break;
                }
                
                error_log("Checking credentials: " . $input['email'] . " / " . $input['password']);
                
                if ($input['email'] === 'admin@school.edu' && $input['password'] === 'password') {
                    $token = JWT::generateToken('1', 'admin@school.edu', 'admin');
                    sendResponse(true, 'Login successful', [
                        'user' => [
                            'id' => '1',
                            'name' => 'System Administrator',
                            'email' => 'admin@school.edu',
                            'role' => 'admin'
                        ],
                        'token' => $token
                    ]);
                } elseif ($input['email'] === 'john.smith@student.edu' && $input['password'] === 'password') {
                    $token = JWT::generateToken('2', 'john.smith@student.edu', 'student');
                    sendResponse(true, 'Login successful', [
                        'user' => [
                            'id' => '2',
                            'name' => 'John Smith',
                            'email' => 'john.smith@student.edu',
                            'role' => 'student'
                        ],
                        'token' => $token
                    ]);
                } else {
                    sendResponse(false, 'Invalid credentials', null, 401);
                }
            } elseif (isset($segments[1]) && $segments[1] === 'register' && $method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                sendResponse(true, 'Registration successful. Please wait for admin approval.', [
                    'message' => 'Your account has been created and is pending approval.',
                    'status' => 'pending'
                ]);
            }
            break;
            
        case 'students':
            if ($method === 'GET') {
                sendResponse(true, 'Students retrieved successfully', $mockStudents);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $newStudent = array_merge($input, [
                    'id' => (string)(count($mockStudents) + 1),
                    'is_active' => true,
                    'created_at' => date('c')
                ]);
                sendResponse(true, 'Student created successfully', $newStudent);
            }
            break;
            
        case 'courses':
            if ($method === 'GET') {
                sendResponse(true, 'Courses retrieved successfully', $mockCourses);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $newCourse = array_merge($input, [
                    'id' => (string)(count($mockCourses) + 1),
                    'is_active' => true,
                    'created_at' => date('c')
                ]);
                sendResponse(true, 'Course created successfully', $newCourse);
            }
            break;
            
        case 'results':
            if (isset($segments[1]) && $segments[1] === 'dashboard' && $method === 'GET') {
                $dashboardData = [
                    'totalStudents' => count($mockStudents),
                    'totalCourses' => count($mockCourses),
                    'totalResults' => count($mockResults),
                    'averageGrade' => 'A-',
                    'passRate' => 95,
                    'gradeDistribution' => [
                        ['grade' => 'A+', 'count' => 8, 'percentage' => 27],
                        ['grade' => 'A', 'count' => 7, 'percentage' => 23],
                        ['grade' => 'B+', 'count' => 6, 'percentage' => 20],
                        ['grade' => 'B', 'count' => 5, 'percentage' => 17],
                        ['grade' => 'C+', 'count' => 3, 'percentage' => 10],
                        ['grade' => 'C', 'count' => 1, 'percentage' => 3]
                    ],
                    'topPerformers' => [
                        ['name' => 'Christopher Lee', 'roll_number' => '2024008', 'average_marks' => 96.0, 'grade' => 'A+'],
                        ['name' => 'John Smith', 'roll_number' => '2024001', 'average_marks' => 95.0, 'grade' => 'A+'],
                        ['name' => 'Michael Brown', 'roll_number' => '2024004', 'average_marks' => 92.0, 'grade' => 'A+'],
                        ['name' => 'Emily Johnson', 'roll_number' => '2024002', 'average_marks' => 88.0, 'grade' => 'A'],
                        ['name' => 'Matthew Martinez', 'roll_number' => '2024010', 'average_marks' => 87.0, 'grade' => 'A']
                    ],
                    'recentResults' => array_slice($mockResults, -5)
                ];
                sendResponse(true, 'Dashboard statistics retrieved successfully', $dashboardData);
            } elseif ($method === 'GET') {
                sendResponse(true, 'Results retrieved successfully', $mockResults);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $newResult = array_merge($input, [
                    'id' => (string)(count($mockResults) + 1),
                    'created_at' => date('c')
                ]);
                sendResponse(true, 'Result created successfully', $newResult);
            }
            break;
            
        default:
            sendResponse(false, 'Endpoint not found: ' . implode('/', $segments), null, 404);
    }
} catch (Exception $e) {
    sendResponse(false, 'Internal server error: ' . $e->getMessage(), null, 500);
} catch (Error $e) {
    sendResponse(false, 'PHP Error: ' . $e->getMessage(), null, 500);
}
?>