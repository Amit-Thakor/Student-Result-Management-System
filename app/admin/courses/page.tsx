"use client";

import React, { useState, useEffect } from "react";
import { PlusIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useAuthGuard } from "@/lib/auth";
import api from "@/lib/api";
import { Course, TableColumn } from "@/types";
import { formatDate } from "@/lib/utils";
import CourseForm from "@/components/forms/CourseForm";
import toast from "react-hot-toast";
import swal from "@/lib/sweetAlert";

export default function CoursesPage() {
  const { hasAccess } = useAuthGuard("admin");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }
    fetchCourses();
  }, [hasAccess]);

  const fetchCourses = async () => {
    try {
      const response = await api.courses.getAll();
      if (response.success && response.data) {
        setCourses(response.data);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch courses:", error);
      }
      await swal.error(
        "Failed to Load Courses",
        "Unable to fetch course data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteCourse = async (course: Course) => {
    const result = await swal.confirm(
      "Delete Course",
      `Are you sure you want to delete "${course.course_name}"? This will also remove all associated results.`,
      "Yes, delete it!",
      "Cancel"
    );

    if (result.isConfirmed) {
      const loadingAlert = swal.loading("Deleting course...");
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        loadingAlert.close();
        swal.success(
          "Deleted!",
          `${course.course_name} has been deleted successfully.`
        );
        fetchCourses();
      } catch (error) {
        loadingAlert.close();
        swal.error("Error!", "Failed to delete course. Please try again.");
      }
    }
  };

  const handleFormSubmit = async (data: Partial<Course>) => {
    const loadingAlert = swal.loading(
      isEditing ? "Updating course..." : "Creating course..."
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      loadingAlert.close();

      if (isEditing && selectedCourse) {
        swal.success(
          "Updated!",
          `${data.course_name} has been updated successfully.`
        );
      } else {
        swal.success(
          "Created!",
          `${data.course_name} has been added successfully.`
        );
      }

      setShowForm(false);
      fetchCourses();
    } catch (error) {
      loadingAlert.close();
      swal.error(
        "Error!",
        isEditing ? "Failed to update course" : "Failed to create course"
      );
    }
  };

  const columns: TableColumn[] = [
    {
      key: "course_code",
      label: "Course Code",
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      ),
    },
    {
      key: "course_name",
      label: "Course Name",
      sortable: true,
    },
    {
      key: "credits",
      label: "Credits",
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {value} Credits
        </span>
      ),
    },
    {
      key: "semester",
      label: "Semester",
      sortable: true,
    },
    {
      key: "description",
      label: "Description",
      render: (value) => (
        <span className="text-gray-600 text-sm">
          {value
            ? value.length > 50
              ? `${value.substring(0, 50)}...`
              : value
            : "No description"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "is_active",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            value ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  if (!hasAccess) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            <p className="text-gray-600">
              Manage academic courses and curriculum
            </p>
          </div>
          <Button onClick={handleAddCourse}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Courses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter((c) => c.is_active).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Credits
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce(
                    (sum, course) => sum + (course.credits || 0),
                    0
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Credits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.length > 0
                    ? (
                        courses.reduce(
                          (sum, course) => sum + (course.credits || 0),
                          0
                        ) / courses.length
                      ).toFixed(1)
                    : "0"}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <DataTable
          data={courses}
          columns={columns}
          loading={loading}
          onEdit={handleEditCourse}
          onDelete={handleDeleteCourse}
          emptyMessage="No courses found. Add your first course to get started."
        />

        {/* Course Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title={isEditing ? "Edit Course" : "Add New Course"}
          size="lg"
        >
          <CourseForm
            course={selectedCourse}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
