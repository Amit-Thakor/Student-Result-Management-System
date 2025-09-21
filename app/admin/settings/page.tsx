"use client";

import React, { useState } from "react";
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  UserIcon,
  AcademicCapIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthGuard } from "@/lib/auth";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { hasAccess } = useAuthGuard("admin");
  const [loading, setLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    schoolName: "Student Result Management System",
    schoolAddress: "123 Education Street, Learning City",
    schoolPhone: "+1 (555) 123-4567",
    schoolEmail: "admin@school.edu",
    academicYear: "2024-2025",
    currentSemester: "Fall 2024",
  });

  const [gradeSettings, setGradeSettings] = useState({
    passingGrade: 40,
    maxMarks: 100,
    gradeScale: "A+, A, B+, B, C+, C, D, F",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    resultPublishNotification: true,
    attendanceAlerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    passwordMinLength: 8,
    requirePasswordChange: false,
    twoFactorAuth: false,
  });

  if (!hasAccess) {
    return null;
  }

  const handleSaveGeneral = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("General settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGrades = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Grade settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Security settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage system configuration and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="School Name"
                value={generalSettings.schoolName}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    schoolName: e.target.value,
                  }))
                }
              />
              <Input
                label="School Address"
                value={generalSettings.schoolAddress}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    schoolAddress: e.target.value,
                  }))
                }
              />
              <Input
                label="Phone Number"
                value={generalSettings.schoolPhone}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    schoolPhone: e.target.value,
                  }))
                }
              />
              <Input
                label="Email Address"
                type="email"
                value={generalSettings.schoolEmail}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    schoolEmail: e.target.value,
                  }))
                }
              />
              <Input
                label="Academic Year"
                value={generalSettings.academicYear}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    academicYear: e.target.value,
                  }))
                }
              />
              <Input
                label="Current Semester"
                value={generalSettings.currentSemester}
                onChange={(e) =>
                  setGeneralSettings((prev) => ({
                    ...prev,
                    currentSemester: e.target.value,
                  }))
                }
              />
              <Button
                onClick={handleSaveGeneral}
                loading={loading}
                className="w-full"
              >
                Save General Settings
              </Button>
            </CardContent>
          </Card>

          {/* Grade Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5" />
                Grade Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Passing Grade (%)"
                type="number"
                value={gradeSettings.passingGrade}
                onChange={(e) =>
                  setGradeSettings((prev) => ({
                    ...prev,
                    passingGrade: parseInt(e.target.value) || 0,
                  }))
                }
                min="0"
                max="100"
              />
              <Input
                label="Maximum Marks"
                type="number"
                value={gradeSettings.maxMarks}
                onChange={(e) =>
                  setGradeSettings((prev) => ({
                    ...prev,
                    maxMarks: parseInt(e.target.value) || 0,
                  }))
                }
                min="1"
              />
              <div>
                <label className="label block text-sm font-medium text-gray-700 mb-2">
                  Grade Scale
                </label>
                <textarea
                  value={gradeSettings.gradeScale}
                  onChange={(e) =>
                    setGradeSettings((prev) => ({
                      ...prev,
                      gradeScale: e.target.value,
                    }))
                  }
                  rows={3}
                  className="input w-full resize-none"
                  placeholder="Enter grade scale (e.g., A+, A, B+, B, C+, C, D, F)"
                />
              </div>
              <Button
                onClick={handleSaveGrades}
                loading={loading}
                className="w-full"
              >
                Save Grade Settings
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellIcon className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        emailNotifications: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    SMS Notifications
                  </label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        smsNotifications: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Result Publish Alerts
                  </label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.resultPublishNotification}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        resultPublishNotification: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Attendance Alerts
                  </label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.attendanceAlerts}
                    onChange={(e) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        attendanceAlerts: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveNotifications}
                loading={loading}
                className="w-full"
              >
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Session Timeout (minutes)"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    sessionTimeout: parseInt(e.target.value) || 0,
                  }))
                }
                min="5"
                max="120"
              />
              <Input
                label="Minimum Password Length"
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    passwordMinLength: parseInt(e.target.value) || 0,
                  }))
                }
                min="6"
                max="20"
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Require Password Change (90 days)
                  </label>
                  <input
                    type="checkbox"
                    checked={securitySettings.requirePasswordChange}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        requirePasswordChange: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Two-Factor Authentication
                  </label>
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        twoFactorAuth: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveSecurity}
                loading={loading}
                className="w-full"
              >
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
