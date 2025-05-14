import WalletActions from "./wallet-action";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WalletDialog from "./wallet-dialog";

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

export default async function WalletsPage() {
  const session = await getServerSession(authOptions);
  const wallets = await getWallets(session.user.id);
  return (
    <div className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Wallets</h1>
        <WalletDialog />
      </div>
      <WalletActions wallets={wallets}></WalletActions>
    </div>
  );
}
