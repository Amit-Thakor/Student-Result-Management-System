import React from "react";
import { motion } from "framer-motion";
import { formatDate, getGradeColor } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface Grade {
  subject: string;
  marks: number;
  grade: string;
  date: string;
}

interface RecentGradesTableProps {
  grades: Grade[];
}

export default function RecentGradesTable({ grades }: RecentGradesTableProps) {
  if (!grades || grades.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No recent grades</p>
        <p className="text-sm text-gray-400 mt-1">
          Your latest grades will appear here
        </p>
      </div>
    );
  }

  const getPerformanceIcon = (marks: number) => {
    if (marks >= 80) {
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    }
    return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
  };

  const getPerformanceColor = (marks: number) => {
    if (marks >= 90) return "text-green-600";
    if (marks >= 80) return "text-blue-600";
    if (marks >= 70) return "text-yellow-600";
    if (marks >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-4">
      {grades.map((grade, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300">
            {/* Subject Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                <span className="text-primary-700 font-bold text-lg">
                  {grade.subject.charAt(0)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                  {grade.subject}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {formatDate(grade.date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance & Grade */}
            <div className="flex items-center gap-6">
              {/* Marks */}
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {getPerformanceIcon(grade.marks)}
                  <span
                    className={`text-2xl font-bold ${getPerformanceColor(
                      grade.marks
                    )}`}
                  >
                    {grade.marks}
                  </span>
                  <span className="text-sm text-gray-500">%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-2">
                  <motion.div
                    className={`h-full rounded-full ${
                      grade.marks >= 90
                        ? "bg-green-500"
                        : grade.marks >= 80
                        ? "bg-blue-500"
                        : grade.marks >= 70
                        ? "bg-yellow-500"
                        : grade.marks >= 60
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${grade.marks}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Grade Badge */}
              <Badge
                variant="outline"
                className={`${getGradeColor(
                  grade.grade
                )} border-0 font-bold text-lg px-4 py-2`}
              >
                {grade.grade}
              </Badge>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <p className="text-2xl font-bold text-blue-600">
            {(
              grades.reduce((sum, g) => sum + g.marks, 0) / grades.length
            ).toFixed(1)}
          </p>
          <p className="text-sm text-blue-700 font-medium">Average Score</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <p className="text-2xl font-bold text-green-600">
            {Math.max(...grades.map((g) => g.marks))}
          </p>
          <p className="text-sm text-green-700 font-medium">Highest Score</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <p className="text-2xl font-bold text-purple-600">
            {grades.filter((g) => g.marks >= 80).length}
          </p>
          <p className="text-sm text-purple-700 font-medium">A Grades</p>
        </div>
      </div>
    </div>
  );
}
