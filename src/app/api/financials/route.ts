import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletId = searchParams.get("wallet_id");

  if (!walletId) {
    return NextResponse.json({ error: "Wallet ID is required" }, { status: 400 });
  }

  try {
    // Get transactions for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await prismaClient.transaction.findMany({
      where: {
        walletId: walletId,
        period: {
          gte: sixMonthsAgo,
        },
      },
      include: {
        transactionType: true,
      },
    });

    // Group transactions by month and calculate income/outcome
    const monthlyData = transactions.reduce((acc: any, transaction) => {
      const month = transaction.period.toLocaleString('default', { month: 'long' });
      
      if (!acc[month]) {
        acc[month] = { income: 0, outcome: 0 };
      }

      // Use the type field to determine if it's income or outcome
      if (transaction.transactionType.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].outcome += transaction.amount;
      }

      return acc;
    }, {});

    // Convert to array format expected by the chart
    const chartData = Object.entries(monthlyData).map(([month, data]: [string, any]) => ({
      month,
      income: data.income,
      outcome: data.outcome,
    }));

    return NextResponse.json([{ data: chartData }]);
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return NextResponse.json({ error: "Failed to fetch financial data" }, { status: 500 });
  }
} 