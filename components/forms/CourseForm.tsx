"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Course } from "@/types";

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (data: Partial<Course>) => void;
  onCancel: () => void;
}

export default function CourseForm({
  course,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [formData, setFormData] = useState({
    course_name: "",
    course_code: "",
    description: "",
    credits: 3,
    semester: "",
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        course_name: course.course_name || "",
        course_code: course.course_code || "",
        description: course.description || "",
        credits: course.credits || 3,
        semester: course.semester || "",
        is_active: course.is_active ?? true,
      });
    }
  }, [course]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseInt(value) || 0
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
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

    if (!formData.course_name.trim()) {
      newErrors.course_name = "Course name is required";
    }

    if (!formData.course_code.trim()) {
      newErrors.course_code = "Course code is required";
    }

    if (!formData.semester.trim()) {
      newErrors.semester = "Semester is required";
    }

    if (formData.credits < 1 || formData.credits > 10) {
      newErrors.credits = "Credits must be between 1 and 10";
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
      if (process.env.NODE_ENV === "development") {
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Course Code"
          name="course_code"
          value={formData.course_code}
          onChange={handleInputChange}
          error={errors.course_code}
          placeholder="e.g., MATH101, PHY201"
          required
        />

        <Input
          label="Course Name"
          name="course_name"
          value={formData.course_name}
          onChange={handleInputChange}
          error={errors.course_name}
          placeholder="e.g., Introduction to Mathematics"
          required
        />

        <Input
          label="Credits"
          type="number"
          name="credits"
          value={formData.credits}
          onChange={handleInputChange}
          error={errors.credits}
          min="1"
          max="10"
          required
        />

        <Input
          label="Semester"
          name="semester"
          value={formData.semester}
          onChange={handleInputChange}
          error={errors.semester}
          placeholder="e.g., Fall 2024, Spring 2025"
          required
        />
      </div>

      <div>
        <label className="label block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="input w-full resize-none"
          placeholder="Enter course description..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleInputChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Active Course
        </label>
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
          {course ? "Update Course" : "Add Course"}
        </Button>
      </div>
    </form>
  );
}
