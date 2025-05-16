import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useWallet } from "../wallet-context";

// Predefined colors for categories
const COLORS = [
  "#facc15", // yellow
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#6b7280", // gray
  "#10b981", // green
  "#ef4444", // red
  "#f97316", // orange
  "#14b8a6", // teal
  "#6366f1", // indigo
];

interface ExpenseData {
  name: string;
  value: number;
}

export function ExpenseBreakdown() {
  const { activeWallet } = useWallet();
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);

  useEffect(() => {
    if (!activeWallet) return;

    fetch(`/api/expense-breakdown?wallet_id=${activeWallet.id}`)
      .then((res) => res.json())
      .then((data) => setExpenseData(data))
      .catch((err) => console.error("Error fetching expense breakdown:", err));
  }, [activeWallet]);

  if (!activeWallet) return null;

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          See where your money is going in {currentMonth}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
