"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import LandingPage from "@/components/LandingPage";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      // Redirect to appropriate dashboard based on role
      if (user?.role === "admin") {
        router.push("/admin");
      } else if (user?.role === "student") {
        router.push("/student");
      }
    }
  }, [isAuthenticated, user, router]);

  // Show landing page if not authenticated
  if (!isAuthenticated()) {
    return <LandingPage />;
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
