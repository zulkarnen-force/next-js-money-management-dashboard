import TransactionTable from "./table";

export default function TransactionPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-2">Transactions</h1>
      <p className="text-muted-foreground mb-4">
        Manage all your financial transactions
      </p>
      <TransactionTable />
    </main>
  );
}
