"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface Wallet {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  balance: number;
}

interface WalletContextType {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  setActiveWallet: (wallet: Wallet) => void;
}

const WalletContext = React.createContext<WalletContextType | undefined>(
  undefined
);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallets, setWallets] = React.useState<Wallet[]>([]);
  const [activeWallet, setActiveWallet] = React.useState<Wallet | null>(null);

  React.useEffect(() => {
    fetch("/api/wallets")
      .then((res) => res.json())
      .then((data) => {
        setWallets(data);
        if (data.length > 0) {
          setActiveWallet(data[0]); // Set the first wallet as default
        }
      })
      .catch((error) => {
        console.error("Error fetching wallets:", error);
      });
  }, []);

  return (
    <WalletContext.Provider value={{ wallets, activeWallet, setActiveWallet }}>
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

export function WalletSwitcher() {
  const { isMobile } = useSidebar();
  const { wallets, activeWallet, setActiveWallet } = useWallet();

  if (!activeWallet) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Plus className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    No Active Wallets
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Add a wallet to get started
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Wallets
              </DropdownMenuLabel>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add wallet
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(balance);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-lg font-semibold">
                  {activeWallet.name.charAt(0)}
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWallet.name}
                </span>
                <span className={`truncate text-xs ${activeWallet.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  Balance: {formatBalance(activeWallet.balance)}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Wallets with Balance
            </DropdownMenuLabel>
            {wallets.map((wallet) => (
              <DropdownMenuItem
                key={wallet.id}
                onClick={() => setActiveWallet(wallet)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <span className="text-sm font-semibold">
                    {wallet.name.charAt(0)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span>{wallet.name}</span>
                  <span className={`text-xs ${wallet.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatBalance(wallet.balance)}
                  </span>
                </div>
                <DropdownMenuShortcut>⌘{wallet.id.slice(0, 4)}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add wallet
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
