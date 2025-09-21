"use client";

import React, { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  PencilIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { useAuthGuard } from "@/lib/auth";
import { StudentProfile } from "@/types";
import { formatDate, generateAvatar } from "@/lib/utils";
import StudentProfileForm from "@/components/forms/StudentProfileForm";
import toast from "react-hot-toast";

export default function StudentProfilePage() {
  const { hasAccess, user } = useAuthGuard("student");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }
    fetchProfile();
  }, [hasAccess]);

  const fetchProfile = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile({
        id: "2",
        roll_number: "2024001",
        name: "John Smith",
        email: "john.smith@student.edu",
        class: "10-A",
        date_of_birth: "2006-05-15",
        phone: "123-456-7890",
        address: "123 Main Street, City, State 12345",
        guardian_name: "Robert Smith",
        guardian_phone: "123-456-7891",
        enrollment_date: "2024-01-15",
        is_active: true,
        created_at: "2024-01-15T00:00:00Z",
        results: [],
        gpa: 3.45,
        totalSubjects: 6,
        averageMarks: 82.5,
        overallGrade: "B+",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: Partial<StudentProfile>) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfile((prev) => (prev ? { ...prev, ...data } : null));
      setShowEditForm(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | undefined;
  }) => (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  if (!hasAccess) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Profile not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">
              View and manage your personal information
            </p>
          </div>
          <Button onClick={() => setShowEditForm(true)}>
            <PencilIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div
                  className={`w-24 h-24 rounded-full ${generateAvatar(
                    profile.name
                  )} text-2xl`}
                >
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <CameraIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-primary-600 font-medium text-lg">
                  {profile.roll_number}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    Class {profile.class}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      profile.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {profile.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current GPA</p>
                <p className="text-3xl font-bold text-primary-600">
                  {profile.gpa}
                </p>
                <p className="text-sm text-gray-600">
                  Grade: {profile.overallGrade}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {profile.totalSubjects}
              </p>
              <p className="text-sm text-gray-600">Total Subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {profile.averageMarks}%
              </p>
              <p className="text-sm text-gray-600">Average Marks</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {profile.overallGrade}
              </p>
              <p className="text-sm text-gray-600">Overall Grade</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                icon={EnvelopeIcon}
                label="Email Address"
                value={profile.email}
              />
              <InfoItem
                icon={PhoneIcon}
                label="Phone Number"
                value={profile.phone}
              />
              <InfoItem
                icon={CalendarIcon}
                label="Date of Birth"
                value={
                  profile.date_of_birth
                    ? formatDate(profile.date_of_birth, "long")
                    : undefined
                }
              />
              <InfoItem
                icon={MapPinIcon}
                label="Address"
                value={profile.address}
              />
            </CardContent>
          </Card>

          {/* Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Guardian Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem
                icon={UserIcon}
                label="Guardian Name"
                value={profile.guardian_name}
              />
              <InfoItem
                icon={PhoneIcon}
                label="Guardian Phone"
                value={profile.guardian_phone}
              />
              <InfoItem
                icon={CalendarIcon}
                label="Enrollment Date"
                value={
                  profile.enrollment_date
                    ? formatDate(profile.enrollment_date, "long")
                    : undefined
                }
              />
              <InfoItem
                icon={AcademicCapIcon}
                label="Student ID"
                value={profile.roll_number}
              />
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
          title="Edit Profile"
          size="lg"
        >
          <StudentProfileForm
            profile={profile}
            onSubmit={handleUpdateProfile}
            onCancel={() => setShowEditForm(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
