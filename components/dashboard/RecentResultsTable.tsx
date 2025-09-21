import React from "react";
import { motion } from "framer-motion";
import { formatDate, getGradeColor } from "@/lib/utils";
import { Result } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { CalendarIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

interface RecentResultsTableProps {
  results: Result[];
}

export default function RecentResultsTable({
  results,
}: RecentResultsTableProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AcademicCapIcon className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No recent results</p>
        <p className="text-sm text-gray-400 mt-1">
          Results will appear here once students are graded
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.slice(0, 10).map((result, index) => (
        <motion.div
          key={result.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group"
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300">
            {/* Student Info */}
            <div className="flex items-center gap-4 flex-1">
              <Avatar
                name={result.student_name || "Unknown"}
                size="md"
                className="ring-2 ring-white shadow-sm"
              />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                  {result.student_name}
                </p>
                <p className="text-sm text-gray-500">{result.roll_number}</p>
              </div>
            </div>

            {/* Course Info */}
            <div className="hidden md:block flex-1 px-4">
              <p className="font-medium text-gray-900 truncate">
                {result.course_name}
              </p>
              <p className="text-sm text-gray-500">{result.course_code}</p>
            </div>

            {/* Marks & Grade */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {result.marks}
                  </span>
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <Badge
                  variant="outline"
                  className={`${getGradeColor(
                    result.grade
                  )} border-0 font-semibold mt-1`}
                >
                  {result.grade}
                </Badge>
              </div>

              {/* Date */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 min-w-0">
                <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{formatDate(result.exam_date)}</span>
              </div>
            </div>
          </div>

          {/* Mobile Course Info */}
          <div className="md:hidden mt-2 ml-16 text-sm text-gray-600">
            <span className="font-medium">{result.course_name}</span>
            <span className="mx-2">•</span>
            <span>{result.course_code}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(result.exam_date)}</span>
          </div>
        </motion.div>
      ))}

      {results.length > 10 && (
        <div className="text-center pt-4">
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors">
            View all {results.length} results →
          </button>
        </div>
      )}
    </div>
  );
}
