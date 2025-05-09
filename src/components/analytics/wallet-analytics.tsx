"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Mock data - replace with real data from your backend
const walletData = [
  { name: "Main Account", value: 5000 },
  { name: "Savings", value: 8000 },
  { name: "Investment", value: 12000 },
  { name: "Emergency Fund", value: 3000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function WalletAnalytics() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={walletData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {walletData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Wallet Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {walletData.map((wallet) => (
              <div key={wallet.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{wallet.name}</span>
                <span className="text-sm text-muted-foreground">
                  ${wallet.value.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between font-medium">
                <span>Total Balance</span>
                <span>
                  ${walletData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 