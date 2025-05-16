"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useWallet } from "../wallet-context";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { ChartData, ResponseChartData } from "@/types";

const chartConfig = {
  desktop: {
    label: "desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function incomeOutcomeBarChart() {
  const { activeWallet } = useWallet();
  const [data, setData] = useState<ChartData[]>([]);
  const [dateRange, setDateRange] = useState<string>("");
  const [trending, setTrending] = useState<number | null>(null);

  useEffect(() => {
    if (activeWallet) {
      const fetchData = async () => {
        const oke = await fetcher<ResponseChartData>(
          `/api/analytics/finances?wallet_id=${activeWallet.id}`
        );
        setData(oke.data);
        setDateRange(oke.dateRange || "");
        setTrending(oke.trending ?? null);
      };
      fetchData();
    }
  }, [activeWallet]);

  // if (loading) return <p className="text-muted">Loading chart...</p>;
  // if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <p className="text-muted">No data available</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>
          See how your money’s flowed on {dateRange || "-"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="var(--color-mobile)" radius={4} />
            <Bar dataKey="outcome" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trending !== null ? (
            <>
              Trending {trending >= 0 ? "up" : "down"} by{" "}
              {Math.abs(trending).toFixed(1)}% this month{" "}
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            "-"
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total income and outcome for the current year
        </div>
      </CardFooter>
    </Card>
  );
}
