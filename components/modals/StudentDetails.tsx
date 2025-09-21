import React from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Student } from "@/types";
import { formatDate, generateAvatar } from "@/lib/utils";

interface StudentDetailsProps {
  student: Student;
  onEdit: () => void;
  onClose: () => void;
}

export default function StudentDetails({
  student,
  onEdit,
  onClose,
}: StudentDetailsProps) {
  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | undefined;
  }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Avatar */}
      <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl">
        <div
          className={`w-16 h-16 rounded-full ${generateAvatar(
            student.name
          )} text-xl`}
        >
          {student.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
          <p className="text-primary-600 font-medium">{student.roll_number}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {student.class}
            </span>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                student.is_active
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {student.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <Button onClick={onEdit} size="sm">
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              icon={EnvelopeIcon}
              label="Email Address"
              value={student.email}
            />
            <InfoItem
              icon={PhoneIcon}
              label="Phone Number"
              value={student.phone}
            />
            <InfoItem
              icon={CalendarIcon}
              label="Date of Birth"
              value={
                student.date_of_birth
                  ? formatDate(student.date_of_birth, "long")
                  : undefined
              }
            />
            <InfoItem
              icon={AcademicCapIcon}
              label="Enrollment Date"
              value={
                student.enrollment_date
                  ? formatDate(student.enrollment_date, "long")
                  : formatDate(student.created_at, "long")
              }
            />
          </div>
          {student.address && (
            <div className="mt-4">
              <InfoItem
                icon={MapPinIcon}
                label="Address"
                value={student.address}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guardian Information */}
      {(student.guardian_name || student.guardian_phone) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={UserIcon}
                label="Guardian Name"
                value={student.guardian_name}
              />
              <InfoItem
                icon={PhoneIcon}
                label="Guardian Phone"
                value={student.guardian_phone}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Academic Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5" />
            Academic Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-blue-700">Total Subjects</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">0.00</p>
              <p className="text-sm text-green-700">Current GPA</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">N/A</p>
              <p className="text-sm text-purple-700">Overall Grade</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit}>
          <PencilIcon className="w-4 h-4 mr-2" />
          Edit Student
        </Button>
      </div>
    </div>
  );
}
