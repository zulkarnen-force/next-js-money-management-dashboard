import { fetcher } from "@/lib/fetcher";
import { Wallet } from "@/types/wallet";
import useSWR from "swr";

export function useWallets() {
  const { data, error, isLoading } = useSWR<Wallet[]>("/api/wallets", fetcher);

  return {
    wallets: data ?? [],
    isLoading,
    error,
  };
}
