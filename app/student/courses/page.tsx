"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpenIcon,
  DocumentTextIcon,
  PlayIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuthGuard } from "@/lib/auth";

interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson: string;
  materials: Material[];
  status: "active" | "completed" | "upcoming";
  rating: number;
  credits: number;
}

interface Material {
  id: string;
  title: string;
  type: "pdf" | "video" | "document" | "link";
  size?: string;
  duration?: string;
  downloadUrl: string;
}

export default function StudentCourses() {
  const { hasAccess, user } = useAuthGuard("student");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!hasAccess) {
      window.location.href = "/login";
      return;
    }

    fetchCourses();
  }, [hasAccess]);

  const fetchCourses = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockCourses: Course[] = [
        {
          id: "1",
          name: "Advanced Mathematics",
          code: "MATH301",
          instructor: "Dr. Sarah Johnson",
          description: "Comprehensive study of calculus, linear algebra, and differential equations.",
          progress: 75,
          totalLessons: 24,
          completedLessons: 18,
          nextLesson: "Integration by Parts",
          status: "active",
          rating: 4.8,
          credits: 4,
          materials: [
            { id: "1", title: "Calculus Textbook Chapter 5", type: "pdf", size: "2.3 MB", downloadUrl: "#" },
            { id: "2", title: "Integration Techniques Video", type: "video", duration: "45 min", downloadUrl: "#" },
            { id: "3", title: "Practice Problems Set 3", type: "document", size: "1.1 MB", downloadUrl: "#" },
          ],
        },
        {
          id: "2",
          name: "Physics Laboratory",
          code: "PHYS201",
          instructor: "Prof. Michael Chen",
          description: "Hands-on experiments covering mechanics, thermodynamics, and electromagnetism.",
          progress: 60,
          totalLessons: 16,
          completedLessons: 10,
          nextLesson: "Electromagnetic Induction Lab",
          status: "active",
          rating: 4.6,
          credits: 3,
          materials: [
            { id: "4", title: "Lab Manual", type: "pdf", size: "5.2 MB", downloadUrl: "#" },
            { id: "5", title: "Safety Guidelines", type: "document", size: "800 KB", downloadUrl: "#" },
            { id: "6", title: "Equipment Demo Video", type: "video", duration: "30 min", downloadUrl: "#" },
          ],
        },
        {
          id: "3",
          name: "Organic Chemistry",
          code: "CHEM302",
          instructor: "Dr. Emily Rodriguez",
          description: "Study of carbon-based compounds, reactions, and mechanisms.",
          progress: 85,
          totalLessons: 20,
          completedLessons: 17,
          nextLesson: "Aromatic Compounds",
          status: "active",
          rating: 4.9,
          credits: 4,
          materials: [
            { id: "7", title: "Organic Chemistry Textbook", type: "pdf", size: "8.7 MB", downloadUrl: "#" },
            { id: "8", title: "Reaction Mechanisms Guide", type: "document", size: "3.2 MB", downloadUrl: "#" },
            { id: "9", title: "3D Molecular Models", type: "link", downloadUrl: "#" },
          ],
        },
        {
          id: "4",
          name: "English Literature",
          code: "ENG201",
          instructor: "Prof. James Wilson",
          description: "Analysis of classic and contemporary literary works.",
          progress: 40,
          totalLessons: 18,
          completedLessons: 7,
          nextLesson: "Shakespeare's Hamlet",
          status: "active",
          rating: 4.4,
          credits: 3,
          materials: [
            { id: "10", title: "Reading List", type: "document", size: "500 KB", downloadUrl: "#" },
            { id: "11", title: "Literary Analysis Guide", type: "pdf", size: "1.8 MB", downloadUrl: "#" },
            { id: "12", title: "Author Biography Videos", type: "video", duration: "2 hours", downloadUrl: "#" },
          ],
        },
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Course["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: Material["type"]) => {
    switch (type) {
      case "pdf":
        return <DocumentTextIcon className="w-4 h-4" />;
      case "video":
        return <PlayIcon className="w-4 h-4" />;
      case "document":
        return <DocumentTextIcon className="w-4 h-4" />;
      case "link":
        return <BookOpenIcon className="w-4 h-4" />;
      default:
        return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  if (!hasAccess) {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 mt-2">
              Access your enrolled courses and study materials
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              {courses.length} Active Courses
            </Badge>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500">{course.code}</span>
                    </div>
                    <CardTitle className="text-xl mb-2">{course.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <UserGroupIcon className="w-4 h-4" />
                        {course.instructor}
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {course.rating}
                      </div>
                      <div>{course.credits} Credits</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    <span>Next: {course.nextLesson}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1">
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button variant="outline" size="sm">
                    <BookOpenIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Course Materials Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                    <p className="text-gray-600">{selectedCourse.code}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCourse(null)}
                  >
                    ×
                  </Button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Course Materials</h3>
                <div className="space-y-3">
                  {selectedCourse.materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon(material.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{material.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            {material.size && (
                              <span className="flex items-center gap-1">
                                <DocumentTextIcon className="w-3 h-3" />
                                {material.size}
                              </span>
                            )}
                            {material.duration && (
                              <span className="flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                {material.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
