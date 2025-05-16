import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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

    // Get transactions for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const transactions = await prismaClient.transaction.findMany({
      where: {
        userId: user.id,
        period: {
          gte: startOfMonth,
        },
      },
      include: {
        transactionType: true,
      },
    });

    // Calculate metrics
    const totalIncome = transactions
      .filter((t) => t.transactionType.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.transactionType.type === "outcome")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      netBalance,
      transactionCount: transactions.length,
    });
  } catch (error) {
    console.error("[ANALYTICS_OVERVIEW]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
