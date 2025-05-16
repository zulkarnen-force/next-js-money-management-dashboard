import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

async function cleanupUserData(userId: string) {
  // Delete in reverse order of dependencies
  await prisma.transaction.deleteMany({
    where: { userId },
  });

  await prisma.subcategory.deleteMany({
    where: { userId },
  });

  await prisma.category.deleteMany({
    where: { userId },
  });

  await prisma.transactionType.deleteMany({
    where: { userId },
  });

  await prisma.wallet.deleteMany({
    where: { userId },
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // @ts-ignore
  const userId = session.user.id;
  const data = await req.json();
  console.info(data[0]);

  try {
    // Clean up existing data for the user
    await cleanupUserData(userId);

    // Create a map to store wallet references
    const walletMap = new Map<string, string>();

    for (const row of data) {
      const categoryName = row["Category"]?.trim() || "";
      const subcategoryName = row["Subcategory"]?.trim() || "";
      const typeName = row["Income/Expense"]?.trim() || "";
      const accountName = row["Accounts"]?.trim() || "Default Wallet";

      // Get or create Wallet
      let wallet = await prisma.wallet.findFirst({
        where: {
          name: accountName,
          userId: userId,
        },
      });

      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            name: accountName,
            userId: userId,
          },
        });
      }
      walletMap.set(accountName, wallet.id);

      // Get or create TransactionType
      let transactionType = await prisma.transactionType.findFirst({
        where: {
          name: typeName,
          userId: userId,
        },
      });

      if (!transactionType) {
        // Determine type based on name
        const type = ["Income", "Transfer-In", "Income Balance"].includes(
          typeName
        )
          ? "income"
          : "outcome";

        transactionType = await prisma.transactionType.create({
          data: {
            name: typeName,
            type: type,
            userId: userId,
          },
        });
      }

      // Get or create Category
      let category = await prisma.category.findFirst({
        where: {
          name: categoryName,
          userId: userId,
        },
      });

      if (!category) {
        // Determine category type based on transaction type
        const categoryType =
          transactionType.type === "income" ? "income" : "outcome";

        category = await prisma.category.create({
          data: {
            name: categoryName,
            type: categoryType,
            userId: userId,
          },
        });
      }

      // Get or create Subcategory
      let subcategory = null;
      if (subcategoryName) {
        subcategory = await prisma.subcategory.findFirst({
          where: {
            name: subcategoryName,
            categoryId: category.id,
            userId: userId,
          },
        });

        if (!subcategory) {
          subcategory = await prisma.subcategory.create({
            data: {
              name: subcategoryName,
              categoryId: category.id,
              userId: userId,
            },
          });
        }
      } else {
        // Create a default subcategory if none is provided
        subcategory = await prisma.subcategory.findFirst({
          where: {
            name: "Default",
            categoryId: category.id,
            userId: userId,
          },
        });

        if (!subcategory) {
          subcategory = await prisma.subcategory.create({
            data: {
              name: "Default",
              categoryId: category.id,
              userId: userId,
            },
          });
        }
      }

      // Create the Transaction
      await prisma.transaction.create({
        data: {
          period: new Date(row["Period"]),
          note: row["Note"] || null,
          idr: parseFloat(row["IDR"]) || null,
          description: row["Description"] || null,
          amount: parseFloat(row["Amount"]),
          currencyAccount: row["Currency Accounts"] || "IDR",
          categoryId: category.id,
          subcategoryId: subcategory.id,
          transactionTypeId: transactionType.id,
          walletId: wallet.id,
          userId: userId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "An error occurred during import" },
      { status: 500 }
    );
  }
}
