import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const walletId = searchParams.get("wallet_id");

  if (!walletId) {
    return NextResponse.json(
      { error: "Wallet ID is required" },
      { status: 400 }
    );
  }

  try {
    const transactions = await prismaClient.transaction.findMany({
      where: {
        walletId,
        userId: session.user.id,
      },
      include: {
        category: true,
        subcategory: true,
        transactionType: true,
      },
      orderBy: {
        period: "desc",
      },
      take: 10, // Limit to 10 most recent transactions
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
