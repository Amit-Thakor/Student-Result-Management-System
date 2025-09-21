# 🚀 Student Result Management System - API Documentation

## 📋 **Overview**

This document provides comprehensive documentation for the Student Result Management System REST API built with PHP and PostgreSQL.

**Base URL**: `http://localhost:8000`

## 🔐 **Authentication**

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### **Login**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@school.edu",
  "password": "password"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@school.edu",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

### **Verify Token**

```http
GET /auth/verify
Authorization: Bearer <token>
```

## 👥 **Students API**

### **Get All Students** (Admin Only)

```http
GET /students
Authorization: Bearer <admin_token>

Query Parameters:
- limit: Number of records (default: 50)
- offset: Starting point (default: 0)
- class: Filter by class
- search: Search in name, roll_number, or email
```

### **Get Student by ID**

```http
GET /students/{id}
Authorization: Bearer <token>
```

_Note: Students can only access their own data_

### **Create Student** (Admin Only)

```http
POST /students
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "roll_number": "2024001",
  "name": "John Smith",
  "email": "john.smith@student.edu",
  "password": "password123",
  "class": "10-A",
  "date_of_birth": "2006-05-15",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "guardian_name": "Robert Smith",
  "guardian_phone": "123-456-7891"
}
```

### **Update Student**

```http
PUT /students/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith Updated",
  "email": "john.updated@student.edu",
  "class": "10-A",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "guardian_name": "Robert Smith",
  "guardian_phone": "123-456-7891"
}
```

### **Delete Student** (Admin Only)

```http
DELETE /students/{id}
Authorization: Bearer <admin_token>
```

### **Get Student Results**

```http
GET /students/results/{id}
Authorization: Bearer <token>
```

### **Get Student Statistics**

```http
GET /students/statistics/{id}
Authorization: Bearer <token>
```

### **Get Students for Dropdown**

```http
GET /students/dropdown
Authorization: Bearer <admin_token>
```

## 📚 **Courses API**

### **Get All Courses**

```http
GET /courses
Authorization: Bearer <token>

Query Parameters:
- search: Search in course_name or course_code
```

### **Get Course by ID**

```http
GET /courses/{id}
Authorization: Bearer <token>
```

### **Create Course** (Admin Only)

```http
POST /courses
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "course_name": "Mathematics",
  "course_code": "MATH101",
  "description": "Basic Mathematics and Algebra",
  "credits": 4,
  "semester": "Fall 2024"
}
```

### **Update Course** (Admin Only)

```http
PUT /courses/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "course_name": "Advanced Mathematics",
  "course_code": "MATH101",
  "description": "Advanced Mathematics and Algebra",
  "credits": 4,
  "semester": "Fall 2024"
}
```

### **Delete Course** (Admin Only)

```http
DELETE /courses/{id}
Authorization: Bearer <admin_token>
```

### **Get Course Statistics**

```http
GET /courses/statistics/{id}
Authorization: Bearer <token>
```

### **Get Courses for Dropdown**

```http
GET /courses/dropdown
Authorization: Bearer <token>
```

## 📊 **Results API**

### **Get All Results** (Admin Only)

```http
GET /results
Authorization: Bearer <admin_token>

Query Parameters:
- student_id: Filter by student ID
- course_id: Filter by course ID
```

### **Get Result by ID**

```http
GET /results/{id}
Authorization: Bearer <token>
```

### **Create Result** (Admin Only)

```http
POST /results
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "student_id": "uuid",
  "course_id": "uuid",
  "marks": 85.5,
  "exam_date": "2024-03-15",
  "exam_type": "Final Exam",
  "remarks": "Good performance"
}
```

### **Update Result** (Admin Only)

```http
PUT /results/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "student_id": "uuid",
  "course_id": "uuid",
  "marks": 88.0,
  "exam_date": "2024-03-15",
  "exam_type": "Final Exam",
  "remarks": "Excellent performance"
}
```

### **Delete Result** (Admin Only)

```http
DELETE /results/{id}
Authorization: Bearer <admin_token>
```

### **Get Student's Own Results**

```http
GET /results/student
Authorization: Bearer <student_token>
```

### **Get Dashboard Statistics**

```http
GET /results/dashboard
Authorization: Bearer <token>
```

## 📈 **Response Format**

### **Success Response**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### **Error Response**

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    // Validation errors (optional)
  }
}
```

## 🔒 **Role-Based Access Control**

### **Admin Role**

- Full access to all endpoints
- Can manage students, courses, and results
- Can view all data and statistics

### **Student Role**

- Can view own profile and results
- Can update own profile information
- Cannot access other students' data
- Cannot manage courses or results

## ⚠️ **Error Codes**

| Code | Description                             |
| ---- | --------------------------------------- |
| 200  | Success                                 |
| 400  | Bad Request - Invalid input data        |
| 401  | Unauthorized - Invalid or missing token |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource doesn't exist      |
| 405  | Method Not Allowed                      |
| 500  | Internal Server Error                   |

## 🔧 **Validation Rules**

### **Student Validation**

- `roll_number`: Required, unique
- `name`: Required, max 100 characters
- `email`: Required, valid email format, unique
- `password`: Required for new students, min 6 characters
- `class`: Required, max 50 characters
- `phone`: Optional, valid phone format
- `guardian_phone`: Optional, valid phone format

### **Course Validation**

- `course_name`: Required, max 100 characters
- `course_code`: Required, format: 2-4 letters + 3 digits (e.g., MATH101)
- `credits`: Required, integer between 1-10
- `semester`: Required, max 20 characters

### **Result Validation**

- `student_id`: Required, valid UUID, student must exist
- `course_id`: Required, valid UUID, course must exist
- `marks`: Required, decimal between 0-100
- `exam_date`: Required, valid date format (YYYY-MM-DD)
- `exam_type`: Required, max 50 characters
- Unique combination of student_id, course_id, exam_type, and exam_date

## 🗄️ **Database Schema**

### **Students Table**

```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
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
```

### **Courses Table**

```sql
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
```

### **Results Table**

```sql
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
```

## 🚀 **Getting Started**

1. **Setup Database**

   ```bash
   createdb student_result_system
   psql -d student_result_system -f database_schema.sql
   ```

2. **Configure Backend**

   - Update `backend/config/database.php` with your database credentials
   - Ensure Apache/Nginx is configured to serve the backend directory

3. **Start PHP Server**

   ```bash
   cd backend
   php -S localhost:8000
   ```

4. **Test API**
   ```bash
   curl -X POST http://localhost:8000/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email": "admin@school.edu", "password": "password"}'
   ```

## 🔧 **Development Tips**

1. **Enable Error Logging**

   - Check PHP error logs for debugging
   - Use `error_log()` function in PHP code

2. **Database Debugging**

   - Use pgAdmin or psql for database inspection
   - Check PostgreSQL logs for query errors

3. **CORS Issues**

   - Ensure `.htaccess` is properly configured
   - Check browser developer tools for CORS errors

4. **JWT Token Issues**
   - Verify token format and expiration
   - Check Authorization header format

## 📞 **Support**

For issues or questions:

- Check the error logs first
- Verify database connection
- Ensure proper authentication headers
- Test with provided sample requests

---

**🎓 Built for Student Result Management System v1.0**
