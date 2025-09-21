<?php
/**
 * Student Controller
 * Handles all student-related API endpoints
 */
class StudentController {
    private $db;
    private $student;
    private $auth;

    public function __construct($db) {
        $this->db = $db;
        $this->student = new Student($db);
        $this->auth = new AuthMiddleware();
    }

    /**
     * Get all students (Admin only)
     */
    public function index($action = null) {
        // Require admin authentication
        $user = $this->auth->requireAdmin();
        if (!$user) return;

        if ($action === 'dropdown') {
            $this->getForDropdown();
            return;
        }

        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $class = isset($_GET['class']) ? $_GET['class'] : null;
        $search = isset($_GET['search']) ? $_GET['search'] : null;

        try {
            $students = $this->student->getAll($limit, $offset, $class, $search);
            Response::success("Students retrieved successfully", $students);
        } catch (Exception $e) {
            error_log("Error fetching students: " . $e->getMessage());
            Response::error("Failed to fetch students", 500);
        }
    }

    /**
     * Get student by ID
     */
    public function show($action, $id) {
        $user = $this->auth->getCurrentUser();
        if (!$user) return;

        // Students can only view their own data, admins can view any
        if ($user['role'] === 'student' && $user['user_id'] !== $id) {
            Response::error("Access denied", 403);
            return;
        }

        try {
            if ($action === 'results') {
                $this->getStudentResults($id);
            } elseif ($action === 'statistics') {
                $this->getStudentStatistics($id);
            } else {
                $student = $this->student->getById($id);
                if (!$student) {
                    Response::error("Student not found", 404);
                    return;
                }
                Response::success("Student retrieved successfully", $student);
            }
        } catch (Exception $e) {
            error_log("Error fetching student: " . $e->getMessage());
            Response::error("Failed to fetch student", 500);
        }
    }

    /**
     * Create new student (Admin only)
     */
    public function create($action = null) {
        $user = $this->auth->requireAdmin();
        if (!$user) return;

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        $required = ['roll_number', 'name', 'email', 'password', 'class'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                Response::error("Field '$field' is required", 400);
                return;
            }
        }

        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error("Invalid email format", 400);
            return;
        }

        // Check if roll number already exists
        if ($this->student->rollNumberExists($data['roll_number'])) {
            Response::error("Roll number already exists", 400);
            return;
        }

        // Check if email already exists
        if ($this->student->emailExists($data['email'])) {
            Response::error("Email already exists", 400);
            return;
        }

        try {
            $studentId = $this->student->create($data);
            if ($studentId) {
                $newStudent = $this->student->getById($studentId);
                Response::success("Student created successfully", $newStudent);
            } else {
                Response::error("Failed to create student", 500);
            }
        } catch (Exception $e) {
            error_log("Error creating student: " . $e->getMessage());
            Response::error("Failed to create student", 500);
        }
    }

    /**
     * Update student (Admin only, or student updating own profile)
     */
    public function update($action, $id) {
        $user = $this->auth->getCurrentUser();
        if (!$user) return;

        // Students can only update their own data, admins can update any
        if ($user['role'] === 'student' && $user['user_id'] !== $id) {
            Response::error("Access denied", 403);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        $required = ['name', 'email', 'class'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                Response::error("Field '$field' is required", 400);
                return;
            }
        }

        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error("Invalid email format", 400);
            return;
        }

        // Check if email already exists (excluding current student)
        if ($this->student->emailExists($data['email'], $id)) {
            Response::error("Email already exists", 400);
            return;
        }

        try {
            $success = $this->student->update($id, $data);
            if ($success) {
                $updatedStudent = $this->student->getById($id);
                Response::success("Student updated successfully", $updatedStudent);
            } else {
                Response::error("Failed to update student", 500);
            }
        } catch (Exception $e) {
            error_log("Error updating student: " . $e->getMessage());
            Response::error("Failed to update student", 500);
        }
    }

    /**
     * Delete student (Admin only)
     */
    public function delete($action, $id) {
        $user = $this->auth->requireAdmin();
        if (!$user) return;

        try {
            $success = $this->student->delete($id);
            if ($success) {
                Response::success("Student deleted successfully");
            } else {
                Response::error("Failed to delete student", 500);
            }
        } catch (Exception $e) {
            error_log("Error deleting student: " . $e->getMessage());
            Response::error("Failed to delete student", 500);
        }
    }

    /**
     * Get student results
     */
    private function getStudentResults($student_id) {
        try {
            $results = $this->student->getResults($student_id);
            Response::success("Student results retrieved successfully", $results);
        } catch (Exception $e) {
            error_log("Error fetching student results: " . $e->getMessage());
            Response::error("Failed to fetch student results", 500);
        }
    }

    /**
     * Get student statistics
     */
    private function getStudentStatistics($student_id) {
        try {
            $stats = $this->student->getStatistics($student_id);
            Response::success("Student statistics retrieved successfully", $stats);
        } catch (Exception $e) {
            error_log("Error fetching student statistics: " . $e->getMessage());
            Response::error("Failed to fetch student statistics", 500);
        }
    }

    /**
     * Get students for dropdown
     */
    private function getForDropdown() {
        try {
            $query = "SELECT id, name, roll_number FROM students WHERE is_active = true ORDER BY roll_number";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $students = $stmt->fetchAll();
            
            Response::success("Students for dropdown retrieved successfully", $students);
        } catch (Exception $e) {
            error_log("Error fetching students for dropdown: " . $e->getMessage());
            Response::error("Failed to fetch students", 500);
        }
    }
}
?>