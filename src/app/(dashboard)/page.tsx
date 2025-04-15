"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { RecentTransactions } from "@/components/dashboard/recent-transaction";
import { TransactionGraph } from "@/components/dashboard/income-outcome-transaction-graph";
import { IncomeOutcomeArea } from "@/components/dashboard/income-outcome-area";
import { useSession } from "next-auth/react";

const balanceData = [
  { name: "Income", amount: 5000, color: "#10b981" },
  { name: "Expense", amount: 3200, color: "#ef4444" },
];

const expenseCategories = [
  { name: "Rent", value: 1200, color: "#facc15" },
  { name: "Groceries", value: 600, color: "#3b82f6" },
  { name: "Transport", value: 200, color: "#8b5cf6" },
  { name: "Entertainment", value: 300, color: "#ec4899" },
  { name: "Other", value: 900, color: "#6b7280" },
];

const recentTransactions = [
  { id: 1, description: "Salary", amount: "+$5000", type: "income" },
  { id: 2, description: "Rent Payment", amount: "-$1200", type: "expense" },
  { id: 3, description: "Groceries", amount: "-$600", type: "expense" },
  {
    id: 4,
    description: "Netflix Subscription",
    amount: "-$15",
    type: "expense",
  },
];

export default function MoneyDashboard() {
  const { data: session } = useSession();
  console.info(session)
  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Balance Overview */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Balance Overview</CardTitle>
          <CardDescription>Track your income and expenses.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={balanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount">
                {balanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>See where your money is going.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={expenseCategories}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {expenseCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <RecentTransactions />
      <TransactionGraph />
      <IncomeOutcomeArea />
    </div>
  );
}
