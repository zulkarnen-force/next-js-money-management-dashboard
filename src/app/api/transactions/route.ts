import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prismaClient } from "@/lib/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const skip = (page - 1) * pageSize;

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        subcategory: true,
        transactionType: true,
        wallet: true,
      },
    }),
    prisma.transaction.count(),
  ]);

  return NextResponse.json({
    data: transactions,
    total,
    page,
    pageSize,
  });
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
    if (
      !amount ||
      !walletId ||
      !categoryId ||
      !subcategoryId ||
      !transactionTypeId
    ) {
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
