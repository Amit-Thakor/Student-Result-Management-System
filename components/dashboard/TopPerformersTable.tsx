import React from "react";
import {
  TrophyIcon,
  StarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { getGradeColor } from "@/lib/utils";

interface TopPerformer {
  name: string;
  roll_number: string;
  average_marks: number;
  grade: string;
}

interface TopPerformersTableProps {
  performers: TopPerformer[];
}

export default function TopPerformersTable({
  performers,
}: TopPerformersTableProps) {
  if (!performers || performers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrophyIcon className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No top performers yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Results will appear here once students are graded
        </p>
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <TrophyIcon className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <StarIcon className="w-5 h-5 text-gray-400" />;
      case 2:
        return <AcademicCapIcon className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-bold text-primary-700">
            {index + 1}
          </span>
        );
    }
  };

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-400";
      case 2:
        return "bg-gradient-to-r from-amber-400 to-amber-500";
      default:
        return "bg-gradient-to-r from-primary-400 to-primary-500";
    }
  };

  return (
    <div className="space-y-3">
      {performers.slice(0, 5).map((performer, index) => (
        <motion.div
          key={performer.roll_number}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="group"
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${getRankBadgeColor(
                  index
                )}`}
              >
                {getRankIcon(index)}
              </div>

              {/* Student Avatar */}
              <Avatar
                name={performer.name}
                size="md"
                className="ring-2 ring-white shadow-sm"
              />

              {/* Student Info */}
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                  {performer.name}
                </p>
                <p className="text-sm text-gray-500">{performer.roll_number}</p>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl font-bold text-gray-900">
                  {performer.average_marks.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">%</div>
              </div>

              <Badge
                variant="outline"
                className={`${getGradeColor(
                  performer.grade
                )} border-0 font-semibold`}
              >
                Grade {performer.grade}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 ml-14">
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${performer.average_marks}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
