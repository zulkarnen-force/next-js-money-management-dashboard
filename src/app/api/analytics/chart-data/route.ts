import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prismaClient } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get transactions for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await prismaClient.transaction.findMany({
      where: {
        userId: user.id,
        period: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        transactionType: true,
      },
    });

    // Group transactions by date
    const dailyData = new Map<string, { income: number; expenses: number }>();

    transactions.forEach((transaction) => {
      const date = transaction.period.toISOString().split("T")[0];
      const current = dailyData.get(date) || { income: 0, expenses: 0 };

      if (transaction.transactionType.type === "income") {
        current.income += transaction.amount;
      } else {
        current.expenses += transaction.amount;
      }

      dailyData.set(date, current);
    });

    // Convert to array and sort by date
    const chartData = Array.from(dailyData.entries())
      .map(([date, data]) => ({
        date,
        income: data.income,
        expenses: data.expenses,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("[ANALYTICS_CHART_DATA]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 