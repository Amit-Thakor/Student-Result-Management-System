import { ApiResponse, Student, Course, Result, DashboardStats } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log("🌐 API Request:", {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: options.body
    });

    try {
      const response = await fetch(url, config);
      console.log("📨 API Response Status:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Network error" }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("📦 API Response Data:", data);

      // Ensure we return the expected format
      if (data.success !== undefined) {
        return data;
      } else {
        // If the response doesn't have success field, wrap it
        return {
          success: true,
          message: "Request successful",
          data: data,
        };
      }
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === "development") {
        console.error("API Request Error:", error);
        console.error("URL:", url);
      }
      throw error;
    }
  }

  // Authentication
  auth = {
    login: async (email: string, password: string) => {
      return this.request<{ user: any; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    },

    register: async (userData: any) => {
      return this.request<{ message: string; status: string }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
        }
      );
    },

    verify: async () => {
      return this.request<{ user: any }>("/auth/verify");
    },
  };

  // Students
  students = {
    getAll: async (params?: {
      page?: number;
      limit?: number;
      class?: string;
      search?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.page)
        searchParams.append(
          "offset",
          ((params.page - 1) * (params.limit || 50)).toString()
        );
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.class) searchParams.append("class", params.class);
      if (params?.search) searchParams.append("search", params.search);

      const query = searchParams.toString();
      return this.request<Student[]>(`/students${query ? `?${query}` : ""}`);
    },

    getById: async (id: string) => {
      return this.request<Student>(`/students/${id}`);
    },

    create: async (student: Partial<Student>) => {
      return this.request<Student>("/students", {
        method: "POST",
        body: JSON.stringify(student),
      });
    },

    update: async (id: string, student: Partial<Student>) => {
      return this.request<Student>(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(student),
      });
    },

    delete: async (id: string) => {
      return this.request<void>(`/students/${id}`, {
        method: "DELETE",
      });
    },

    getResults: async (id: string) => {
      return this.request<Result[]>(`/students/results/${id}`);
    },

    getStatistics: async (id: string) => {
      return this.request<any>(`/students/statistics/${id}`);
    },

    getForDropdown: async () => {
      return this.request<
        Array<{ id: string; name: string; roll_number: string }>
      >("/students/dropdown");
    },
  };

  // Courses
  courses = {
    getAll: async (params?: { search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append("search", params.search);

      const query = searchParams.toString();
      return this.request<Course[]>(`/courses${query ? `?${query}` : ""}`);
    },

    getById: async (id: string) => {
      return this.request<Course>(`/courses/${id}`);
    },

    create: async (course: Partial<Course>) => {
      return this.request<Course>("/courses", {
        method: "POST",
        body: JSON.stringify(course),
      });
    },

    update: async (id: string, course: Partial<Course>) => {
      return this.request<Course>(`/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(course),
      });
    },

    delete: async (id: string) => {
      return this.request<void>(`/courses/${id}`, {
        method: "DELETE",
      });
    },

    getStatistics: async (id: string) => {
      return this.request<any>(`/courses/statistics/${id}`);
    },

    getForDropdown: async () => {
      return this.request<
        Array<{ id: string; course_name: string; course_code: string }>
      >("/courses/dropdown");
    },
  };

  // Results
  results = {
    getAll: async (params?: { studentId?: string; courseId?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.studentId)
        searchParams.append("student_id", params.studentId);
      if (params?.courseId) searchParams.append("course_id", params.courseId);

      const query = searchParams.toString();
      return this.request<Result[]>(`/results${query ? `?${query}` : ""}`);
    },

    getById: async (id: string) => {
      return this.request<Result>(`/results/${id}`);
    },

    create: async (result: Partial<Result>) => {
      return this.request<Result>("/results", {
        method: "POST",
        body: JSON.stringify(result),
      });
    },

    update: async (id: string, result: Partial<Result>) => {
      return this.request<Result>(`/results/${id}`, {
        method: "PUT",
        body: JSON.stringify(result),
      });
    },

    delete: async (id: string) => {
      return this.request<void>(`/results/${id}`, {
        method: "DELETE",
      });
    },

    getStudentResults: async () => {
      return this.request<Result[]>("/results/student");
    },
  };

  // Dashboard
  dashboard = {
    getStats: async () => {
      return this.request<DashboardStats>("/results/dashboard");
    },

    getStudentStats: async (studentId: string) => {
      return this.request<any>(`/students/statistics/${studentId}`);
    },
  };
}

export const api = new ApiClient(API_BASE);

// Initialize token from auth store if available
if (typeof window !== "undefined") {
  const authStorage = localStorage.getItem("auth-storage");
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        api.setToken(state.token);
      }
    } catch (error) {
      // Silently handle auth storage parsing errors
      // In production, you might want to log this to an error tracking service
    }
  }
}

// Export the main API instance
export default api;
