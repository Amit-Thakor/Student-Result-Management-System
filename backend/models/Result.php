<?php
/**
 * Result Model
 * Handles all result-related database operations
 */
class Result {
    private $conn;
    private $table_name = "results";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new result
     * @param array $data Result data
     * @return string|false Result ID if successful, false otherwise
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                 (student_id, course_id, marks, exam_date, exam_type, remarks) 
                 VALUES (:student_id, :course_id, :marks, :exam_date, :exam_type, :remarks)
                 RETURNING id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":student_id", $data['student_id']);
        $stmt->bindParam(":course_id", $data['course_id']);
        $stmt->bindParam(":marks", $data['marks']);
        $stmt->bindParam(":exam_date", $data['exam_date']);
        $stmt->bindParam(":exam_type", $data['exam_type']);
        $stmt->bindParam(":remarks", $data['remarks'] ?? null);

        if ($stmt->execute()) {
            $result = $stmt->fetch();
            return $result['id'];
        }
        return false;
    }

    /**
     * Get all results with student and course information
     * @param int $limit Number of records to return
     * @param int $offset Starting point
     * @param string $student_id Filter by student ID
     * @param string $course_id Filter by course ID
     * @return array Results data
     */
    public function getAll($limit = 50, $offset = 0, $student_id = null, $course_id = null) {
        $query = "SELECT r.id, r.student_id, r.course_id, r.marks, r.grade, r.percentage, 
                        r.exam_date, r.exam_type, r.remarks, r.created_at,
                        s.name as student_name, s.roll_number,
                        c.course_name, c.course_code
                 FROM " . $this->table_name . " r
                 JOIN students s ON r.student_id = s.id
                 JOIN courses c ON r.course_id = c.id
                 WHERE 1=1";

        $params = [];

        if ($student_id) {
            $query .= " AND r.student_id = :student_id";
            $params[':student_id'] = $student_id;
        }

        if ($course_id) {
            $query .= " AND r.course_id = :course_id";
            $params[':course_id'] = $course_id;
        }

        $query .= " ORDER BY r.exam_date DESC, r.created_at DESC LIMIT :limit OFFSET :offset";

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
     * Get result by ID
     * @param string $id Result ID
     * @return array|false Result data if found, false otherwise
     */
    public function getById($id) {
        $query = "SELECT r.*, s.name as student_name, s.roll_number,
                        c.course_name, c.course_code
                 FROM " . $this->table_name . " r
                 JOIN students s ON r.student_id = s.id
                 JOIN courses c ON r.course_id = c.id
                 WHERE r.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Update result information
     * @param string $id Result ID
     * @param array $data Updated data
     * @return bool Success status
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . " 
                 SET student_id = :student_id, course_id = :course_id, marks = :marks,
                     exam_date = :exam_date, exam_type = :exam_type, remarks = :remarks,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":student_id", $data['student_id']);
        $stmt->bindParam(":course_id", $data['course_id']);
        $stmt->bindParam(":marks", $data['marks']);
        $stmt->bindParam(":exam_date", $data['exam_date']);
        $stmt->bindParam(":exam_type", $data['exam_type']);
        $stmt->bindParam(":remarks", $data['remarks'] ?? null);

        return $stmt->execute();
    }

    /**
     * Delete result
     * @param string $id Result ID
     * @return bool Success status
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    /**
     * Get results for a specific student
     * @param string $student_id Student ID
     * @return array Results data
     */
    public function getByStudentId($student_id) {
        $query = "SELECT r.*, c.course_name, c.course_code, c.credits
                 FROM " . $this->table_name . " r
                 JOIN courses c ON r.course_id = c.id
                 WHERE r.student_id = :student_id
                 ORDER BY r.exam_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":student_id", $student_id);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Get dashboard statistics
     * @return array Dashboard statistics
     */
    public function getDashboardStats() {
        // Total results
        $query1 = "SELECT COUNT(*) as total_results FROM " . $this->table_name;
        $stmt1 = $this->conn->prepare($query1);
        $stmt1->execute();
        $totalResults = $stmt1->fetch()['total_results'];

        // Average marks
        $query2 = "SELECT ROUND(AVG(marks), 2) as average_marks FROM " . $this->table_name;
        $stmt2 = $this->conn->prepare($query2);
        $stmt2->execute();
        $averageMarks = $stmt2->fetch()['average_marks'] ?? 0;

        // Pass rate (assuming 40 is passing grade)
        $query3 = "SELECT 
                    COUNT(CASE WHEN marks >= 40 THEN 1 END) as passed,
                    COUNT(*) as total
                   FROM " . $this->table_name;
        $stmt3 = $this->conn->prepare($query3);
        $stmt3->execute();
        $passData = $stmt3->fetch();
        $passRate = $passData['total'] > 0 ? round(($passData['passed'] / $passData['total']) * 100, 2) : 0;

        // Grade distribution
        $query4 = "SELECT grade, COUNT(*) as count
                   FROM " . $this->table_name . "
                   GROUP BY grade
                   ORDER BY grade";
        $stmt4 = $this->conn->prepare($query4);
        $stmt4->execute();
        $gradeDistribution = $stmt4->fetchAll();

        // Top performers
        $query5 = "SELECT s.name, s.roll_number, ROUND(AVG(r.marks), 2) as average_marks, 
                         CASE 
                             WHEN AVG(r.marks) >= 90 THEN 'A+'
                             WHEN AVG(r.marks) >= 80 THEN 'A'
                             WHEN AVG(r.marks) >= 70 THEN 'B+'
                             WHEN AVG(r.marks) >= 60 THEN 'B'
                             WHEN AVG(r.marks) >= 50 THEN 'C+'
                             WHEN AVG(r.marks) >= 40 THEN 'C'
                             WHEN AVG(r.marks) >= 33 THEN 'D'
                             ELSE 'F'
                         END as grade
                   FROM " . $this->table_name . " r
                   JOIN students s ON r.student_id = s.id
                   GROUP BY s.id, s.name, s.roll_number
                   ORDER BY average_marks DESC
                   LIMIT 10";
        $stmt5 = $this->conn->prepare($query5);
        $stmt5->execute();
        $topPerformers = $stmt5->fetchAll();

        return [
            'total_results' => $totalResults,
            'average_marks' => $averageMarks,
            'pass_rate' => $passRate,
            'grade_distribution' => $gradeDistribution,
            'top_performers' => $topPerformers
        ];
    }

    /**
     * Check if result exists for student and course
     * @param string $student_id Student ID
     * @param string $course_id Course ID
     * @param string $exam_type Exam type
     * @param string $exam_date Exam date
     * @param string $exclude_id ID to exclude from check (for updates)
     * @return bool True if exists, false otherwise
     */
    public function resultExists($student_id, $course_id, $exam_type, $exam_date, $exclude_id = null) {
        $query = "SELECT id FROM " . $this->table_name . " 
                 WHERE student_id = :student_id AND course_id = :course_id 
                 AND exam_type = :exam_type AND exam_date = :exam_date";
        
        $params = [
            ':student_id' => $student_id,
            ':course_id' => $course_id,
            ':exam_type' => $exam_type,
            ':exam_date' => $exam_date
        ];

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
}
?>