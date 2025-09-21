"use client";

import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  ChartBarIcon,
  TrophyIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useAuthGuard } from "@/lib/auth";
import api from "@/lib/api";
import { Result, TableColumn, Student, Course } from "@/types";
import { formatDate, getGradeColor } from "@/lib/utils";
import ResultForm from "@/components/forms/ResultForm";
import toast from "react-hot-toast";
import swal from "@/lib/sweetAlert";

export default function ResultsPage() {
  const { hasAccess } = useAuthGuard("admin");
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }
    fetchData();
  }, [hasAccess]);

  const fetchData = async () => {
    try {
      const [resultsResponse, studentsResponse, coursesResponse] =
        await Promise.all([
          api.results.getAll(),
          api.students.getAll(),
          api.courses.getAll(),
        ]);

      if (resultsResponse.success && resultsResponse.data)
        setResults(resultsResponse.data);
      if (studentsResponse.success && studentsResponse.data)
        setStudents(studentsResponse.data);
      if (coursesResponse.success && coursesResponse.data)
        setCourses(coursesResponse.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      await swal.error(
        "Failed to Load Results",
        "Unable to fetch results data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddResult = () => {
    setSelectedResult(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditResult = (result: Result) => {
    setSelectedResult(result);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteResult = async (result: Result) => {
    if (window.confirm(`Are you sure you want to delete this result?`)) {
      try {
        toast.success("Result deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete result");
      }
    }
  };

  const handleFormSubmit = async (data: Partial<Result>) => {
    try {
      if (isEditing && selectedResult) {
        toast.success("Result updated successfully");
      } else {
        toast.success("Result created successfully");
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update result" : "Failed to create result"
      );
    }
  };

  const columns: TableColumn[] = [
    {
      key: "student_name",
      label: "Student",
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{row.roll_number}</p>
        </div>
      ),
    },
    {
      key: "course_name",
      label: "Course",
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-600">{row.course_code}</p>
        </div>
      ),
    },
    {
      key: "marks",
      label: "Marks",
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-gray-900">{value}%</span>
      ),
    },
    {
      key: "grade",
      label: "Grade",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(
            value
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "exam_type",
      label: "Exam Type",
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
          {value}
        </span>
      ),
    },
    {
      key: "exam_date",
      label: "Exam Date",
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: "created_at",
      label: "Added",
      sortable: true,
      render: (value) => formatDate(value, "relative"),
    },
  ];

  // Calculate statistics
  const totalResults = results.length;
  const averageMarks =
    results.length > 0
      ? (
          results.reduce((sum, result) => sum + result.marks, 0) /
          results.length
        ).toFixed(1)
      : "0";
  const passRate =
    results.length > 0
      ? (
          (results.filter((result) => result.marks >= 40).length /
            results.length) *
          100
        ).toFixed(1)
      : "0";
  const topPerformers = results.filter((result) => result.marks >= 90).length;

  if (!hasAccess) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Results</h1>
            <p className="text-gray-600">
              Manage student exam results and grades
            </p>
          </div>
          <Button onClick={handleAddResult}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Result
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Results
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalResults}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Marks
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageMarks}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                <p className="text-2xl font-bold text-gray-900">{passRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Top Performers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {topPerformers}
                </p>
                <p className="text-xs text-gray-500">90%+ marks</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <DataTable
          data={results}
          columns={columns}
          loading={loading}
          onEdit={handleEditResult}
          onDelete={handleDeleteResult}
          emptyMessage="No results found. Add your first result to get started."
        />

        {/* Result Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title={isEditing ? "Edit Result" : "Add New Result"}
          size="lg"
        >
          <ResultForm
            result={selectedResult}
            students={students}
            courses={courses}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
