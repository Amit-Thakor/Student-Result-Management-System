"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Result, Student, Course } from "@/types";
import { formatGrade } from "@/lib/utils";

interface ResultFormProps {
  result?: Result | null;
  students: Student[];
  courses: Course[];
  onSubmit: (data: Partial<Result>) => void;
  onCancel: () => void;
}

export default function ResultForm({
  result,
  students,
  courses,
  onSubmit,
  onCancel,
}: ResultFormProps) {
  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    marks: 0,
    exam_date: "",
    exam_type: "Final Exam",
    remarks: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [calculatedGrade, setCalculatedGrade] = useState("");

  useEffect(() => {
    if (result) {
      setFormData({
        student_id: result.student_id || "",
        course_id: result.course_id || "",
        marks: result.marks || 0,
        exam_date: result.exam_date || "",
        exam_type: result.exam_type || "Final Exam",
        remarks: result.remarks || "",
      });
    }
  }, [result]);

  useEffect(() => {
    // Calculate grade when marks change
    if (formData.marks >= 0 && formData.marks <= 100) {
      setCalculatedGrade(formatGrade(formData.marks));
    } else {
      setCalculatedGrade("");
    }
  }, [formData.marks]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
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

    if (!formData.student_id) {
      newErrors.student_id = "Please select a student";
    }

    if (!formData.course_id) {
      newErrors.course_id = "Please select a course";
    }

    if (formData.marks < 0 || formData.marks > 100) {
      newErrors.marks = "Marks must be between 0 and 100";
    }

    if (!formData.exam_date) {
      newErrors.exam_date = "Exam date is required";
    }

    if (!formData.exam_type.trim()) {
      newErrors.exam_type = "Exam type is required";
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
      const submitData = {
        ...formData,
        grade: calculatedGrade,
        percentage: formData.marks,
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const examTypes = [
    "Final Exam",
    "Mid-term Exam",
    "Quiz",
    "Assignment",
    "Project",
    "Practical",
    "Viva",
    "Other",
  ];

  const selectedStudent = students.find((s) => s.id === formData.student_id);
  const selectedCourse = courses.find((c) => c.id === formData.course_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="label block text-sm font-medium text-gray-700 mb-2">
            Student *
          </label>
          <select
            name="student_id"
            value={formData.student_id}
            onChange={handleInputChange}
            className="input w-full"
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.roll_number})
              </option>
            ))}
          </select>
          {errors.student_id && (
            <p className="error-text mt-1">{errors.student_id}</p>
          )}
        </div>

        <div>
          <label className="label block text-sm font-medium text-gray-700 mb-2">
            Course *
          </label>
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleInputChange}
            className="input w-full"
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name} ({course.course_code})
              </option>
            ))}
          </select>
          {errors.course_id && (
            <p className="error-text mt-1">{errors.course_id}</p>
          )}
        </div>

        <Input
          label="Marks"
          type="number"
          name="marks"
          value={formData.marks}
          onChange={handleInputChange}
          error={errors.marks}
          min="0"
          max="100"
          step="0.01"
          required
          helperText={calculatedGrade ? `Grade: ${calculatedGrade}` : ""}
        />

        <Input
          label="Exam Date"
          type="date"
          name="exam_date"
          value={formData.exam_date}
          onChange={handleInputChange}
          error={errors.exam_date}
          required
        />

        <div>
          <label className="label block text-sm font-medium text-gray-700 mb-2">
            Exam Type *
          </label>
          <select
            name="exam_type"
            value={formData.exam_type}
            onChange={handleInputChange}
            className="input w-full"
            required
          >
            {examTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.exam_type && (
            <p className="error-text mt-1">{errors.exam_type}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="label block text-sm font-medium text-gray-700 mb-2">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            rows={3}
            className="input w-full resize-none"
            placeholder="Optional remarks about the result..."
          />
        </div>
      </div>

      {/* Preview Section */}
      {(selectedStudent || selectedCourse || calculatedGrade) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Result Preview</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {selectedStudent && (
              <div>
                <p className="text-gray-600">Student</p>
                <p className="font-medium">{selectedStudent.name}</p>
                <p className="text-gray-500">{selectedStudent.roll_number}</p>
              </div>
            )}
            {selectedCourse && (
              <div>
                <p className="text-gray-600">Course</p>
                <p className="font-medium">{selectedCourse.course_name}</p>
                <p className="text-gray-500">{selectedCourse.course_code}</p>
              </div>
            )}
            {calculatedGrade && (
              <div>
                <p className="text-gray-600">Grade</p>
                <p className="font-medium text-lg">{calculatedGrade}</p>
                <p className="text-gray-500">{formData.marks}%</p>
              </div>
            )}
          </div>
        </div>
      )}

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
          {result ? "Update Result" : "Add Result"}
        </Button>
      </div>
    </form>
  );
}
