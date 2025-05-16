import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest) {
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

    const walletId = req.nextUrl.pathname.split("/").pop()!;

    const wallet = await prismaClient.wallet.findFirst({
      where: {
        id: walletId,
        userId: session.user.id,
      },
    });

    if (!wallet) {
      return new NextResponse("Wallet not found", { status: 404 });
    }

    const updatedWallet = await prismaClient.wallet.update({
      where: { id: walletId },
      data: { name },
    });

    return NextResponse.json(updatedWallet);
  } catch (error) {
    console.error("[WALLET_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const walletId = req.nextUrl.pathname.split("/").pop()!;

    const wallet = await prismaClient.wallet.findFirst({
      where: {
        id: walletId,
        userId: session.user.id,
      },
    });

    if (!wallet) {
      return new NextResponse("Wallet not found", { status: 404 });
    }

    await prismaClient.$transaction([
      prismaClient.transaction.deleteMany({
        where: { walletId },
      }),
      prismaClient.wallet.delete({
        where: { id: walletId },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[WALLET_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
