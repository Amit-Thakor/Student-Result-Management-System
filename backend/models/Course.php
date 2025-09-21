<?php
/**
 * Course Model
 * Handles all course-related database operations
 */
class Course {
    private $conn;
    private $table_name = "courses";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new course
     * @param array $data Course data
     * @return string|false Course ID if successful, false otherwise
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                 (course_name, course_code, description, credits, semester) 
                 VALUES (:course_name, :course_code, :description, :credits, :semester)
                 RETURNING id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":course_name", $data['course_name']);
        $stmt->bindParam(":course_code", $data['course_code']);
        $stmt->bindParam(":description", $data['description'] ?? null);
        $stmt->bindParam(":credits", $data['credits']);
        $stmt->bindParam(":semester", $data['semester']);

        if ($stmt->execute()) {
            $result = $stmt->fetch();
            return $result['id'];
        }
        return false;
    }

    /**
     * Get all courses with pagination and filtering
     * @param int $limit Number of records to return
     * @param int $offset Starting point
     * @param string $search Search term
     * @return array Courses data
     */
    public function getAll($limit = 50, $offset = 0, $search = null) {
        $query = "SELECT id, course_name, course_code, description, credits, semester, is_active, created_at 
                 FROM " . $this->table_name . " WHERE is_active = true";

        $params = [];

        if ($search) {
            $query .= " AND (course_name ILIKE :search OR course_code ILIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }

        $query .= " ORDER BY course_code LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($query);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Get course by ID
     * @param string $id Course ID
     * @return array|false Course data if found, false otherwise
     */
    public function getById($id) {
        $query = "SELECT id, course_name, course_code, description, credits, semester, is_active, created_at 
                 FROM " . $this->table_name . " WHERE id = :id AND is_active = true";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Update course information
     * @param string $id Course ID
     * @param array $data Updated data
     * @return bool Success status
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . " 
                 SET course_name = :course_name, course_code = :course_code, description = :description,
                     credits = :credits, semester = :semester, updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":course_name", $data['course_name']);
        $stmt->bindParam(":course_code", $data['course_code']);
        $stmt->bindParam(":description", $data['description'] ?? null);
        $stmt->bindParam(":credits", $data['credits']);
        $stmt->bindParam(":semester", $data['semester']);

        return $stmt->execute();
    }

    /**
     * Soft delete course (set is_active to false)
     * @param string $id Course ID
     * @return bool Success status
     */
    public function delete($id) {
        $query = "UPDATE " . $this->table_name . " SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    /**
     * Get course statistics
     * @param string $course_id Course ID
     * @return array Statistics data
     */
    public function getStatistics($course_id) {
        $query = "SELECT 
                    COUNT(r.id) as total_students,
                    ROUND(AVG(r.marks), 2) as average_marks,
                    MAX(r.marks) as highest_marks,
                    MIN(r.marks) as lowest_marks,
                    COUNT(CASE WHEN r.marks >= 40 THEN 1 END) as passed_students,
                    COUNT(CASE WHEN r.marks < 40 THEN 1 END) as failed_students
                 FROM results r
                 WHERE r.course_id = :course_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":course_id", $course_id);
        $stmt->execute();

        $result = $stmt->fetch();
        return $result ?: [
            'total_students' => 0,
            'average_marks' => 0,
            'highest_marks' => 0,
            'lowest_marks' => 0,
            'passed_students' => 0,
            'failed_students' => 0
        ];
    }

    /**
     * Check if course code exists
     * @param string $course_code Course code to check
     * @param string $exclude_id ID to exclude from check (for updates)
     * @return bool True if exists, false otherwise
     */
    public function courseCodeExists($course_code, $exclude_id = null) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE course_code = :course_code";
        $params = [':course_code' => $course_code];

        if ($exclude_id) {
            $query .= " AND id != :exclude_id";
            $params[':exclude_id'] = $exclude_id;
        }

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();

        return $stmt->fetch() !== false;
    }

    /**
     * Get courses for dropdown/select options
     * @return array Simple course data for dropdowns
     */
    public function getForDropdown() {
        $query = "SELECT id, course_name, course_code FROM " . $this->table_name . " 
                 WHERE is_active = true ORDER BY course_code";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll();
    }
}
?>