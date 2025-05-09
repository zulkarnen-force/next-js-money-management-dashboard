import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const walletId = searchParams.get('wallet_id');

  if (!walletId) {
    return NextResponse.json({ error: "Wallet ID is required" }, { status: 400 });
  }

  try {
    // Get the first and last day of the current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get all outcome transactions for the current wallet in the current month
    const transactions = await prisma.transaction.findMany({
      where: {
        walletId,
        userId: session.user.id,
        transactionType: {
          type: 'outcome'
        },
        period: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      },
      include: {
        category: true,
      },
    });

    // Group transactions by category and sum the amounts
    const categoryTotals = transactions.reduce((acc: any, transaction) => {
      const categoryName = transaction.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += transaction.amount;
      return acc;
    }, {});

    // Convert to array format for the pie chart
    const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Number(value),
    }));

    return NextResponse.json(pieData);
  } catch (error) {
    console.error("Error fetching expense breakdown:", error);
    return NextResponse.json({ error: "Failed to fetch expense breakdown" }, { status: 500 });
  }
} 