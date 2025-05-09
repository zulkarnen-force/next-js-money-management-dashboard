import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWallet } from "../wallet-switcher";

interface Transaction {
  id: string;
  period: string;
  amount: number;
  description: string | null;
  note: string | null;
  currencyAccount: string;
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  transactionType: {
    name: string;
    type: string;
  };
}

export function RecentTransactions() {
  const { activeWallet } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (activeWallet) {
      fetch(`/api/transactions?wallet_id=${activeWallet.id}`)
        .then((res) => res.json())
        .then((data) => setTransactions(data))
        .catch((err) => console.error("Error fetching transactions:", err));
    }
  }, [activeWallet]);

  console.log(activeWallet);

  if (!activeWallet) return <p>Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions ({activeWallet.name})</CardTitle>
        <CardDescription>
          Track your latest financial activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No transactions found.
            </p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {transaction.category.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium">
                    {transaction.description || transaction.category.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.subcategory.name} • {transaction.transactionType.name}
                  </p>
                </div>
                <div
                  className={`ml-auto font-medium ${
                    transaction.transactionType.type === 'outcome' ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {transaction.transactionType.type === 'outcome' ? "-" : "+"}
                  {transaction.currencyAccount} {Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
