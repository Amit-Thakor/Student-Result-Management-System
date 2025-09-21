"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Student } from "@/types";
import { generateRollNumber, validateEmail, validatePhone } from "@/lib/utils";

interface StudentFormProps {
  student?: Student | null;
  onSubmit: (data: Partial<Student>) => void;
  onCancel: () => void;
}

export default function StudentForm({
  student,
  onSubmit,
  onCancel,
}: StudentFormProps) {
  const [formData, setFormData] = useState({
    roll_number: "",
    name: "",
    email: "",
    password: "",
    class: "",
    date_of_birth: "",
    phone: "",
    address: "",
    guardian_name: "",
    guardian_phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        roll_number: student.roll_number || "",
        name: student.name || "",
        email: student.email || "",
        password: "", // Don't populate password for editing
        class: student.class || "",
        date_of_birth: student.date_of_birth || "",
        phone: student.phone || "",
        address: student.address || "",
        guardian_name: student.guardian_name || "",
        guardian_phone: student.guardian_phone || "",
      });
    } else {
      // Generate roll number for new student
      setFormData((prev) => ({
        ...prev,
        roll_number: generateRollNumber(),
      }));
    }
  }, [student]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!student && !formData.password.trim()) {
      newErrors.password = "Password is required for new students";
    } else if (!student && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.class.trim()) {
      newErrors.class = "Class is required";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.guardian_phone && !validatePhone(formData.guardian_phone)) {
      newErrors.guardian_phone = "Please enter a valid guardian phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData: any = { ...formData };
      // Don't include password if it's empty (for updates)
      if (student && !submitData.password) {
        const { password, ...dataWithoutPassword } = submitData;
        await onSubmit(dataWithoutPassword);
      } else {
        await onSubmit(submitData);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Form submission error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Roll Number"
          name="roll_number"
          value={formData.roll_number}
          onChange={handleInputChange}
          error={errors.roll_number}
          disabled={!!student} // Disable editing roll number for existing students
          required
        />

        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder="Enter student's full name"
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder="student@school.edu"
          required
        />

        <Input
          label={
            student ? "New Password (leave blank to keep current)" : "Password"
          }
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          placeholder={
            student ? "Leave blank to keep current password" : "Enter password"
          }
          required={!student}
        />

        <Input
          label="Class"
          name="class"
          value={formData.class}
          onChange={handleInputChange}
          error={errors.class}
          placeholder="e.g., 10-A, 11-B"
          required
        />

        <Input
          label="Date of Birth"
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleInputChange}
          error={errors.date_of_birth}
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone}
          placeholder="123-456-7890"
        />

        <Input
          label="Guardian Name"
          name="guardian_name"
          value={formData.guardian_name}
          onChange={handleInputChange}
          error={errors.guardian_name}
          placeholder="Parent/Guardian name"
        />

        <Input
          label="Guardian Phone"
          type="tel"
          name="guardian_phone"
          value={formData.guardian_phone}
          onChange={handleInputChange}
          error={errors.guardian_phone}
          placeholder="123-456-7890"
        />
      </div>

      <div className="col-span-2">
        <label className="label block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          className="input w-full resize-none"
          placeholder="Enter complete address"
        />
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-gray-400 text-gray-800 hover:from-gray-300 hover:to-gray-400 hover:border-gray-500 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {student ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>
  );
}
