<?php
/**
 * Mock Result Model for Testing
 * Provides mock data for dashboard statistics
 */
class MockResult {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get mock dashboard statistics
     * @return array Dashboard statistics
     */
    public function getDashboardStats() {
        return [
            'total_results' => 4,
            'average_marks' => 81.5,
            'pass_rate' => 100,
            'grade_distribution' => [
                ['grade' => 'A+', 'count' => 1, 'percentage' => 25],
                ['grade' => 'A', 'count' => 1, 'percentage' => 25],
                ['grade' => 'B+', 'count' => 1, 'percentage' => 25],
                ['grade' => 'B', 'count' => 1, 'percentage' => 25]
            ],
            'top_performers' => [
                [
                    'name' => 'John Smith',
                    'roll_number' => '2024001',
                    'average_marks' => 95.0,
                    'grade' => 'A+'
                ],
                [
                    'name' => 'Emily Johnson',
                    'roll_number' => '2024002',
                    'average_marks' => 88.0,
                    'grade' => 'A'
                ],
                [
                    'name' => 'Sarah Wilson',
                    'roll_number' => '2024003',
                    'average_marks' => 78.0,
                    'grade' => 'B+'
                ],
                [
                    'name' => 'Michael Brown',
                    'roll_number' => '2024004',
                    'average_marks' => 65.0,
                    'grade' => 'B'
                ]
            ],
            'recent_results' => [
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
                ]
            ]
        ];
    }

    // Mock other methods for compatibility
    public function getAll($limit = 50, $offset = 0, $student_id = null, $course_id = null) {
        return $this->getDashboardStats()['recent_results'];
    }

    public function getById($id) {
        $results = $this->getDashboardStats()['recent_results'];
        foreach ($results as $result) {
            if ($result['id'] === $id) {
                return $result;
            }
        }
        return false;
    }

    public function getByStudentId($student_id) {
        $results = $this->getDashboardStats()['recent_results'];
        return array_filter($results, function($result) use ($student_id) {
            return $result['student_id'] === $student_id;
        });
    }

    public function create($data) {
        return '5'; // Mock new ID
    }

    public function update($id, $data) {
        return true;
    }

    public function delete($id) {
        return true;
    }

    public function resultExists($student_id, $course_id, $exam_type, $exam_date, $exclude_id = null) {
        return false; // Mock: no duplicates
    }
}
?>