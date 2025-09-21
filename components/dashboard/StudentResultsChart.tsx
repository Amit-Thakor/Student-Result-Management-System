"use client";

import React from "react";
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
import { Result } from "@/types";

interface StudentResultsChartProps {
  results: Result[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-blue-600">
          Marks: {data.marks}% (Grade: {data.grade})
        </p>
      </div>
    );
  }
  return null;
};

const getBarColor = (marks: number) => {
  if (marks >= 90) return "#10b981"; // green-500
  if (marks >= 80) return "#3b82f6"; // blue-500
  if (marks >= 70) return "#f59e0b"; // yellow-500
  if (marks >= 60) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
};

export default function StudentResultsChart({
  results,
}: StudentResultsChartProps) {
  if (!results || results.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No results data available
      </div>
    );
  }

  const chartData = results.map((result) => ({
    subject: result.course_code || result.course_name?.substring(0, 8),
    marks: result.marks,
    grade: result.grade,
    fullName: result.course_name,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
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
          <Bar dataKey="marks" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.marks)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
