import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wallets = await prismaClient.wallet.findMany({
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

export async function PUT(
  req: Request,
  { params }: { params: { walletId: string } }
) {
  try {
    console.log(req)
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Verify wallet ownership
    const wallet = await prismaClient.wallet.findFirst({
      where: {
        id: params.walletId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!wallet) {
      return new NextResponse("Wallet not found", { status: 404 });
    }

    // Update wallet
    const updatedWallet = await prismaClient.wallet.update({
      where: {
        id: params.walletId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedWallet);
  } catch (error) {
    console.error("[WALLET_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE /api/wallets/[walletId] - Delete a wallet and its transactions
export async function DELETE(
  req: Request,
  { params }: { params: { walletId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify wallet ownership
    const wallet = await prismaClient.wallet.findFirst({
      where: {
        id: params.walletId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!wallet) {
      return new NextResponse("Wallet not found", { status: 404 });
    }

    // Delete wallet and its transactions in a transaction
    await prismaClient.$transaction([
      // First delete all transactions associated with the wallet
      prismaClient.transaction.deleteMany({
        where: {
          walletId: params.walletId,
        },
      }),
      // Then delete the wallet
      prismaClient.wallet.delete({
        where: {
          id: params.walletId,
        },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[WALLET_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 