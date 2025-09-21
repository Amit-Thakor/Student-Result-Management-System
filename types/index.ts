export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "student";
}

export interface Student {
  id: string;
  roll_number: string;
  name: string;
  email: string;
  class: string;
  date_of_birth?: string;
  phone?: string;
  address?: string;
  guardian_name?: string;
  guardian_phone?: string;
  enrollment_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  course_name: string;
  course_code: string;
  description?: string;
  credits: number;
  semester: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Result {
  id: string;
  student_id: string;
  course_id: string;
  marks: number;
  grade: string;
  percentage: number;
  exam_date: string;
  exam_type: string;
  remarks?: string;
  created_at: string;
  updated_at?: string;
  // Joined fields
  student_name?: string;
  course_name?: string;
  course_code?: string;
  roll_number?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalResults: number;
  averageGrade: string;
  passRate: number;
  topPerformers: Array<{
    name: string;
    roll_number: string;
    average_marks: number;
    grade: string;
  }>;
  gradeDistribution: Array<{
    grade: string;
    count: number;
    percentage: number;
  }>;
  recentResults: Result[];
}

export interface StudentProfile extends Student {
  results: Result[];
  gpa: number;
  totalSubjects: number;
  averageMarks: number;
  overallGrade: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PerformanceData {
  subject: string;
  marks: number;
  grade: string;
  maxMarks: number;
}

export interface TrendData {
  month: string;
  average: number;
  students: number;
}
