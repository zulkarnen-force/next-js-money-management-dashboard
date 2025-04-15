import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();

  for (const row of data) {
    const categoryName = row["Category"].trim();
    const subcategoryName = row["Subcategory"].trim();
    const typeName = row["Income/Expense"].trim();

    // Get or create TransactionType
    const transactionType = await prisma.transactionType.upsert({
      where: { name: typeName },
      update: {},
      create: { name: typeName },
    });

    // Get or create Category
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    // Get or create Subcategory
    let subcategory = await prisma.subcategory.findFirst({
      where: {
        name: subcategoryName,
        categoryId: category.id,
      },
    });

    if (!subcategory) {
      subcategory = await prisma.subcategory.create({
        data: {
          name: subcategoryName,
          categoryId: category.id,
        },
      });
    }

    // Create the Transaction
    await prisma.transaction.create({
      data: {
        period: new Date(row["Period"]),
        account: row["Accounts"],
        note: row["Note"] || null,
        idr: parseFloat(row["IDR"]) || null,
        description: row["Description"] || null,
        amount: parseFloat(row["Amount"]),
        currencyAccount: row["Currency Accounts"],
        categoryId: category.id,
        subcategoryId: subcategory.id,
        transactionTypeId: transactionType.id,
      },
    });
  }

  return NextResponse.json({ success: true });
}
