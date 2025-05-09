"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  date: string;
  income: number;
  expenses: number;
}

export function OverviewChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const response = await fetch("/api/analytics/chart-data");
      const chartData = await response.json();
      setData(chartData);
    };

    fetchChartData();
  }, []);

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="income"
            stackId="1"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stackId="1"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 