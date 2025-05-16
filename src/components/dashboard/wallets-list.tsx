import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useWallet } from "../wallet-context";

interface Wallet {
  id: string;
  name: string;
  balance: number;
}

export function WalletsList() {
  const { activeWallet } = useWallet();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showAmounts, setShowAmounts] = useState(false);

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

  console.log(wallets)

  const totalBalance = Array.isArray(wallets) ? wallets.reduce((sum, wallet) => sum + wallet.balance, 0) : 0;

  const toggleAmounts = () => {
    setShowAmounts(!showAmounts);
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Wallets Overview</CardTitle>
          <CardDescription className="py-1">Quick look at where your money’s</CardDescription>
          <CardDescription>
            Total Balance:{" "}
            <span className={totalBalance >= 0 ? "text-green-500" : "text-red-500"}>
              {showAmounts ? formatBalance(totalBalance) : "• • • • • • • •"}
            </span>
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAmounts}
          title={showAmounts ? "Hide amounts" : "Show amounts"}
        >
          {showAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wallets.length === 0 && !Array.isArray(wallets) ? (
            <p className="text-muted-foreground text-center">
              No wallets with balance found.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.isArray(wallets) && wallets.map((wallet) => (
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
                    {showAmounts ? formatBalance(wallet.balance) : "• • • • • • • •"}
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