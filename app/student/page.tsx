"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthGuard } from "@/lib/auth";
import StatsCard from "@/components/dashboard/StatsCard";
import StudentPerformanceChart from "@/components/dashboard/StudentPerformanceChart";
import RecentGradesTable from "@/components/dashboard/RecentGradesTable";
import UpcomingExams from "@/components/dashboard/UpcomingExams";

export default function StudentDashboard() {
  const { hasAccess, user } = useAuthGuard("student");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }

    fetchStudentStats();
  }, [hasAccess]);

  const fetchStudentStats = async () => {
    try {
      // Simulate API call for student stats
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalSubjects: 6,
        currentGPA: 3.45,
        overallGrade: "B+",
        completedAssignments: 24,
        pendingAssignments: 3,
        attendanceRate: 92.5,
        recentGrades: [
          { subject: "Mathematics", marks: 85, grade: "A", date: "2024-03-15" },
          { subject: "Physics", marks: 78, grade: "B+", date: "2024-03-12" },
          { subject: "Chemistry", marks: 92, grade: "A+", date: "2024-03-10" },
        ],
        performanceData: [
          { subject: "Math", marks: 85, maxMarks: 100 },
          { subject: "Physics", marks: 78, maxMarks: 100 },
          { subject: "Chemistry", marks: 92, maxMarks: 100 },
          { subject: "English", marks: 88, maxMarks: 100 },
          { subject: "Biology", marks: 82, maxMarks: 100 },
          { subject: "History", marks: 75, maxMarks: 100 },
        ],
        upcomingExams: [
          { subject: "Mathematics", date: "2024-03-25", type: "Mid-term" },
          { subject: "Physics", date: "2024-03-28", type: "Quiz" },
          { subject: "Chemistry", date: "2024-04-02", type: "Final" },
        ],
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (!hasAccess) {
    return null;
  }

  if (loading) {
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
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  Track your academic progress and stay on top of your studies.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Active Student</span>
                  </div>
                  <div className="text-sm text-blue-100">
                    Current Semester: Fall 2024
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <AcademicCapIcon className="w-16 h-16 text-blue-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Subjects"
            value={stats?.totalSubjects || 0}
            icon={BookOpenIcon}
            color="green"
            progress={75}
            subtitle="Enrolled courses"
            loading={loading}
          />
          <StatsCard
            title="Current GPA"
            value={stats?.currentGPA || "0.00"}
            icon={ChartBarIcon}
            trend={{ value: 0.15, isPositive: true }}
            color="blue"
            progress={86}
            subtitle="Out of 4.0"
            loading={loading}
          />
          <StatsCard
            title="Overall Grade"
            value={stats?.overallGrade || "N/A"}
            icon={TrophyIcon}
            color="yellow"
            progress={78}
            subtitle="Academic standing"
            loading={loading}
          />
          <StatsCard
            title="Attendance"
            value={`${stats?.attendanceRate || 0}%`}
            icon={CalendarIcon}
            trend={{ value: 2.5, isPositive: true }}
            color="purple"
            progress={stats?.attendanceRate || 0}
            subtitle="This semester"
            loading={loading}
          />
        </div>

        {/* Charts and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentPerformanceChart data={stats?.performanceData || []} />
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingExams exams={stats?.upcomingExams || []} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentGradesTable grades={stats?.recentGrades || []} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/student/results">
            <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  View All Results
                </h3>
                <p className="text-sm text-gray-600">
                  Check your complete academic record
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/student/courses">
            <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpenIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Course Materials
                </h3>
                <p className="text-sm text-gray-600">
                  Access study materials and resources
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/student/analytics">
            <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Progress Analytics
                </h3>
                <p className="text-sm text-gray-600">
                  Detailed performance insights
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
