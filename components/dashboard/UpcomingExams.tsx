import React from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface Exam {
  subject: string;
  date: string;
  type: string;
}

interface UpcomingExamsProps {
  exams: Exam[];
}

export default function UpcomingExams({ exams }: UpcomingExamsProps) {
  if (!exams || exams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No upcoming exams</p>
        <p className="text-sm text-gray-400 mt-1">
          Your exam schedule will appear here
        </p>
      </div>
    );
  }

  const getExamTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "final":
        return "bg-red-100 text-red-800 border-red-200";
      case "mid-term":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "quiz":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDaysUntil = (date: string) => {
    const examDate = new Date(date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: "Today", urgent: true };
    if (diffDays === 1) return { text: "Tomorrow", urgent: true };
    if (diffDays > 0)
      return { text: `${diffDays} days`, urgent: diffDays <= 3 };
    return { text: "Past", urgent: false };
  };

  const getExamIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "final":
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case "mid-term":
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case "quiz":
        return <BellIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <CalendarIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {exams.map((exam, index) => {
        const daysInfo = getDaysUntil(exam.date);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                daysInfo.urgent
                  ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:border-red-300 hover:shadow-md"
                  : "bg-gradient-to-r from-white to-gray-50 border-gray-100 hover:border-primary-200 hover:shadow-md"
              }`}
            >
              {/* Exam Info */}
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    daysInfo.urgent ? "bg-red-100" : "bg-primary-100"
                  }`}
                >
                  {getExamIcon(exam.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                    {exam.subject}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(exam.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exam Type & Countdown */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={`${getExamTypeColor(
                      exam.type
                    )} border font-semibold mb-2`}
                  >
                    {exam.type}
                  </Badge>

                  <div
                    className={`text-sm font-medium ${
                      daysInfo.urgent ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {daysInfo.urgent && (
                      <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                    )}
                    {daysInfo.text}
                  </div>
                </div>

                {/* Urgency Indicator */}
                {daysInfo.urgent && (
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Study Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <BellIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-blue-900">Study Reminder</p>
            <p className="text-sm text-blue-700">
              {exams.filter((e) => getDaysUntil(e.date).urgent).length > 0
                ? "You have urgent exams coming up! Start preparing now."
                : "Stay consistent with your study schedule."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
