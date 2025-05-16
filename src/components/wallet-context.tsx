"use client";
import * as React from "react";
import { useWallets } from "@/hooks/use-wallets";
import { Wallet, WalletContextType } from "@/types/wallet";

const WalletContext = React.createContext<WalletContextType | undefined>(
  undefined
);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { wallets, isLoading } = useWallets();
  const [activeWallet, setActiveWallet] = React.useState<Wallet | null>(null);

  React.useEffect(() => {
    if (wallets.length === 0) return;

    const storedId = localStorage.getItem("activeWalletId");
    const found = wallets.find((w) => w.id === storedId);

    if (found) {
      setActiveWallet(found);
    } else {
      setActiveWallet(wallets[0]);
      localStorage.setItem("activeWalletId", wallets[0].id);
    }
  }, [wallets]);

  const setActiveWalletWithStorage = (wallet: Wallet) => {
    localStorage.setItem("activeWalletId", wallet.id);
    setActiveWallet(wallet);
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        activeWallet,
        setActiveWallet: setActiveWalletWithStorage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
