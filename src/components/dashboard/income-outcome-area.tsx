import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useWallet } from "../wallet-switcher";

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

export function IncomeOutcomeArea() {
  const { activeWallet } = useWallet();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!activeWallet) return;

    fetch(`/api/financials?wallet_id=${activeWallet.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setChartData(data[0].data);
        }
      })
      .catch((err) => console.error("Error fetching financial data:", err));
  }, [activeWallet]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income & Outcome</CardTitle>
        <CardDescription>
          Overview of financial transactions over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="outcome"
              type="natural"
              fill="var(--color-outcome)"
              fillOpacity={0.4}
              stroke="var(--color-outcome)"
              stackId="a"
            />
            <Area
              dataKey="income"
              type="natural"
              fill="var(--color-income)"
              fillOpacity={0.4}
              stroke="var(--color-income)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Financial trend over the last 6 months{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {new Date().toLocaleString('default', { month: 'long' })} - {new Date(new Date().setMonth(new Date().getMonth() - 5)).toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
