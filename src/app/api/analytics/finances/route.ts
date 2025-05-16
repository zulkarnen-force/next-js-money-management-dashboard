import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletId = searchParams.get("wallet_id");

  if (!walletId) {
    return NextResponse.json(
      { error: "Wallet ID is required" },
      { status: 400 }
    );
  }

  try {
    // Get transactions for the current year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const transactions = await prismaClient.transaction.findMany({
      where: {
        walletId: walletId,
        period: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      include: {
        transactionType: true,
      },
    });

    // Group transactions by month and calculate income/outcome
    const monthlyData = transactions.reduce((acc: any, transaction) => {
      const month = transaction.period.toLocaleString("default", {
        month: "long",
      });

      if (!acc[month]) {
        acc[month] = { income: 0, outcome: 0 };
      }

      // Use the type field to determine if it's income or outcome
      if (transaction.transactionType.type === "income") {
        acc[month].income += transaction.amount;
      } else {
        acc[month].outcome += transaction.amount;
      }

      return acc;
    }, {});

    // Convert to array format expected by the chart, sorted by month order
    const monthOrder = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const chartData = monthOrder
      .map((month) => ({
        month,
        income: monthlyData[month]?.income || 0,
        outcome: monthlyData[month]?.outcome || 0,
      }))
      .filter((item) => item.income !== 0 || item.outcome !== 0);

    // Calculate date range string
    let dateRange = "";
    if (chartData.length > 0) {
      const firstMonth = chartData[0].month;
      const lastMonth = chartData[chartData.length - 1].month;
      dateRange = `${firstMonth} - ${lastMonth} ${now.getFullYear()}`;
    }

    // Calculate trending percentage (income change from last month to previous month)
    let trending = null;
    if (chartData.length >= 2) {
      const last = chartData[chartData.length - 1].income;
      const prev = chartData[chartData.length - 2].income;
      if (prev !== 0) {
        trending = ((last - prev) / prev) * 100;
      } else if (last !== 0) {
        trending = 100;
      } else {
        trending = 0;
      }
    }

    return NextResponse.json({
      data: chartData,
      dateRange,
      trending,
    });
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial data" },
      { status: 500 }
    );
  }
}
