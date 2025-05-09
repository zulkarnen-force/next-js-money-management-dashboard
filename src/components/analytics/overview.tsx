"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "@/components/analytics/overview-chart";
import { prisma } from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function Overview() {
  const { data: session } = useSession();
  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!session?.user?.email) return;

      const response = await fetch("/api/analytics/overview");
      const data = await response.json();
      setMetrics(data);
    };

    fetchMetrics();
  }, [session]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalIncome.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.netBalance.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.transactionCount}</div>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <OverviewChart />
        </CardContent>
      </Card>
    </div>
  );
} 