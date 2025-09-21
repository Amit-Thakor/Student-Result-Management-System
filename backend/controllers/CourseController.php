<?php
/**
 * Course Controller
 * Handles all course-related API endpoints
 */
class CourseController {
    private $db;
    private $course;
    private $auth;

    public function __construct($db) {
        $this->db = $db;
        $this->course = new Course($db);
        $this->auth = new AuthMiddleware();
    }

    /**
     * Get all courses
     */
    public function index($action = null) {
        $user = $this->auth->getCurrentUser();
        if (!$user) return;

        if ($action === 'dropdown') {
            $this->getForDropdown();
            return;
        }

        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $search = isset($_GET['search']) ? $_GET['search'] : null;

        try {
            $courses = $this->course->getAll($limit, $offset, $search);
            Response::success("Courses retrieved successfully", $courses);
        } catch (Exception $e) {
            error_log("Error fetching courses: " . $e->getMessage());
            Response::error("Failed to fetch courses", 500);
        }
    }

    /**
     * Get course by ID
     */
    public function show($action, $id) {
        $user = $this->auth->getCurrentUser();
        if (!$user) return;

        try {
            if ($action === 'statistics') {
                $this->getCourseStatistics($id);
            } else {
                $course = $this->course->getById($id);
                if (!$course) {
                    Response::error("Course not found", 404);
                    return;
                }
                Response::success("Course retrieved successfully", $course);
            }
        } catch (Exception $e) {
            error_log("Error fetching course: " . $e->getMessage());
            Response::error("Failed to fetch course", 500);
        }
    }

    /**
     * Create new course (Admin only)
     */
    public function create($action = null) {
        $user = $this->auth->requireAdmin();
        if (!$user) return;

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        $required = ['course_name', 'course_code', 'credits', 'semester'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                Response::error("Field '$field' is required", 400);
                return;
            }
        }

        // Validate course code format (letters followed by numbers)
        if (!preg_match('/^[A-Z]{2,4}\d{3}$/', strtoupper($data['course_code']))) {
            Response::error("Course code must be in format like MATH101, CS201", 400);
            return;
        }

        // Validate credits
        if (!is_numeric($data['credits']) || $data['credits'] < 1 || $data['credits'] > 10) {
            Response::error("Credits must be between 1 and 10", 400);
            return;
        }

        // Check if course code already exists
        if ($this->course->courseCodeExists(strtoupper($data['course_code']))) {
            Response::error("Course code already exists", 400);
            return;
        }

        // Convert course code to uppercase
        $data['course_code'] = strtoupper($data['course_code']);

        try {
            $courseId = $this->course->create($data);
            if ($courseId) {
                $newCourse = $this->course->getById($courseId);
                Response::success("Course created successfully", $newCourse);
            } else {
                Response::error("Failed to create course", 500);
            }
        } catch (Exception $e) {
            error_log("Error creating course: " . $e->getMessage());
            Response::error("Failed to create course", 500);
        }
    }

    /**
     * Update course (Admin only)
     */
    public function update($action, $id) {
        $user = $this->auth->requireAdmin();
        if (!$user) return;

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate required fields
        $required = ['course_name', 'course_code', 'credits', 'semester'];
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                Response::error("Field '$field' is required", 400);
                return;
            }
        }

        // Validate course code format
        if (!preg_match('/^[A-Z]{2,4}\d{3}$/', strtoupper($data['course_code']))) {
            Response::error("Course code must be in format like MATH101, CS201", 400);
            return;
        }

        // Validate credits
        if (!is_numeric($data['credits']) || $data['credits'] < 1 || $data['credits'] > 10) {
            Response::error("Credits must be between 1 and 10", 400);
            return;
        }

        // Check if course code already exists (excluding current course)
        if ($this->course->courseCodeExists(strtoupper($data['course_code']), $id)) {
            Response::error("Course code already exists", 400);
            return;
        }

        // Convert course code to uppercase
        $data['course_code'] = strtoupper($data['course_code']);

        try {
            $success = $this->course->update($id, $data);
            if ($success) {
                $updatedCourse = $this->course->getById($id);
                Response::success("Course updated successfully", $updatedCourse);
            } else {
                Response::error("Failed to update course", 500);
            }
        } catch (Exception $e) {
            error_log("Error updating course: " . $e->getMessage());
            Response::error("Failed to update course", 500);
        }
    }

    /**
     * Delete course (Admin only)
     */
    public function delete($action, $id) {
        $user = $this->auth->requireAdmin();
        if (!$user) return;

        try {
            // Check if course has results
            $query = "SELECT COUNT(*) as count FROM results WHERE course_id = :course_id";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":course_id", $id);
            $stmt->execute();
            $result = $stmt->fetch();

            if ($result['count'] > 0) {
                Response::error("Cannot delete course with existing results", 400);
                return;
            }

            $success = $this->course->delete($id);
            if ($success) {
                Response::success("Course deleted successfully");
            } else {
                Response::error("Failed to delete course", 500);
            }
        } catch (Exception $e) {
            error_log("Error deleting course: " . $e->getMessage());
            Response::error("Failed to delete course", 500);
        }
    }

    /**
     * Get course statistics
     */
    private function getCourseStatistics($course_id) {
        try {
            $stats = $this->course->getStatistics($course_id);
            Response::success("Course statistics retrieved successfully", $stats);
        } catch (Exception $e) {
            error_log("Error fetching course statistics: " . $e->getMessage());
            Response::error("Failed to fetch course statistics", 500);
        }
    }

    /**
     * Get courses for dropdown
     */
    private function getForDropdown() {
        try {
            $courses = $this->course->getForDropdown();
            Response::success("Courses for dropdown retrieved successfully", $courses);
        } catch (Exception $e) {
            error_log("Error fetching courses for dropdown: " . $e->getMessage());
            Response::error("Failed to fetch courses", 500);
        }
    }
}
?>