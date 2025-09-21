"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Result } from "@/types";

interface GradeProgressChartProps {
  results: Result[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.subject}</p>
        <p className="text-sm text-blue-600">
          Marks: {data.marks}% (Grade: {data.grade})
        </p>
        <p className="text-xs text-gray-500">
          Date: {new Date(data.date).toLocaleDateString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function GradeProgressChart({
  results,
}: GradeProgressChartProps) {
  if (!results || results.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No progress data available
      </div>
    );
  }

  // Sort results by exam date and create chart data
  const sortedResults = [...results].sort(
    (a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
  );

  const chartData = sortedResults.map((result, index) => ({
    index: index + 1,
    marks: result.marks,
    grade: result.grade,
    subject: result.course_code || result.course_name?.substring(0, 8),
    date: result.exam_date,
    fullName: result.course_name,
  }));

  // Calculate trend line
  const averageMarks =
    chartData.reduce((sum, item) => sum + item.marks, 0) / chartData.length;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="subject"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6b7280" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="marks"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
          />
          {/* Average line */}
          <Line
            type="monotone"
            dataKey={() => averageMarks}
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Your Scores</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-0.5 bg-gray-400"
            style={{ borderTop: "2px dashed #94a3b8" }}
          ></div>
          <span className="text-gray-600">
            Average ({averageMarks.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
