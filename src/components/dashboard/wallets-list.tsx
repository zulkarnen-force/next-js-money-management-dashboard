import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useWallet } from "../wallet-switcher";

interface Wallet {
  id: string;
  name: string;
  balance: number;
}

export function WalletsList() {
  const { activeWallet } = useWallet();
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    fetch("/api/wallets")
      .then((res) => res.json())
      .then((data) => setWallets(data))
      .catch((err) => console.error("Error fetching wallets:", err));
  }, []);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Wallets Overview</CardTitle>
        <CardDescription>
          Total Balance:{" "}
          <span className={totalBalance >= 0 ? "text-green-500" : "text-red-500"}>
            {formatBalance(totalBalance)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wallets.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No wallets with balance found.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    wallet.id === activeWallet?.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {wallet.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {wallet.id === activeWallet?.id ? "Active Wallet" : ""}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      wallet.balance >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {formatBalance(wallet.balance)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 