import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function processImport(job: any) {
  const { id, userId, data } = job;

  try {
    await prisma.importJob.update({
      where: { id },
      data: { status: "processing" },
    });

    await cleanupUserData(userId);

    const walletMap = new Map<string, string>();

    for (const row of data) {
      const categoryName = row["Category"]?.trim() || "";
      const subcategoryName = row["Subcategory"]?.trim() || "";
      const typeName = row["Income/Expense"]?.trim() || "";
      const accountName = row["Accounts"]?.trim() || "Default Wallet";

      let wallet = await prisma.wallet.findFirst({ where: { name: accountName, userId } });
      if (!wallet) {
        wallet = await prisma.wallet.create({ data: { name: accountName, userId } });
      }
      walletMap.set(accountName, wallet.id);

      let transactionType = await prisma.transactionType.findFirst({
        where: { name: typeName, userId },
      });

      if (!transactionType) {
        const type = ['Income', 'Transfer-In', 'Income Balance'].includes(typeName)
          ? 'income'
          : 'outcome';

        transactionType = await prisma.transactionType.create({
          data: { name: typeName, type, userId },
        });
      }

      let category = await prisma.category.findFirst({ where: { name: categoryName, userId } });
      if (!category) {
        const categoryType = transactionType.type === 'income' ? 'income' : 'outcome';
        category = await prisma.category.create({
          data: { name: categoryName, type: categoryType, userId },
        });
      }

      let subcategory = await prisma.subcategory.findFirst({
        where: { name: subcategoryName || "Default", categoryId: category.id, userId },
      });

      if (!subcategory) {
        subcategory = await prisma.subcategory.create({
          data: { name: subcategoryName || "Default", categoryId: category.id, userId },
        });
      }

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
          userId,
        },
      });
    }

    await prisma.importJob.update({
      where: { id },
      data: { status: "done" },
    });

  } catch (error: any) {
    console.error("Worker Error:", error);
    await prisma.importJob.update({
      where: { id },
      data: { status: "failed", error: error.message },
    });
  }
}

async function cleanupUserData(userId: string) {
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.subcategory.deleteMany({ where: { userId } });
  await prisma.category.deleteMany({ where: { userId } });
  await prisma.transactionType.deleteMany({ where: { userId } });
  await prisma.wallet.deleteMany({ where: { userId } });
}

async function runWorker() {
  console.log("Worker started...");
  while (true) {
    const job = await prisma.importJob.findFirst({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
    });

    if (job) {
      await processImport(job);
    } else {
      await new Promise((r) => setTimeout(r, 2000)); // wait 2s before polling again
    }
  }
}

runWorker();
