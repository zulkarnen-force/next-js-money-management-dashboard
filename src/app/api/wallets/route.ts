import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wallets = await prisma.wallet.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        transactions: {
          include: {
            transactionType: true
          }
        }
      }
    });

    // Calculate balance for each wallet
    const walletsWithBalance = wallets.map(wallet => {
      const balance = wallet.transactions.reduce((total, transaction) => {
        if (transaction.transactionType.type === 'income') {
          return total + transaction.amount;
        } else {
          return total - transaction.amount;
        }
      }, 0);

      return {
        ...wallet,
        balance,
        transactions: undefined // Remove transactions from response
      };
    });

    // Filter out wallets with zero balance
    const nonZeroWallets = walletsWithBalance.filter(wallet => wallet.balance !== 0);

    return NextResponse.json(nonZeroWallets);
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 });
  }
} 