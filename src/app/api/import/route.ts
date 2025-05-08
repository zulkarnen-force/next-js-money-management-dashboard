import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route";


const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  // @ts-ignore
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // @ts-ignore
  const userId = session.user.id;
  const data = await req.json();
  console.info(data[0])
  
  for (const row of data) {
    const categoryName = row["Category"]?.trim() || "";
    const subcategoryName = row["Subcategory"]?.trim() || "";
    const typeName = row["Income/Expense"]?.trim() || "";

    // Get or create TransactionType
    let transactionType = await prisma.transactionType.findFirst({
      where: { 
        name: typeName,
        userId: userId
      }
    });

    if (!transactionType) {
      transactionType = await prisma.transactionType.create({
        data: { 
          name: typeName,
          userId: userId
        }
      });
    }

    // Get or create Category
    let category = await prisma.category.findFirst({
      where: { 
        name: categoryName,
        userId: userId
      }
    });

    if (!category) {
      category = await prisma.category.create({
        data: { 
          name: categoryName,
          userId: userId
        }
      });
    }

    // Get or create Subcategory
    let subcategory = null;
    if (subcategoryName) {
      subcategory = await prisma.subcategory.findFirst({
        where: {
          name: subcategoryName,
          categoryId: category.id,
          userId: userId
        },
      });

      if (!subcategory) {
        subcategory = await prisma.subcategory.create({
          data: {
            name: subcategoryName,
            categoryId: category.id,
            userId: userId
          },
        });
      }
    } else {
      // Create a default subcategory if none is provided
      subcategory = await prisma.subcategory.findFirst({
        where: {
          name: "Default",
          categoryId: category.id,
          userId: userId
        },
      });

      if (!subcategory) {
        subcategory = await prisma.subcategory.create({
          data: {
            name: "Default",
            categoryId: category.id,
            userId: userId
          },
        });
      }
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
        currencyAccount: row["Currency Accounts"] || "IDR",
        categoryId: category.id,
        subcategoryId: subcategory.id, // Now we always have a valid subcategory ID
        transactionTypeId: transactionType.id,
        userId: userId
      },
    });
  }

  return NextResponse.json({ success: true });
}
