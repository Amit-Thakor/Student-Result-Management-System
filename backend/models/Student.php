<?php
/**
 * Student Model
 * Handles all student-related database operations
 */
class Student {
    private $conn;
    private $table_name = "students";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Create a new student
     * @param array $data Student data
     * @return string|false Student ID if successful, false otherwise
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table_name . " 
                 (roll_number, name, email, password, class, date_of_birth, phone, address, guardian_name, guardian_phone) 
                 VALUES (:roll_number, :name, :email, :password, :class, :date_of_birth, :phone, :address, :guardian_name, :guardian_phone)
                 RETURNING id";

        $stmt = $this->conn->prepare($query);

        // Hash password
        $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);

        // Bind parameters
        $stmt->bindParam(":roll_number", $data['roll_number']);
        $stmt->bindParam(":name", $data['name']);
        $stmt->bindParam(":email", $data['email']);
        $stmt->bindParam(":password", $hashed_password);
        $stmt->bindParam(":class", $data['class']);
        $stmt->bindParam(":date_of_birth", $data['date_of_birth'] ?? null);
        $stmt->bindParam(":phone", $data['phone'] ?? null);
        $stmt->bindParam(":address", $data['address'] ?? null);
        $stmt->bindParam(":guardian_name", $data['guardian_name'] ?? null);
        $stmt->bindParam(":guardian_phone", $data['guardian_phone'] ?? null);

        if ($stmt->execute()) {
            $result = $stmt->fetch();
            return $result['id'];
        }
        return false;
    }

    /**
     * Get all students with pagination and filtering
     * @param int $limit Number of records to return
     * @param int $offset Starting point
     * @param string $class Filter by class
     * @param string $search Search term
     * @return array Students data
     */
    public function getAll($limit = 50, $offset = 0, $class = null, $search = null) {
        $query = "SELECT id, roll_number, name, email, class, date_of_birth, phone, address,
                        guardian_name, guardian_phone, enrollment_date, is_active, created_at 
                 FROM " . $this->table_name . " WHERE is_active = true";

        $params = [];

        if ($class) {
            $query .= " AND class = :class";
            $params[':class'] = $class;
        }

        if ($search) {
            $query .= " AND (name ILIKE :search OR roll_number ILIKE :search OR email ILIKE :search)";
            $params[':search'] = '%' . $search . '%';
        }

        $query .= " ORDER BY roll_number LIMIT :limit OFFSET :offset";

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
     * Get student by ID
     * @param string $id Student ID
     * @return array|false Student data if found, false otherwise
     */
    public function getById($id) {
        $query = "SELECT id, roll_number, name, email, class, date_of_birth, phone, address,
                        guardian_name, guardian_phone, enrollment_date, is_active, created_at 
                 FROM " . $this->table_name . " WHERE id = :id AND is_active = true";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        return $stmt->fetch();
    }

    /**
     * Get student by email
     * @param string $email Student email
     * @return array|false Student data if found, false otherwise
     */
    public function getByEmail($email) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email = :email AND is_active = true";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        return $stmt->fetch();
    }

    /**
     * Update student information
     * @param string $id Student ID
     * @param array $data Updated data
     * @return bool Success status
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table_name . " 
                 SET name = :name, email = :email, class = :class, phone = :phone, address = :address,
                     guardian_name = :guardian_name, guardian_phone = :guardian_phone,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":name", $data['name']);
        $stmt->bindParam(":email", $data['email']);
        $stmt->bindParam(":class", $data['class']);
        $stmt->bindParam(":phone", $data['phone'] ?? null);
        $stmt->bindParam(":address", $data['address'] ?? null);
        $stmt->bindParam(":guardian_name", $data['guardian_name'] ?? null);
        $stmt->bindParam(":guardian_phone", $data['guardian_phone'] ?? null);

        return $stmt->execute();
    }

    /**
     * Soft delete student (set is_active to false)
     * @param string $id Student ID
     * @return bool Success status
     */
    public function delete($id) {
        $query = "UPDATE " . $this->table_name . " SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    /**
     * Get student results
     * @param string $student_id Student ID
     * @return array Results data
     */
    public function getResults($student_id) {
        $query = "SELECT r.*, c.course_name, c.course_code, c.credits
                 FROM results r
                 JOIN courses c ON r.course_id = c.id
                 WHERE r.student_id = :student_id
                 ORDER BY r.exam_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":student_id", $student_id);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Get student statistics
     * @param string $student_id Student ID
     * @return array Statistics data
     */
    public function getStatistics($student_id) {
        $query = "SELECT 
                    COUNT(r.id) as total_subjects,
                    ROUND(AVG(r.marks), 2) as average_marks,
                    CASE 
                        WHEN AVG(r.marks) >= 90 THEN 'A+'
                        WHEN AVG(r.marks) >= 80 THEN 'A'
                        WHEN AVG(r.marks) >= 70 THEN 'B+'
                        WHEN AVG(r.marks) >= 60 THEN 'B'
                        WHEN AVG(r.marks) >= 50 THEN 'C+'
                        WHEN AVG(r.marks) >= 40 THEN 'C'
                        WHEN AVG(r.marks) >= 33 THEN 'D'
                        ELSE 'F'
                    END as overall_grade,
                    ROUND(AVG(r.marks) * 4.0 / 100, 2) as gpa
                 FROM results r
                 WHERE r.student_id = :student_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":student_id", $student_id);
        $stmt->execute();

        $result = $stmt->fetch();
        return $result ?: [
            'total_subjects' => 0,
            'average_marks' => 0,
            'overall_grade' => 'N/A',
            'gpa' => 0.00
        ];
    }

    /**
     * Check if roll number exists
     * @param string $roll_number Roll number to check
     * @param string $exclude_id ID to exclude from check (for updates)
     * @return bool True if exists, false otherwise
     */
    public function rollNumberExists($roll_number, $exclude_id = null) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE roll_number = :roll_number";
        $params = [':roll_number' => $roll_number];

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
     * Check if email exists
     * @param string $email Email to check
     * @param string $exclude_id ID to exclude from check (for updates)
     * @return bool True if exists, false otherwise
     */
    public function emailExists($email, $exclude_id = null) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email";
        $params = [':email' => $email];

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