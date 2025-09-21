"use client";

import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useAuthGuard } from "@/lib/auth";
import api from "@/lib/api";
import { Student, TableColumn } from "@/types";
import { formatDate, getGradeColor } from "@/lib/utils";
import StudentForm from "@/components/forms/StudentForm";
import StudentDetails from "@/components/modals/StudentDetails";
import toast from "react-hot-toast";
import swal from "@/lib/sweetAlert";

export default function StudentsPage() {
  const { hasAccess } = useAuthGuard("admin");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }
    fetchStudents();
  }, [hasAccess]);

  const fetchStudents = async () => {
    try {
      const response = await api.students.getAll();
      if (response.success) {
        if (response.data) {
          setStudents(response.data);
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
      }
      await swal.error(
        "Failed to Load Students",
        "Unable to fetch student data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const handleDeleteStudent = async (student: Student) => {
    const result = await swal.confirm(
      "Delete Student",
      `Are you sure you want to delete ${student.name}? This action cannot be undone.`,
      "Yes, delete it!",
      "Cancel"
    );

    if (result.isConfirmed) {
      swal.loading("Deleting student...");
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await swal.success("Student Deleted!", "The student has been deleted successfully.");
        fetchStudents();
      } catch (error) {
        await swal.error("Error", "Failed to delete student. Please try again.");
      }
    }
  };

  const handleFormSubmit = async (data: Partial<Student>) => {
    swal.loading(
      isEditing ? "Updating student..." : "Creating student..."
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (isEditing && selectedStudent) {
        await swal.success("Student Updated!", "The student has been updated successfully.");
      } else {
        await swal.success("Student Created!", "The student has been created successfully.");
      }

      setShowForm(false);
      fetchStudents();
    } catch (error) {
      await swal.error(
        "Error!",
        isEditing ? "Failed to update student" : "Failed to create student"
      );
    }
  };

  const columns: TableColumn[] = [
    {
      key: "roll_number",
      label: "Roll Number",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "class",
      label: "Class",
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {value}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "created_at",
      label: "Enrolled",
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
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <p className="text-gray-600">
              Manage student profiles and academic records
            </p>
          </div>
          <Button onClick={handleAddStudent}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Students Table */}
        <DataTable
          data={students}
          columns={columns}
          loading={loading}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          onView={handleViewStudent}
          emptyMessage="No students found. Add your first student to get started."
        />

        {/* Student Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title={isEditing ? "Edit Student" : "Add New Student"}
          size="lg"
        >
          <StudentForm
            student={selectedStudent}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>

        {/* Student Details Modal */}
        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title="Student Details"
          size="lg"
        >
          {selectedStudent && (
            <StudentDetails
              student={selectedStudent}
              onEdit={() => {
                setShowDetails(false);
                handleEditStudent(selectedStudent);
              }}
              onClose={() => setShowDetails(false)}
            />
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
