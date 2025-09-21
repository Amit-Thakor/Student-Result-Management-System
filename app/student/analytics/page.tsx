"use client";

import React, { useEffect, useState } from "react";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthGuard } from "@/lib/auth";
import StudentPerformanceChart from "@/components/dashboard/StudentPerformanceChart";
import GradeDistributionChart from "@/components/dashboard/GradeDistributionChart";

interface AnalyticsData {
  overallGPA: number;
  semesterGPA: number;
  totalCredits: number;
  completedCredits: number;
  attendanceRate: number;
  studyHours: number;
  performanceData: Array<{
    subject: string;
    marks: number;
    maxMarks: number;
    grade: string;
  }>;
  gradeDistribution: Array<{
    grade: string;
    count: number;
    percentage: number;
  }>;
  monthlyProgress: Array<{
    month: string;
    gpa: number;
    attendance: number;
  }>;
  subjectAnalytics: Array<{
    subject: string;
    currentGrade: string;
    trend: "up" | "down" | "stable";
    improvement: number;
    assignments: {
      completed: number;
      total: number;
    };
  }>;
}

export default function StudentAnalytics() {
  const { hasAccess, user } = useAuthGuard("student");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<"semester" | "year">("semester");

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }

    fetchAnalytics();
  }, [hasAccess, selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAnalytics: AnalyticsData = {
        overallGPA: 3.45,
        semesterGPA: 3.62,
        totalCredits: 120,
        completedCredits: 95,
        attendanceRate: 92.5,
        studyHours: 28,
        performanceData: [
          { subject: "Mathematics", marks: 85, maxMarks: 100, grade: "A-" },
          { subject: "Physics", marks: 78, maxMarks: 100, grade: "B+" },
          { subject: "Chemistry", marks: 92, maxMarks: 100, grade: "A+" },
          { subject: "English", marks: 88, maxMarks: 100, grade: "A" },
          { subject: "Biology", marks: 82, maxMarks: 100, grade: "B+" },
          { subject: "History", marks: 75, maxMarks: 100, grade: "B" },
        ],
        gradeDistribution: [
          { grade: "A+", count: 3, percentage: 25 },
          { grade: "A", count: 4, percentage: 33.3 },
          { grade: "B+", count: 3, percentage: 25 },
          { grade: "B", count: 2, percentage: 16.7 },
        ],
        monthlyProgress: [
          { month: "Jan", gpa: 3.2, attendance: 88 },
          { month: "Feb", gpa: 3.35, attendance: 91 },
          { month: "Mar", gpa: 3.45, attendance: 93 },
          { month: "Apr", gpa: 3.52, attendance: 89 },
          { month: "May", gpa: 3.62, attendance: 95 },
        ],
        subjectAnalytics: [
          {
            subject: "Mathematics",
            currentGrade: "A-",
            trend: "up",
            improvement: 8.5,
            assignments: { completed: 8, total: 10 },
          },
          {
            subject: "Physics",
            currentGrade: "B+",
            trend: "stable",
            improvement: 0,
            assignments: { completed: 7, total: 8 },
          },
          {
            subject: "Chemistry",
            currentGrade: "A+",
            trend: "up",
            improvement: 12.3,
            assignments: { completed: 9, total: 9 },
          },
          {
            subject: "English",
            currentGrade: "A",
            trend: "down",
            improvement: -3.2,
            assignments: { completed: 6, total: 8 },
          },
        ],
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
      case "down":
        return <ArrowTrendingUpIcon className="w-4 h-4 text-red-500 rotate-180" />;
      case "stable":
        return <div className="w-4 h-0.5 bg-gray-400"></div>;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
    }
  };

  if (!hasAccess) {
    return null;
  }

  if (loading || !analytics) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academic Analytics</h1>
            <p className="text-gray-600 mt-2">
              Detailed insights into your academic performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPeriod("semester")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === "semester"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              This Semester
            </button>
            <button
              onClick={() => setSelectedPeriod("year")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === "year"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Academic Year
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current GPA</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.semesterGPA.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Overall: {analytics.overallGPA.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Credits Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.completedCredits}/{analytics.totalCredits}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round((analytics.completedCredits / analytics.totalCredits) * 100)}% Complete
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.attendanceRate}%
                  </p>
                  <p className="text-xs text-green-600">Above average</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Study Hours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.studyHours}h
                  </p>
                  <p className="text-xs text-gray-500">This week</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-orange-600" />
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
              <StudentPerformanceChart data={analytics.performanceData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <GradeDistributionChart data={analytics.gradeDistribution} />
            </CardContent>
          </Card>
        </div>

        {/* Subject Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-wise Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.subjectAnalytics.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {subject.subject.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Current Grade: {subject.currentGrade}</span>
                        <span>
                          Assignments: {subject.assignments.completed}/{subject.assignments.total}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-1 ${getTrendColor(subject.trend)}`}>
                      {getTrendIcon(subject.trend)}
                      <span className="text-sm font-medium">
                        {subject.improvement !== 0 && (
                          <>
                            {subject.improvement > 0 ? "+" : ""}
                            {subject.improvement.toFixed(1)}%
                          </>
                        )}
                        {subject.improvement === 0 && "Stable"}
                      </span>
                    </div>
                    <Badge
                      className={`${
                        subject.currentGrade.startsWith("A")
                          ? "bg-green-100 text-green-800"
                          : subject.currentGrade.startsWith("B")
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {subject.currentGrade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StarIcon className="w-5 h-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Focus on English</h4>
                <p className="text-sm text-blue-700">
                  Your English grade has declined by 3.2%. Consider scheduling extra study time
                  and completing pending assignments.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Great progress in Chemistry!</h4>
                <p className="text-sm text-green-700">
                  You've improved by 12.3% this semester. Keep up the excellent work!
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-1">Maintain attendance</h4>
                <p className="text-sm text-yellow-700">
                  Your attendance rate is excellent at 92.5%. Try to maintain this consistency.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
