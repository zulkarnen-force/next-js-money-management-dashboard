"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data - replace with real data from your backend
const trendData = [
  { date: "Jan", income: 4000, expense: 2400 },
  { date: "Feb", income: 3000, expense: 1398 },
  { date: "Mar", income: 2000, expense: 9800 },
  { date: "Apr", income: 2780, expense: 3908 },
  { date: "May", income: 1890, expense: 4800 },
  { date: "Jun", income: 2390, expense: 3800 },
];

export function TransactionTrends() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#8884d8"
                  name="Income"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#82ca9d"
                  name="Expense"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendData.map((month) => (
                <div key={month.date} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.date}</span>
                  <div className="space-x-4">
                    <span className="text-sm text-green-600">
                      +${month.income.toLocaleString()}
                    </span>
                    <span className="text-sm text-red-600">
                      -${month.expense.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendData.map((month) => (
                <div key={month.date} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.date}</span>
                  <span
                    className={`text-sm ${
                      month.income - month.expense >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    ${(month.income - month.expense).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 