"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface GradeData {
  grade: string;
  count: number;
  percentage: number;
}

interface GradeDistributionChartProps {
  data: GradeData[];
}

const COLORS = {
  "A+": "#10b981", // green-500
  A: "#22c55e", // green-400
  "B+": "#3b82f6", // blue-500
  B: "#60a5fa", // blue-400
  "C+": "#f59e0b", // yellow-500
  C: "#fbbf24", // yellow-400
  D: "#f97316", // orange-500
  F: "#ef4444", // red-500
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">Grade {data.grade}</p>
        <p className="text-sm text-gray-600">
          {data.count} students ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export default function GradeDistributionChart({
  data,
}: GradeDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No grade distribution data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.grade as keyof typeof COLORS] || "#6b7280"}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>Grade {value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
