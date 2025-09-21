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
  Legend,
} from "recharts";

interface StudentResultData {
  month: string;
  average: number;
  highest: number;
  lowest: number;
}

interface StudentResultsChartProps {
  data: StudentResultData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{`Month: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StudentResultsChart({ data }: StudentResultsChartProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Performance Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Average"
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="highest" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Highest"
            dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="lowest" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Lowest"
            dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
