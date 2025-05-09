"use client";
import { RecentTransactions } from "@/components/dashboard/recent-transaction";
import { TransactionGraph } from "@/components/dashboard/income-outcome-transaction-graph";
import { IncomeOutcomeArea } from "@/components/dashboard/income-outcome-area";
import { ExpenseBreakdown } from "@/components/dashboard/expense-breakdown";
import { useSession } from "next-auth/react";

export default function MoneyDashboard() {
  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      <RecentTransactions />
      <ExpenseBreakdown />
      <IncomeOutcomeArea />
      <TransactionGraph />
    </div>
  );
}
