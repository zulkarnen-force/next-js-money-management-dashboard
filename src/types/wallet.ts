export interface Wallet {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  balance: number;
}

export interface WalletContextType {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  setActiveWallet: (wallet: Wallet) => void;
}