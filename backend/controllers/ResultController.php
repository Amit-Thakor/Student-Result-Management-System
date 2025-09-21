<?php
/**
 * Result Controller
 * Handles all result-related API endpoints
 */
class ResultController {
    private $db;
    private $result;
    private $auth;

    public function __construct($db) {
        $this->db = $db;
        // Use mock result model for testing
        if (class_exists('MockResult')) {
            require_once 'models/MockResult.php';
            $this->result = new MockResult($db);
        } else {
            $this->result = new Result($db);
        }
        $this->auth = new AuthMiddleware();
    }

    /**
     * Get all results
     */
    public function index($action = null) {
        // Allow dashboard access without authentication for testing
        if ($action === 'dashboard') {
            $this->getDashboardStats();
            return;
        }

        $user = $this->auth->getCurrentUser();
        if (!$user) return;

        if ($action === 'student') {
            $this->getStudentResults($user['user_id']);
            return;
        }

        // Only admins can view all results
        if ($user['role'] !== 'admin') {
            Response::error("Access denied", 403);
            return;
        }

        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $student_id = isset($_GET['student_id']) ? $_GET['student_id'] : null;
        $course_id = isset($_GET['course_id']) ? $_GET['course_id'] : null;

        try {
            $results = $this->result->getAll($limit, $offset, $student_id, $course_id);
            Response::success("Results retrieved successfully", $results);
        } catch (Exception $e) {
            error_log("Error fetching results: " . $e->getMessage());
            Response::error("Failed to fetch results", 500);
        }
    }

    /**
     * Get result by ID
     */
    public function show($action, $id) {
        $user = $this->auth->getCurrentUser();
        if (!$user) return;

        try {
            $result = $this->result->getById($id);
            if (!$result) {
                Response::error("Result not found", 404);
                return;
            }

            // Students can only view their own results
            if ($user['role'] === 'student' && $result['student_id'] !== $user['user_id']) {
                Response::error("Access denied", 403);
                return;
            }

            Response::success("Result retrieved successfully", $result);
        } catch (Exception $e) {
            error_log("Error fetching result: " . $e->getMessage());
            Response::error("Failed to fetch result", 500);
        }
    }

    /**
     * Create new result (Admin only)
     */
    public function create($action = null) {
        $user = $this->auth->requireAdmin();
        if (!$user) return;

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        $required = ['student_id', 'course_id', 'marks', 'exam_date', 'exam_type'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || ($field !== 'marks' && empty(trim($data[$field])))) {
                Response::error("Field '$field' is required", 400);
                return;
            }
        }

        // Validate marks
        if (!is_numeric($data['marks']) || $data['marks'] < 0 || $data['marks'] > 100) {
            Response::error("Marks must be between 0 and 100", 400);
            return;
        }

        // Validate date format
        if (!$this->isValidDate($data['exam_date'])) {
            Response::error("Invalid exam date format. Use YYYY-MM-DD", 400);
            return;
        }

        // Check if student exists
        $studentModel = new Student($this->db);
        if (!$studentModel->getById($data['student_id'])) {
            Response::error("Student not found", 404);
            return;
        }

        // Check if course exists
        $courseModel = new Course($this->db);
        if (!$courseModel->getById($data['course_id'])) {
            Response::error("Course not found", 404);
            return;
        }

        // Check if result already exists for this combination
        if ($this->result->resultExists($data['student_id'], $data['course_id'], $data['exam_type'], $data['exam_date'])) {
            Response::error("Result already exists for this student, course, exam type, and date", 400);
            return;
        }

        try {
            $resultId = $this->result->create($data);
            if ($resultId) {
                $newResult = $this->result->getById($resultId);
                Response::success("Result created successfully", $newResult);
            } else {
                Response::error("Failed to create result", 500);
            }
        } catch (Exception $e) {
            error_log("Error creating result: " . $e->getMessage());
            Response::error("Failed to create result", 500);
        }
    }

    /**
     * Update result (Admin only)
     */
    public function update($action, $id) {
        $user = $this->auth->requireAdmin();
        if (!$user) return;

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        $required = ['student_id', 'course_id', 'marks', 'exam_date', 'exam_type'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || ($field !== 'marks' && empty(trim($data[$field])))) {
                Response::error("Field '$field' is required", 400);
                return;
            }
        }

        // Validate marks
        if (!is_numeric($data['marks']) || $data['marks'] < 0 || $data['marks'] > 100) {
            Response::error("Marks must be between 0 and 100", 400);
            return;
        }

        // Validate date format
        if (!$this->isValidDate($data['exam_date'])) {
            Response::error("Invalid exam date format. Use YYYY-MM-DD", 400);
            return;
        }

        // Check if student exists
        $studentModel = new Student($this->db);
        if (!$studentModel->getById($data['student_id'])) {
            Response::error("Student not found", 404);
            return;
        }

        // Check if course exists
        $courseModel = new Course($this->db);
        if (!$courseModel->getById($data['course_id'])) {
            Response::error("Course not found", 404);
            return;
        }

        // Check if result already exists for this combination (excluding current result)
        if ($this->result->resultExists($data['student_id'], $data['course_id'], $data['exam_type'], $data['exam_date'], $id)) {
            Response::error("Result already exists for this student, course, exam type, and date", 400);
            return;
        }

        try {
            $success = $this->result->update($id, $data);
            if ($success) {
                $updatedResult = $this->result->getById($id);
                Response::success("Result updated successfully", $updatedResult);
            } else {
                Response::error("Failed to update result", 500);
            }
        } catch (Exception $e) {
            error_log("Error updating result: " . $e->getMessage());
            Response::error("Failed to update result", 500);
        }
    }

    /**
     * Delete result (Admin only)
     */
    public function delete($action, $id) {
        $user = $this->auth->requireAdmin();
        if (!$user) return;

        try {
            $success = $this->result->delete($id);
            if ($success) {
                Response::success("Result deleted successfully");
            } else {
                Response::error("Failed to delete result", 500);
            }
        } catch (Exception $e) {
            error_log("Error deleting result: " . $e->getMessage());
            Response::error("Failed to delete result", 500);
        }
    }

    /**
     * Get results for current student
     */
    private function getStudentResults($student_id) {
        try {
            $results = $this->result->getByStudentId($student_id);
            Response::success("Student results retrieved successfully", $results);
        } catch (Exception $e) {
            error_log("Error fetching student results: " . $e->getMessage());
            Response::error("Failed to fetch student results", 500);
        }
    }

    /**
     * Get dashboard statistics
     */
    private function getDashboardStats() {
        try {
            // Get basic stats from Result model
            $resultStats = $this->result->getDashboardStats();

            $stats = [
                'totalStudents' => 4, // Mock data
                'totalCourses' => 3,  // Mock data
                'totalResults' => $resultStats['total_results'],
                'averageGrade' => 'A-',
                'passRate' => $resultStats['pass_rate'],
                'gradeDistribution' => $resultStats['grade_distribution'],
                'topPerformers' => $resultStats['top_performers'],
                'recentResults' => $resultStats['recent_results'] ?? []
            ];

            Response::success("Dashboard statistics retrieved successfully", $stats);
        } catch (Exception $e) {
            error_log("Error fetching dashboard stats: " . $e->getMessage());
            Response::error("Failed to fetch dashboard statistics", 500);
        }
    }

    /**
     * Validate date format
     */
    private function isValidDate($date, $format = 'Y-m-d') {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) === $date;
    }
}
?>