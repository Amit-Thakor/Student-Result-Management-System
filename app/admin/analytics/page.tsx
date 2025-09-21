"use client";

import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthGuard } from "@/lib/auth";
import StatsCard from "@/components/dashboard/StatsCard";
import EnhancedGradeChart from "@/components/dashboard/EnhancedGradeChart";
import StudentPerformanceChart from "@/components/dashboard/StudentPerformanceChart";

export default function AnalyticsPage() {
  const { hasAccess } = useAuthGuard("admin");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }
    fetchAnalyticsData();
  }, [hasAccess]);

  const fetchAnalyticsData = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAnalyticsData({
        performanceTrends: [
          { subject: "Mathematics", marks: 85, maxMarks: 100 },
          { subject: "Physics", marks: 78, maxMarks: 100 },
          { subject: "Chemistry", marks: 92, maxMarks: 100 },
          { subject: "English", marks: 88, maxMarks: 100 },
          { subject: "Biology", marks: 82, maxMarks: 100 },
        ],
        gradeDistribution: [
          { grade: "A+", count: 15, percentage: 25 },
          { grade: "A", count: 18, percentage: 30 },
          { grade: "B+", count: 12, percentage: 20 },
          { grade: "B", count: 10, percentage: 17 },
          { grade: "C+", count: 3, percentage: 5 },
          { grade: "C", count: 2, percentage: 3 },
        ],
        monthlyTrends: [
          { month: "Jan", average: 78, students: 45 },
          { month: "Feb", average: 82, students: 48 },
          { month: "Mar", average: 85, students: 52 },
          { month: "Apr", average: 83, students: 50 },
          { month: "May", average: 87, students: 55 },
          { month: "Jun", average: 89, students: 58 },
        ],
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasAccess) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Comprehensive performance analytics and insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Average Performance"
            value="84.2%"
            icon={ArrowTrendingUpIcon}
            trend={{ value: 5.2, isPositive: true }}
            color="green"
            progress={84}
            subtitle="Overall average"
            loading={loading}
          />
          <StatsCard
            title="Top Performers"
            value="15"
            icon={AcademicCapIcon}
            trend={{ value: 12, isPositive: true }}
            color="blue"
            progress={75}
            subtitle="A+ grade students"
            loading={loading}
          />
          <StatsCard
            title="Pass Rate"
            value="96.7%"
            icon={ChartBarIcon}
            trend={{ value: 2.1, isPositive: true }}
            color="purple"
            progress={97}
            subtitle="Students passing"
            loading={loading}
          />
          <StatsCard
            title="Active Students"
            value="58"
            icon={UsersIcon}
            trend={{ value: 8.3, isPositive: true }}
            color="indigo"
            progress={90}
            subtitle="Currently enrolled"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <EnhancedGradeChart
            data={analyticsData?.gradeDistribution || []}
            title="Grade Distribution Analysis"
            type="pie"
          />

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5" />
                Subject Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StudentPerformanceChart
                data={analyticsData?.performanceTrends || []}
              />
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {analyticsData?.monthlyTrends && (
                <div className="grid grid-cols-6 gap-4 h-full">
                  {analyticsData.monthlyTrends.map(
                    (month: any, index: number) => (
                      <div
                        key={month.month}
                        className="flex flex-col items-center justify-end"
                      >
                        <div className="text-center mb-2">
                          <p className="text-lg font-bold text-gray-900">
                            {month.average}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {month.students} students
                          </p>
                        </div>
                        <div
                          className="w-full bg-primary-500 rounded-t-lg transition-all duration-1000"
                          style={{
                            height: `${(month.average / 100) * 200}px`,
                            animationDelay: `${index * 100}ms`,
                          }}
                        />
                        <p className="text-sm font-medium text-gray-700 mt-2">
                          {month.month}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">
                      Excellent Progress
                    </p>
                    <p className="text-sm text-green-700">
                      Mathematics scores improved by 12%
                    </p>
                  </div>
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">
                      Strong Performance
                    </p>
                    <p className="text-sm text-blue-700">
                      Chemistry maintains high average
                    </p>
                  </div>
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-900">
                      Needs Attention
                    </p>
                    <p className="text-sm text-yellow-700">
                      Physics requires focus
                    </p>
                  </div>
                  <ChartBarIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Class Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["10-A", "10-B", "11-A", "11-B", "12-A"].map(
                  (className, index) => (
                    <div
                      key={className}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium text-gray-900">
                        {className}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${85 + index * 3}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {85 + index * 3}%
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">92%</p>
                  <p className="text-sm text-primary-700">Attendance Rate</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">4.2</p>
                  <p className="text-sm text-green-700">Average GPA</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">15</p>
                  <p className="text-sm text-purple-700">Honor Roll Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
