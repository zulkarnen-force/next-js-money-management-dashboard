// Define WalletContext
export default interface Wallet {
  id: string;
  name: string;
  logo: string;
  balance: number;
}

export const wallets: Wallet[] = [
  {
    id: "1",
    balance: 100000,
    logo: "abbr",
    name: "ShopeePay",
  },
  {
    id: "2",
    balance: 240000,
    logo: "abbr",
    name: "Bank Jago",
  },
];
