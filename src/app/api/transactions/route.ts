import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prismaClient } from "@/lib/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session  = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const walletId = searchParams.get('wallet_id');

  if (!walletId) {
    return NextResponse.json({ error: "Wallet ID is required" }, { status: 400 });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        walletId,
        userId: session.user.id
      },
      include: {
        category: true,
        subcategory: true,
        transactionType: true
      },
      orderBy: {
        period: 'desc'
      },
      take: 10 // Limit to 10 most recent transactions
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      amount,
      note,
      description,
      currencyAccount,
      walletId,
      categoryId,
      subcategoryId,
      transactionTypeId,
      period,
    } = body;

    // Validate required fields
    if (!amount || !walletId || !categoryId || !subcategoryId || !transactionTypeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await prismaClient.transaction.create({
      data: {
        amount: parseFloat(amount),
        note: note || "",
        description: description || "",
        currencyAccount: currencyAccount || "IDR",
        period: period ? new Date(period) : new Date(),
        userId: session.user.id,
        walletId,
        categoryId,
        subcategoryId,
        transactionTypeId,
      },
      include: {
        category: true,
        subcategory: true,
        transactionType: true,
        wallet: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
} 