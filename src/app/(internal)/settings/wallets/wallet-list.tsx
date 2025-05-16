import WalletActions from "./wallet-action";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const getWallets = async (userId: string) => {
  try {
    const wallets = await prismaClient.wallet.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        transactions: {
          include: {
            transactionType: true,
          },
        },
      },
    });

    // Calculate balance for each wallet
    const walletsWithBalance = wallets.map((wallet) => {
      const balance = wallet.transactions.reduce((total, transaction) => {
        if (transaction.transactionType.type === "income") {
          return total + transaction.amount;
        } else {
          return total - transaction.amount;
        }
      }, 0);

      return {
        ...wallet,
        balance,
      };
    });

    // Filter out wallets with zero balance
    const nonZeroWallets = walletsWithBalance.filter(
      (wallet) => wallet.balance !== 0
    );

    return nonZeroWallets;
  } catch (error) {
    throw error;
  }
};

export default async function WalletList() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/api/auth/signin"); // or redirect("/login")
  }
  const wallets = await getWallets(session.user.id);
  return <WalletActions wallets={wallets} />;
}
