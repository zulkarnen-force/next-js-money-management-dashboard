"use client";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-04-01", income: 5000, outcome: 3000 },
  { date: "2024-04-02", income: 4000, outcome: 2500 },
  { date: "2024-04-03", income: 4500, outcome: 2800 },
  { date: "2024-04-04", income: 5200, outcome: 3200 },
];

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  outcome: {
    label: "Outcome",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TransactionGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("income");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Overview</CardTitle>
        <CardDescription>Visualize your income and outcome</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          {Object.keys(chartConfig).map((key) => (
            <button
              key={key}
              className={`px-4 py-2 border rounded ${
                activeChart === key ? "bg-muted" : ""
              }`}
              onClick={() => setActiveChart(key as keyof typeof chartConfig)}
            >
              {chartConfig[key as keyof typeof chartConfig].label}
            </button>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full mt-4"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="transactions"
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
