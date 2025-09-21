"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface GradeData {
  grade: string;
  count: number;
  percentage: number;
}

interface EnhancedGradeChartProps {
  data: GradeData[];
  type?: "pie" | "bar";
  title?: string;
}

const COLORS = {
  "A+": "#10b981", // emerald-500
  A: "#22c55e", // green-500
  "B+": "#3b82f6", // blue-500
  B: "#60a5fa", // blue-400
  "C+": "#f59e0b", // amber-500
  C: "#fbbf24", // amber-400
  D: "#f97316", // orange-500
  F: "#ef4444", // red-500
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
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: COLORS[data.grade as keyof typeof COLORS],
            }}
          />
          <p className="font-semibold text-gray-900">Grade {data.grade}</p>
        </div>
        <p className="text-sm text-gray-600">
          {data.count} students ({data.percentage}%)
        </p>
      </motion.div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {payload?.map((entry: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Badge
            variant="outline"
            className="flex items-center gap-2 px-3 py-1"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            Grade {entry.value}
          </Badge>
        </motion.div>
      ))}
    </div>
  );
};

export default function EnhancedGradeChart({
  data,
  type = "pie",
  title = "Grade Distribution",
}: EnhancedGradeChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
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
              <p className="font-medium">No grade data available</p>
              <p className="text-sm text-gray-400 mt-1">
                Results will appear here once students are graded
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-8 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {type === "pie" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="count"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[entry.grade as keyof typeof COLORS] || "#6b7280"
                      }
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
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
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[entry.grade as keyof typeof COLORS] || "#6b7280"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {data
                .filter((d) => ["A+", "A"].includes(d.grade))
                .reduce((sum, d) => sum + d.count, 0)}
            </p>
            <p className="text-xs text-green-700 font-medium">Excellent</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {data
                .filter((d) => ["B+", "B"].includes(d.grade))
                .reduce((sum, d) => sum + d.count, 0)}
            </p>
            <p className="text-xs text-blue-700 font-medium">Good</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {data
                .filter((d) => ["C+", "C"].includes(d.grade))
                .reduce((sum, d) => sum + d.count, 0)}
            </p>
            <p className="text-xs text-yellow-700 font-medium">Average</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {data
                .filter((d) => ["D", "F"].includes(d.grade))
                .reduce((sum, d) => sum + d.count, 0)}
            </p>
            <p className="text-xs text-red-700 font-medium">Needs Help</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
