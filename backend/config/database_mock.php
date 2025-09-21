<?php
/**
 * Mock Database Class for Testing
 * This allows the system to work without PostgreSQL for initial testing
 */
class Database {
    public $conn;

    public function getConnection() {
        // Return a mock PDO-like object for testing
        $this->conn = new MockPDO();
        return $this->conn;
    }
}

/**
 * Mock PDO class for testing without database
 */
class MockPDO {
    public function prepare($query) {
        return new MockPDOStatement($query);
    }

    public function setAttribute($attribute, $value) {
        return true;
    }
}

/**
 * Mock PDO Statement for testing
 */
class MockPDOStatement {
    private $query;
    private $params = [];

    public function __construct($query) {
        $this->query = $query;
    }

    public function bindParam($param, &$value, $type = null) {
        $this->params[$param] = $value;
        return true;
    }

    public function bindValue($param, $value, $type = null) {
        $this->params[$param] = $value;
        return true;
    }

    public function execute() {
        // Mock successful execution
        return true;
    }

    public function fetch($mode = null) {
        // Return mock data based on query type and parameters
        if (strpos($this->query, 'admin') !== false && strpos($this->query, 'email') !== false) {
            // Check if email matches admin credentials
            if (isset($this->params[':email']) && $this->params[':email'] === 'admin@school.edu') {
                return [
                    'id' => '1',
                    'username' => 'System Administrator',
                    'name' => 'System Administrator',
                    'email' => 'admin@school.edu',
                    'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
                    'role' => 'admin'
                ];
            }
        }

        if (strpos($this->query, 'students') !== false && strpos($this->query, 'email') !== false) {
            // Check if email matches student credentials
            if (isset($this->params[':email']) && $this->params[':email'] === 'john.smith@student.edu') {
                return [
                    'id' => '2',
                    'name' => 'John Smith',
                    'email' => 'john.smith@student.edu',
                    'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
                    'role' => 'student'
                ];
            }
        }

        // Handle dashboard stats queries
        if (strpos($this->query, 'COUNT') !== false) {
            if (strpos($this->query, 'students') !== false) {
                return ['total_students' => 4];
            }
            if (strpos($this->query, 'courses') !== false) {
                return ['total_courses' => 3];
            }
        }

        // Return false for no results
        return false;
    }

    public function fetchAll($mode = null) {
        // Return mock data arrays
        if (strpos($this->query, 'students') !== false) {
            return [
                [
                    'id' => '1',
                    'roll_number' => '2024001',
                    'name' => 'John Smith',
                    'email' => 'john.smith@student.edu',
                    'class' => '10-A',
                    'phone' => '123-456-7890',
                    'guardian_name' => 'Robert Smith',
                    'guardian_phone' => '123-456-7891',
                    'is_active' => true,
                    'created_at' => '2024-01-15T00:00:00Z'
                ],
                [
                    'id' => '2',
                    'roll_number' => '2024002',
                    'name' => 'Emily Johnson',
                    'email' => 'emily.johnson@student.edu',
                    'class' => '10-A',
                    'phone' => '123-456-7892',
                    'guardian_name' => 'Michael Johnson',
                    'guardian_phone' => '123-456-7893',
                    'is_active' => true,
                    'created_at' => '2024-01-16T00:00:00Z'
                ],
                [
                    'id' => '3',
                    'roll_number' => '2024003',
                    'name' => 'Sarah Wilson',
                    'email' => 'sarah.wilson@student.edu',
                    'class' => '10-B',
                    'phone' => '123-456-7894',
                    'guardian_name' => 'David Wilson',
                    'guardian_phone' => '123-456-7895',
                    'is_active' => true,
                    'created_at' => '2024-01-17T00:00:00Z'
                ],
                [
                    'id' => '4',
                    'roll_number' => '2024004',
                    'name' => 'Michael Brown',
                    'email' => 'michael.brown@student.edu',
                    'class' => '10-B',
                    'phone' => '123-456-7896',
                    'guardian_name' => 'Lisa Brown',
                    'guardian_phone' => '123-456-7897',
                    'is_active' => true,
                    'created_at' => '2024-01-18T00:00:00Z'
                ]
            ];
        }

        if (strpos($this->query, 'courses') !== false) {
            return [
                [
                    'id' => '1',
                    'course_name' => 'Mathematics',
                    'course_code' => 'MATH101',
                    'description' => 'Basic Mathematics and Algebra',
                    'credits' => 4,
                    'semester' => 'Fall 2024',
                    'is_active' => true,
                    'created_at' => '2024-01-01T00:00:00Z'
                ],
                [
                    'id' => '2',
                    'course_name' => 'Physics',
                    'course_code' => 'PHY101',
                    'description' => 'Introduction to Physics',
                    'credits' => 4,
                    'semester' => 'Fall 2024',
                    'is_active' => true,
                    'created_at' => '2024-01-01T00:00:00Z'
                ],
                [
                    'id' => '3',
                    'course_name' => 'Chemistry',
                    'course_code' => 'CHEM101',
                    'description' => 'Basic Chemistry',
                    'credits' => 4,
                    'semester' => 'Fall 2024',
                    'is_active' => true,
                    'created_at' => '2024-01-01T00:00:00Z'
                ]
            ];
        }

        if (strpos($this->query, 'results') !== false) {
            return [
                [
                    'id' => '1',
                    'student_id' => '1',
                    'course_id' => '1',
                    'marks' => 95,
                    'grade' => 'A+',
                    'percentage' => 95,
                    'exam_date' => '2024-03-15',
                    'exam_type' => 'Final Exam',
                    'student_name' => 'John Smith',
                    'course_name' => 'Mathematics',
                    'course_code' => 'MATH101',
                    'roll_number' => '2024001',
                    'created_at' => '2024-03-16T00:00:00Z'
                ],
                [
                    'id' => '2',
                    'student_id' => '2',
                    'course_id' => '1',
                    'marks' => 88,
                    'grade' => 'A',
                    'percentage' => 88,
                    'exam_date' => '2024-03-15',
                    'exam_type' => 'Final Exam',
                    'student_name' => 'Emily Johnson',
                    'course_name' => 'Mathematics',
                    'course_code' => 'MATH101',
                    'roll_number' => '2024002',
                    'created_at' => '2024-03-16T00:00:00Z'
                ],
                [
                    'id' => '3',
                    'student_id' => '3',
                    'course_id' => '2',
                    'marks' => 78,
                    'grade' => 'B+',
                    'percentage' => 78,
                    'exam_date' => '2024-03-20',
                    'exam_type' => 'Final Exam',
                    'student_name' => 'Sarah Wilson',
                    'course_name' => 'Physics',
                    'course_code' => 'PHY101',
                    'roll_number' => '2024003',
                    'created_at' => '2024-03-21T00:00:00Z'
                ],
                [
                    'id' => '4',
                    'student_id' => '4',
                    'course_id' => '3',
                    'marks' => 65,
                    'grade' => 'B',
                    'percentage' => 65,
                    'exam_date' => '2024-03-25',
                    'exam_type' => 'Final Exam',
                    'student_name' => 'Michael Brown',
                    'course_name' => 'Chemistry',
                    'course_code' => 'CHEM101',
                    'roll_number' => '2024004',
                    'created_at' => '2024-03-26T00:00:00Z'
                ]
            ];
        }

        return [];
    }


}
?>