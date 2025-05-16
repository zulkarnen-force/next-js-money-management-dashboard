"use client";
import { RecentTransactions } from "@/components/dashboard/recent-transaction";
import { TransactionGraph } from "@/components/dashboard/income-outcome-transaction-graph";
import { IncomeOutcomeArea } from "@/components/dashboard/income-outcome-area";
import { ExpenseBreakdown } from "@/components/dashboard/expense-breakdown";
import { WalletsList } from "@/components/dashboard/wallets-list";
import IncomeOutcomeBarChart from "@/components/dashboard/income-outcome-barchart";

export default function MoneyDashboard() {
  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      <WalletsList />
      <RecentTransactions />
      <ExpenseBreakdown />
      <IncomeOutcomeArea/>
      <IncomeOutcomeBarChart />
    </div>
  );
}
