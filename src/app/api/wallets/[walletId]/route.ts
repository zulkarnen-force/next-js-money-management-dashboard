import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

// PUT /api/wallets/[walletId] - Update a wallet
export async function PUT(
  req: Request,
  { params }: { params: { walletId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
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
        userId: session.user.id,
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
        userId: session.user.id,
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