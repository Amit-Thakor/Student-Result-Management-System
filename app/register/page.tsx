"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { validateEmail, validatePhone } from "@/lib/utils";
import api from "@/lib/api";
import toast from "react-hot-toast";
import swal from "@/lib/sweetAlert";

type UserRole = "student" | "parent";

export default function RegisterPage() {
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    // Student specific
    rollNumber: "",
    class: "",
    dateOfBirth: "",
    // Parent specific
    studentRollNumber: "",
    relationship: "father",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    // Common validations
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Student specific validations
    if (userRole === "student") {
      if (!formData.rollNumber.trim()) {
        newErrors.rollNumber = "Roll number is required";
      }
      if (!formData.class.trim()) {
        newErrors.class = "Class is required";
      }
    }

    // Parent specific validations
    if (userRole === "parent") {
      if (!formData.studentRollNumber.trim()) {
        newErrors.studentRollNumber = "Student roll number is required";
      }
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }
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
      swal.loading(
        "Creating your account...",
        "Please wait while we process your registration."
      );

      const registrationData = {
        ...formData,
        role: userRole,
      };

      const response = await api.auth.register(registrationData);

      if (response.success) {
        await swal.success(
          "Registration Successful! 🎉",
          `Your ${
            userRole === "student" ? "student" : "parent"
          } account has been created successfully. Please wait for admin approval before you can sign in.`
        );

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          rollNumber: "",
          class: "",
          dateOfBirth: "",
          studentRollNumber: "",
          relationship: "father",
          address: "",
        });
      } else {
        await swal.error(
          "Registration Failed",
          "Unable to create your account. Please try again."
        );
      }
    } catch (error) {
      await swal.error(
        "Registration Failed",
        "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Login
          </Link>
          <ThemeToggle />
        </div>

        <Card className="shadow-large">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Register for Student Result Management System
            </p>
          </CardHeader>

          <CardContent>
            {/* Role Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserRole("student")}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    userRole === "student"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <UserIcon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Student</div>
                  <div className="text-xs text-gray-500">
                    Register as a student
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("parent")}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    userRole === "parent"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <UserGroupIcon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Parent</div>
                  <div className="text-xs text-gray-500">
                    Register as a parent
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Input
                label="Phone Number (Optional)"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                placeholder="123-456-7890"
              />

              {/* Student Specific Fields */}
              {userRole === "student" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Roll Number"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      error={errors.rollNumber}
                      placeholder="e.g., 2024001"
                      required
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
                  </div>

                  <Input
                    label="Date of Birth (Optional)"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    error={errors.dateOfBirth}
                  />
                </>
              )}

              {/* Parent Specific Fields */}
              {userRole === "parent" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Student Roll Number"
                      name="studentRollNumber"
                      value={formData.studentRollNumber}
                      onChange={handleInputChange}
                      error={errors.studentRollNumber}
                      placeholder="Your child's roll number"
                      required
                    />

                    <div>
                      <label className="label block text-sm font-medium text-gray-700 mb-2">
                        Relationship <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white text-gray-900 font-medium shadow-sm hover:border-gray-400"
                        required
                      >
                        <option value="father" className="py-2">
                          👨‍👦 Father
                        </option>
                        <option value="mother" className="py-2">
                          👩‍👧 Mother
                        </option>
                        <option value="guardian" className="py-2">
                          👤 Guardian
                        </option>
                      </select>
                      {errors.relationship && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.relationship}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange(e as any)}
                      rows={3}
                      className="input w-full resize-none"
                      placeholder="Enter your complete address"
                      required
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
                disabled={loading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Your registration will be reviewed by the
                admin. You will receive an email notification once your account
                is approved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
