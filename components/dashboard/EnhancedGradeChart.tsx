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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface GradeData {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

interface EnhancedGradeChartProps {
  data: GradeData[];
  type?: "bar" | "pie" | "line";
  title?: string;
  height?: number;
}

const COLORS = {
  "A+": "#10b981", // emerald-500
  "A": "#22c55e",   // green-500
  "B+": "#3b82f6", // blue-500
  "B": "#6366f1",   // indigo-500
  "C+": "#f59e0b", // amber-500
  "C": "#f97316",   // orange-500
  "D": "#ef4444",   // red-500
  "F": "#dc2626",   // red-600
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-4 border border-gray-200 rounded-xl shadow-lg backdrop-blur-sm"
      >
        <p className="font-semibold text-gray-900 mb-2">{`Grade: ${label}`}</p>
        <p className="text-blue-600 mb-1">{`Count: ${data.count} students`}</p>
        <p className="text-green-600">{`Percentage: ${data.percentage.toFixed(1)}%`}</p>
      </motion.div>
    );
  }
  return null;
};

export default function EnhancedGradeChart({
  data,
  type = "bar",
  title = "Grade Distribution",
  height = 300,
}: EnhancedGradeChartProps) {
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="grade" 
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="count" 
          radius={[4, 4, 0, 0]}
          fill="url(#colorGradient)"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.grade as keyof typeof COLORS] || "#8b5cf6"} />
          ))}
        </Bar>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={2}
          dataKey="count"
          label={({ grade, percentage }) => `${grade}: ${percentage.toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.grade as keyof typeof COLORS] || "#8b5cf6"} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="grade" 
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#8b5cf6" 
          strokeWidth={3}
          dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: "#8b5cf6", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (type) {
      case "pie":
        return renderPieChart();
      case "line":
        return renderLineChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {renderChart()}
    </motion.div>
  );
}
