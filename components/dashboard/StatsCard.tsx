import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?:
    | "blue"
    | "green"
    | "purple"
    | "yellow"
    | "red"
    | "indigo"
    | "teal"
    | "orange";
  progress?: number;
  subtitle?: string;
  loading?: boolean;
}

const colorClasses = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    icon: "text-blue-600",
    trend: "text-blue-600",
    accent: "bg-blue-500",
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    icon: "text-green-600",
    trend: "text-green-600",
    accent: "bg-green-500",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100",
    icon: "text-purple-600",
    trend: "text-purple-600",
    accent: "bg-purple-500",
  },
  yellow: {
    bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
    icon: "text-yellow-600",
    trend: "text-yellow-600",
    accent: "bg-yellow-500",
  },
  red: {
    bg: "bg-gradient-to-br from-red-50 to-red-100",
    icon: "text-red-600",
    trend: "text-red-600",
    accent: "bg-red-500",
  },
  indigo: {
    bg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    icon: "text-indigo-600",
    trend: "text-indigo-600",
    accent: "bg-indigo-500",
  },
  teal: {
    bg: "bg-gradient-to-br from-teal-50 to-teal-100",
    icon: "text-teal-600",
    trend: "text-teal-600",
    accent: "bg-teal-500",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100",
    icon: "text-orange-600",
    trend: "text-orange-600",
    accent: "bg-orange-500",
  },
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
  progress,
  subtitle,
  loading = false,
}: StatsCardProps) {
  // Ensure we have a valid color, fallback to blue if not found
  const colors = colorClasses[color] || colorClasses.blue;

  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
            {progress !== undefined && (
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        {/* Accent bar */}
        <div
          className={cn("absolute top-0 left-0 right-0 h-1", colors.accent)}
        />

        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <motion.p
                className="text-3xl font-bold text-gray-900 mb-1"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {value}
              </motion.p>

              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}

              {trend && (
                <motion.div
                  className="flex items-center mt-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {trend.isPositive ? (
                    <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      trend.isPositive ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last month
                  </span>
                </motion.div>
              )}
            </div>

            <motion.div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center relative",
                colors.bg
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className={cn("w-7 h-7", colors.icon)} />

              {/* Pulse effect */}
              <div
                className={cn(
                  "absolute inset-0 rounded-xl opacity-20 animate-pulse",
                  colors.accent
                )}
              />
            </motion.div>
          </div>

          {progress !== undefined && (
            <motion.div
              className="mt-4"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Progress value={progress} className="h-2" />
            </motion.div>
          )}
        </CardContent>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
      </Card>
    </motion.div>
  );
}
