import { Suspense } from "react";
import WalletDialog from "./wallet-dialog";
import WalletList from "./wallet-list";

export default async function WalletsPage() {
  return (
    <div className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Wallets</h1>
        <WalletDialog />
      </div>
      <div className="relative min-h-[500px]">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex justify-center items-center bg-white/80 z-10">
              <span>Loading...</span>
            </div>
          }
        >
          <WalletList />
        </Suspense>
      </div>
    </div>
  );
}
