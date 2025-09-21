"use client";

import React, { useEffect, useState } from "react";
import {
  UserGroupIcon,
  BookOpenIcon,
  ChartBarIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuthGuard } from "@/lib/auth";
import api from "@/lib/api";
import { DashboardStats } from "@/types";
import StatsCard from "@/components/dashboard/StatsCard";
import EnhancedGradeChart from "@/components/dashboard/EnhancedGradeChart";
import TopPerformersTable from "@/components/dashboard/TopPerformersTable";
import RecentResultsTable from "@/components/dashboard/RecentResultsTable";

export default function AdminDashboard() {
  const { hasAccess } = useAuthGuard("admin");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }

    fetchDashboardStats();
  }, [hasAccess]);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.dashboard.getStats();
      if (response.success) {
        if (response.data) {
          setStats(response.data);
        }
      }
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
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Welcome to Admin Dashboard
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  Manage students, courses, and track academic performance
                  across your institution.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">System Online</span>
                  </div>
                  <div className="text-sm text-blue-100">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <TrophyIcon className="w-16 h-16 text-yellow-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={UserGroupIcon}
            trend={{ value: 12, isPositive: true }}
            color="indigo"
            progress={85}
            subtitle="Active enrollments"
            loading={loading}
          />
          <StatsCard
            title="Total Courses"
            value={stats?.totalCourses || 0}
            icon={BookOpenIcon}
            trend={{ value: 3, isPositive: true }}
            color="teal"
            progress={92}
            subtitle="Available courses"
            loading={loading}
          />
          <StatsCard
            title="Total Results"
            value={stats?.totalResults || 0}
            icon={ChartBarIcon}
            trend={{ value: 8, isPositive: true }}
            color="orange"
            progress={78}
            subtitle="Recorded results"
            loading={loading}
          />
          <StatsCard
            title="Pass Rate"
            value={`${stats?.passRate || 0}%`}
            icon={TrophyIcon}
            trend={{ value: 5.2, isPositive: true }}
            color="green"
            progress={stats?.passRate || 0}
            subtitle="Overall performance"
            loading={loading}
          />
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <EnhancedGradeChart
            data={stats?.gradeDistribution || []}
            title="Grade Distribution Overview"
            type="pie"
          />

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <TopPerformersTable performers={stats?.topPerformers || []} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentResultsTable results={stats?.recentResults || []} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
