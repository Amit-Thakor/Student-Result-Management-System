"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StudentProfile } from "@/types";
import { validateEmail, validatePhone } from "@/lib/utils";

interface StudentProfileFormProps {
  profile: StudentProfile;
  onSubmit: (data: Partial<StudentProfile>) => void;
  onCancel: () => void;
}

export default function StudentProfileForm({
  profile,
  onSubmit,
  onCancel,
}: StudentProfileFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    guardian_name: "",
    guardian_phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        guardian_name: profile.guardian_name || "",
        guardian_phone: profile.guardian_phone || "",
      });
    }
  }, [profile]);

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
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          placeholder="Enter your full name"
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          placeholder="your.email@student.edu"
          required
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

      <div>
        <label className="label block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          className="input w-full resize-none"
          placeholder="Enter your complete address"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Note</h4>
        <p className="text-sm text-blue-700">
          Some information like roll number, class, and date of birth cannot be
          changed. Please contact the administration if you need to update these
          details.
        </p>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading} disabled={loading}>
          Update Profile
        </Button>
      </div>
    </form>
  );
}
