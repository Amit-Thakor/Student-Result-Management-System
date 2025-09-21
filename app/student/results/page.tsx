"use client";

import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  TrophyIcon,
  AcademicCapIcon,
  CalendarIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { useAuthGuard } from "@/lib/auth";
import { Result, TableColumn } from "@/types";
import { formatDate, getGradeColor, getPerformanceStatus } from "@/lib/utils";
import StudentResultsChart from "@/components/dashboard/StudentResultsChart";
import GradeProgressChart from "@/components/dashboard/GradeProgressChart";

export default function StudentResultsPage() {
  const { hasAccess, user } = useAuthGuard("student");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("all");

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }
    fetchResults();
  }, [hasAccess]);

  const fetchResults = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResults: Result[] = [
        {
          id: "1",
          student_id: "2",
          course_id: "1",
          marks: 85,
          grade: "A",
          percentage: 85,
          exam_date: "2024-03-15",
          exam_type: "Final Exam",
          student_name: "John Smith",
          course_name: "Mathematics",
          course_code: "MATH101",
          roll_number: "2024001",
          created_at: "2024-03-16T00:00:00Z",
        },
        {
          id: "2",
          student_id: "2",
          course_id: "2",
          marks: 78,
          grade: "B+",
          percentage: 78,
          exam_date: "2024-03-12",
          exam_type: "Final Exam",
          student_name: "John Smith",
          course_name: "Physics",
          course_code: "PHY101",
          roll_number: "2024001",
          created_at: "2024-03-13T00:00:00Z",
        },
        {
          id: "3",
          student_id: "2",
          course_id: "3",
          marks: 92,
          grade: "A+",
          percentage: 92,
          exam_date: "2024-03-10",
          exam_type: "Final Exam",
          student_name: "John Smith",
          course_name: "Chemistry",
          course_code: "CHEM101",
          roll_number: "2024001",
          created_at: "2024-03-11T00:00:00Z",
        },
        {
          id: "4",
          student_id: "2",
          course_id: "4",
          marks: 88,
          grade: "A",
          percentage: 88,
          exam_date: "2024-03-08",
          exam_type: "Final Exam",
          student_name: "John Smith",
          course_name: "English Literature",
          course_code: "ENG101",
          roll_number: "2024001",
          created_at: "2024-03-09T00:00:00Z",
        },
        {
          id: "5",
          student_id: "2",
          course_id: "5",
          marks: 82,
          grade: "A",
          percentage: 82,
          exam_date: "2024-03-05",
          exam_type: "Final Exam",
          student_name: "John Smith",
          course_name: "Computer Science",
          course_code: "CS101",
          roll_number: "2024001",
          created_at: "2024-03-06T00:00:00Z",
        },
        {
          id: "6",
          student_id: "2",
          course_id: "6",
          marks: 75,
          grade: "B+",
          percentage: 75,
          exam_date: "2024-03-02",
          exam_type: "Final Exam",
          student_name: "John Smith",
          course_name: "Biology",
          course_code: "BIO101",
          roll_number: "2024001",
          created_at: "2024-03-03T00:00:00Z",
        },
      ];

      setResults(mockResults);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn[] = [
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
      render: (value, row) => {
        const status = getPerformanceStatus(value);
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{value}%</span>
            {value >= 85 ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500" />
            ) : value < 60 ? (
              <ArrowDownIcon className="w-4 h-4 text-red-500" />
            ) : null}
          </div>
        );
      },
    },
    {
      key: "grade",
      label: "Grade",
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(
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
      label: "Date",
      sortable: true,
      render: (value) => formatDate(value),
    },
  ];

  // Calculate statistics
  const totalSubjects = results.length;
  const averageMarks =
    results.length > 0
      ? (
          results.reduce((sum, result) => sum + result.marks, 0) /
          results.length
        ).toFixed(1)
      : "0";
  const highestMarks =
    results.length > 0 ? Math.max(...results.map((r) => r.marks)) : 0;
  const lowestMarks =
    results.length > 0 ? Math.min(...results.map((r) => r.marks)) : 0;
  const gpa =
    results.length > 0
      ? ((parseFloat(averageMarks) * 4.0) / 100).toFixed(2)
      : "0.00";

  // Get overall grade
  const getOverallGrade = (avg: number) => {
    if (avg >= 90) return "A+";
    if (avg >= 80) return "A";
    if (avg >= 70) return "B+";
    if (avg >= 60) return "B";
    if (avg >= 50) return "C+";
    if (avg >= 40) return "C";
    if (avg >= 33) return "D";
    return "F";
  };

  const overallGrade = getOverallGrade(parseFloat(averageMarks));

  if (!hasAccess) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
            <p className="text-gray-600">
              View your academic performance and grades
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Semesters</option>
              <option value="fall2024">Fall 2024</option>
              <option value="spring2024">Spring 2024</option>
            </select>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Subjects
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalSubjects}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Marks
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {averageMarks}%
                  </p>
                  <p className="text-xs text-gray-500">Grade: {overallGrade}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Current GPA
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{gpa}</p>
                  <p className="text-xs text-gray-500">Out of 4.0</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Best Score
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {highestMarks}%
                  </p>
                  <p className="text-xs text-gray-500">
                    Lowest: {lowestMarks}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentResultsChart results={results} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <GradeProgressChart results={results} />
            </CardContent>
          </Card>
        </div>

        {/* Performance Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
                <div className="space-y-1">
                  {results
                    .filter((r) => r.marks >= 85)
                    .slice(0, 3)
                    .map((result) => (
                      <p key={result.id} className="text-sm text-green-700">
                        {result.course_name} ({result.marks}%)
                      </p>
                    ))}
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Average Performance
                </h4>
                <div className="space-y-1">
                  {results
                    .filter((r) => r.marks >= 70 && r.marks < 85)
                    .slice(0, 3)
                    .map((result) => (
                      <p key={result.id} className="text-sm text-blue-700">
                        {result.course_name} ({result.marks}%)
                      </p>
                    ))}
                </div>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Needs Improvement
                </h4>
                <div className="space-y-1">
                  {results
                    .filter((r) => r.marks < 70)
                    .slice(0, 3)
                    .map((result) => (
                      <p key={result.id} className="text-sm text-yellow-700">
                        {result.course_name} ({result.marks}%)
                      </p>
                    ))}
                  {results.filter((r) => r.marks < 70).length === 0 && (
                    <p className="text-sm text-yellow-700">
                      Great job! Keep it up!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={results}
              columns={columns}
              loading={loading}
              emptyMessage="No results found for the selected semester."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
