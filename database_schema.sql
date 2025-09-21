
-- Student Result Management System Database Schema

-- Create database (run separately if needed)
-- CREATE DATABASE student_result_system;
-- \c student_result_system;

-- Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table
CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords
    class VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(15),
    address TEXT,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(15),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    credits INTEGER DEFAULT 3,
    semester VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results table
CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    marks DECIMAL(5,2) NOT NULL CHECK (marks >= 0 AND marks <= 100),
    grade VARCHAR(2),
    percentage DECIMAL(5,2),
    exam_date DATE,
    exam_type VARCHAR(50) DEFAULT 'Final',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, exam_type, exam_date)
);

-- Function to calculate grade based on marks
CREATE OR REPLACE FUNCTION calculate_grade(marks DECIMAL)
RETURNS VARCHAR(2) AS $$
BEGIN
    IF marks >= 90 THEN RETURN 'A+';
    ELSIF marks >= 80 THEN RETURN 'A';
    ELSIF marks >= 70 THEN RETURN 'B+';
    ELSIF marks >= 60 THEN RETURN 'B';
    ELSIF marks >= 50 THEN RETURN 'C+';
    ELSIF marks >= 40 THEN RETURN 'C';
    ELSIF marks >= 33 THEN RETURN 'D';
    ELSE RETURN 'F';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate grade and percentage
CREATE OR REPLACE FUNCTION update_result_grade()
RETURNS TRIGGER AS $$
BEGIN
    NEW.grade = calculate_grade(NEW.marks);
    NEW.percentage = NEW.marks;
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER result_grade_trigger
    BEFORE INSERT OR UPDATE ON results
    FOR EACH ROW
    EXECUTE FUNCTION update_result_grade();

-- Indexes for better performance
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_class ON students(class);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_courses_code ON courses(course_code);
CREATE INDEX idx_results_student_id ON results(student_id);
CREATE INDEX idx_results_course_id ON results(course_id);
CREATE INDEX idx_results_exam_date ON results(exam_date);

-- Sample data insertion
INSERT INTO admin (username, email, password, full_name) VALUES
('admin', 'admin@school.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator'),
('principal', 'principal@school.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'School Principal');

INSERT INTO courses (course_name, course_code, description, credits, semester) VALUES
('Mathematics', 'MATH101', 'Basic Mathematics and Algebra', 4, 'Fall 2024'),
('Physics', 'PHY101', 'Introduction to Physics', 4, 'Fall 2024'),
('Chemistry', 'CHEM101', 'General Chemistry', 4, 'Fall 2024'),
('English Literature', 'ENG101', 'Introduction to Literature', 3, 'Fall 2024'),
('Computer Science', 'CS101', 'Programming Fundamentals', 4, 'Fall 2024'),
('Biology', 'BIO101', 'General Biology', 4, 'Fall 2024'),
('History', 'HIST101', 'World History', 3, 'Fall 2024'),
('Economics', 'ECON101', 'Principles of Economics', 3, 'Fall 2024');

INSERT INTO students (roll_number, name, email, password, class, date_of_birth, phone, guardian_name, guardian_phone) VALUES
('2024001', 'John Smith', 'john.smith@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '10-A', '2006-05-15', '123-456-7890', 'Robert Smith', '123-456-7891'),
('2024002', 'Emily Johnson', 'emily.johnson@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '10-A', '2006-08-22', '123-456-7892', 'Michael Johnson', '123-456-7893'),
('2024003', 'Michael Brown', 'michael.brown@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '10-B', '2006-12-03', '123-456-7894', 'David Brown', '123-456-7895'),
('2024004', 'Sarah Davis', 'sarah.davis@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '10-B', '2006-03-18', '123-456-7896', 'Jennifer Davis', '123-456-7897'),
('2024005', 'Alex Wilson', 'alex.wilson@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '11-A', '2005-09-10', '123-456-7898', 'Thomas Wilson', '123-456-7899'),
('2024006', 'Jessica Garcia', 'jessica.garcia@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '11-A', '2005-07-25', '123-456-7900', 'Carlos Garcia', '123-456-7901'),
('2024007', 'David Martinez', 'david.martinez@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '11-B', '2005-11-14', '123-456-7902', 'Maria Martinez', '123-456-7903'),
('2024008', 'Ashley Taylor', 'ashley.taylor@student.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12-A', '2004-06-08', '123-456-7904', 'James Taylor', '123-456-7905');

-- Sample results data
WITH course_ids AS (
    SELECT id, course_code FROM courses WHERE course_code IN ('MATH101', 'PHY101', 'CHEM101', 'ENG101', 'CS101')
),
student_ids AS (
    SELECT id, roll_number FROM students LIMIT 8
)
INSERT INTO results (student_id, course_id, marks, exam_date, exam_type)
SELECT 
    s.id,
    c.id,
    CASE 
        WHEN random() < 0.8 THEN (random() * 40 + 60)::DECIMAL(5,2)  -- 80% get 60-100
        ELSE (random() * 60 + 30)::DECIMAL(5,2)  -- 20% get 30-90
    END,
    CURRENT_DATE - (random() * 30)::INTEGER,
    'Final Exam'
FROM student_ids s
CROSS JOIN course_ids c
WHERE random() < 0.7;  -- Not all students have all subjects

-- Views for easier data access
CREATE VIEW student_results_view AS
SELECT 
    s.roll_number,
    s.name as student_name,
    s.class,
    c.course_name,
    c.course_code,
    r.marks,
    r.grade,
    r.percentage,
    r.exam_date,
    r.exam_type,
    r.created_at
FROM results r
JOIN students s ON r.student_id = s.id
JOIN courses c ON r.course_id = c.id
ORDER BY s.roll_number, c.course_name;

CREATE VIEW student_gpa_view AS
SELECT 
    s.id as student_id,
    s.roll_number,
    s.name,
    s.class,
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
FROM students s
LEFT JOIN results r ON s.id = r.student_id
GROUP BY s.id, s.roll_number, s.name, s.class
ORDER BY average_marks DESC;

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to all tables
CREATE TRIGGER update_admin_updated_at BEFORE UPDATE ON admin FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO api_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO api_user;
