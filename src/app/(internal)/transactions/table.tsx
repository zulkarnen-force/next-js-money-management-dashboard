"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Transaction = {
  id: string;
  period: string;
  description: string;
  category: { name: string };
  subcategory: { name: string };
  amount: number;
  currencyAccount: string;
};

export default function TransactionTable() {
  const [data, setData] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/transactions?page=${page}&pageSize=${pageSize}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setTotal(json.total);
        setLoading(false);
      });
  }, [page, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    {new Date(tx.period).toLocaleDateString("en-US")}
                  </TableCell>
                  <TableCell>{tx.description || "-"}</TableCell>
                  <TableCell>
                    {tx.category.name} / {tx.subcategory.name}
                  </TableCell>
                  <TableCell>
                    {tx.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: tx.currencyAccount,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button onClick={() => setPage(page - 1)} disabled={page <= 1}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
