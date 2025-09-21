"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { PerformanceData } from "@/types";

interface StudentPerformanceChartProps {
  data: PerformanceData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.marks / data.maxMarks) * 100).toFixed(1);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg backdrop-blur-sm"
      >
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm text-blue-600">
            Score:{" "}
            <span className="font-medium">
              {data.marks}/{data.maxMarks}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage: <span className="font-medium">{percentage}%</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

const getBarColor = (marks: number, maxMarks: number) => {
  const percentage = (marks / maxMarks) * 100;
  if (percentage >= 90) return "#10b981"; // green
  if (percentage >= 80) return "#3b82f6"; // blue
  if (percentage >= 70) return "#f59e0b"; // yellow
  if (percentage >= 60) return "#f97316"; // orange
  return "#ef4444"; // red
};

export default function StudentPerformanceChart({
  data,
}: StudentPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="font-medium">No performance data available</p>
          <p className="text-sm text-gray-400 mt-1">
            Your subject scores will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-80"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="subject"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="marks" radius={[6, 6, 0, 0]} animationDuration={1000}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.marks, entry.maxMarks)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Performance Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <p className="text-lg font-bold text-green-600">
            {data.filter((d) => (d.marks / d.maxMarks) * 100 >= 90).length}
          </p>
          <p className="text-xs text-green-700 font-medium">Excellent (90%+)</p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <p className="text-lg font-bold text-blue-600">
            {
              data.filter((d) => {
                const pct = (d.marks / d.maxMarks) * 100;
                return pct >= 80 && pct < 90;
              }).length
            }
          </p>
          <p className="text-xs text-blue-700 font-medium">Good (80-89%)</p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
          <p className="text-lg font-bold text-yellow-600">
            {
              data.filter((d) => {
                const pct = (d.marks / d.maxMarks) * 100;
                return pct >= 70 && pct < 80;
              }).length
            }
          </p>
          <p className="text-xs text-yellow-700 font-medium">
            Average (70-79%)
          </p>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
          <p className="text-lg font-bold text-red-600">
            {data.filter((d) => (d.marks / d.maxMarks) * 100 < 70).length}
          </p>
          <p className="text-xs text-red-700 font-medium">
            Needs Work (&lt;70%)
          </p>
        </div>
      </div>
    </motion.div>
  );
}
