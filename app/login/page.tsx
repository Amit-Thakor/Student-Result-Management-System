"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AcademicCapIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BackendStatus } from "@/components/ui/BackendStatus";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";
import swal from "@/lib/sweetAlert";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      if (user?.role === "admin") {
        router.push("/admin");
      } else if (user?.role === "student") {
        router.push("/student");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Login Form Submitted");
    console.log("📝 Form Data:", formData);

    if (!formData.email || !formData.password) {
      console.log("⚠️ Missing form data");
      await swal.warning(
        "Missing Information",
        "Please fill in all fields to continue."
      );
      return;
    }

    setLoading(true);
    swal.loading(
      "Signing you in...",
      "Please wait while we verify your credentials."
    );

    try {
      // First, test backend connection
      console.log("🔗 Testing backend connection...");
      try {
        const testResponse = await fetch('http://localhost:8000');
        if (!testResponse.ok) {
          throw new Error(`Backend not responding: ${testResponse.status}`);
        }
        console.log("✅ Backend connection successful");
      } catch (connectionError) {
        console.error("❌ Backend connection failed:", connectionError);
        await swal.error(
          "Connection Error",
          "Cannot connect to the backend server. Please ensure the PHP backend is running on http://localhost:8000. You can start it by running 'start-servers.bat' or manually with 'cd backend && php -S localhost:8000'."
        );
        setLoading(false);
        return;
      }

      const success = await login(formData.email, formData.password);

      if (success) {
        await swal.success(
          "Welcome Back! 🎉",
          "You have been successfully signed in."
        );
        // Redirect will happen via useEffect
      } else {
        await swal.error(
          "Login Failed",
          "Invalid email or password. Please use the demo credentials below or check your credentials and try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      await swal.error(
        "Login Failed",
        "Unable to sign in. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(`📝 Input changed: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const demoCredentials = [
    { role: "Admin", email: "admin@school.edu", password: "password" },
    { role: "Student", email: "john.smith@student.edu", password: "password" },
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    console.log(`🎯 Filling demo credentials: ${email}`);
    setFormData({ email, password });
    // Also update the actual input fields
    const emailInput = document.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    const passwordInput = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;
    if (emailInput) emailInput.value = email;
    if (passwordInput) passwordInput.value = password;
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Reset Password',
      text: 'Enter your email address to receive password reset instructions',
      input: 'email',
      inputPlaceholder: 'Enter your email address',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#6b7280',
      inputValidator: (value: string) => {
        if (!value) {
          return 'Please enter your email address';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return null;
      }
    });

    if (email) {
      await swal.success(
        'Reset Link Sent! 📧',
        `Password reset instructions have been sent to ${email}. Please check your inbox and follow the instructions to reset your password.`
      );
    }
  };

  const handleContactSupport = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Contact Support',
      text: 'Need help? Send us a message and we\'ll get back to you soon!',
      showCancelButton: true,
      confirmButtonText: 'Send Message',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#6b7280',
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input id="swal-input1" class="swal2-input" placeholder="Enter your name" style="margin: 0; width: 100%;">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input id="swal-input2" class="swal2-input" type="email" placeholder="Enter your email" style="margin: 0; width: 100%;">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select id="swal-input3" class="swal2-select" style="margin: 0; width: 100%;">
              <option value="">Select a topic</option>
              <option value="login-issues">Login Issues</option>
              <option value="account-access">Account Access</option>
              <option value="technical-support">Technical Support</option>
              <option value="general-inquiry">General Inquiry</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea id="swal-input4" class="swal2-textarea" placeholder="Describe your issue or question..." style="margin: 0; width: 100%; min-height: 100px;"></textarea>
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement)?.value;
        const email = (document.getElementById('swal-input2') as HTMLInputElement)?.value;
        const subject = (document.getElementById('swal-input3') as HTMLSelectElement)?.value;
        const message = (document.getElementById('swal-input4') as HTMLTextAreaElement)?.value;
        
        if (!name || !email || !subject || !message) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          Swal.showValidationMessage('Please enter a valid email address');
          return false;
        }
        
        return { name, email, subject, message };
      }
    });

    if (formValues) {
      await swal.success(
        'Message Sent! 🎉',
        `Thank you ${formValues.name}! Your message has been sent to our support team. We'll get back to you at ${formValues.email} within 24 hours.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </Link>
          <ThemeToggle />
        </div>

        <Card className="shadow-large dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome Back
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Sign in to your Student Result Management System account
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading || isLoading}
                disabled={loading || isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-2">
                Demo Credentials (Click to auto-fill)
              </p>
              <div className="flex justify-center mb-4">
                <BackendStatus />
              </div>
              <div className="space-y-2">
                {demoCredentials.map((cred, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      fillDemoCredentials(cred.email, cred.password);
                    }}
                    className="w-full p-3 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 dark:border-blue-700 dark:hover:border-blue-600 hover:shadow-md"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {cred.role} Account
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {cred.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Password: {cred.password}
                        </p>
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                        Click to fill
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Help Links */}
            <div className="mt-6 text-center space-y-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary-600 hover:text-primary-700 block w-full transition-colors duration-200 hover:underline"
              >
                Forgot your password?
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  Register here
                </Link>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Need help?{" "}
                <button
                  type="button"
                  onClick={handleContactSupport}
                  className="text-primary-600 hover:text-primary-700 transition-colors duration-200 hover:underline"
                >
                  Contact Support
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Student Result Management System v1.0</p>
          <p className="mt-1">Secure • Reliable • Modern</p>
        </div>
      </div>
    </div>
  );
}
