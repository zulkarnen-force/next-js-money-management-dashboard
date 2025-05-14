"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Wallet {
  id: string;
  name: string;
  createdAt: string;
  balance: number;
}

export default function WalletActions({ wallets }: { wallets: Wallet[] }) {
  const [localWallets, setLocalWallets] = useState(wallets);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [newWalletName, setNewWalletName] = useState("");
  const [editWalletName, setEditWalletName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const refreshWallets = async () => {
    const res = await fetch("/api/wallets");
    const data = await res.json();
    setLocalWallets(data);
  };

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/wallets", {
        method: "POST",
        body: JSON.stringify({ name: newWalletName }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      toast.success("Wallet created");
      setIsCreateDialogOpen(false);
      setNewWalletName("");
      refreshWallets();
    } catch {
      toast.error("Failed to create wallet");
    }
  };

  const handleEdit = async () => {
    if (!selectedWallet) return;
    try {
      const res = await fetch(`/api/wallets/${selectedWallet.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editWalletName }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      toast.success("Wallet updated");
      setIsEditDialogOpen(false);
      refreshWallets();
    } catch {
      toast.error("Failed to update wallet");
    }
  };

  const handleDelete = async () => {
    if (!selectedWallet) return;
    try {
      const res = await fetch(`/api/wallets/${selectedWallet.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Wallet deleted");
      setIsDeleteDialogOpen(false);
      refreshWallets();
    } catch {
      toast.error("Failed to delete wallet");
    }
  };

  return (
    <>
    

      <div className="rounded-md border mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localWallets.map((wallet) => (
              <TableRow key={wallet.id}>
                <TableCell>{wallet.name}</TableCell>
                <TableCell>{wallet.balance}</TableCell>
                <TableCell>
                  {new Date(wallet.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedWallet(wallet);
                      setEditWalletName(wallet.name);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedWallet(wallet);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Wallet</DialogTitle>
            <DialogDescription>Edit your wallet name.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>Wallet Name</Label>
            <Input
              value={editWalletName}
              onChange={(e) => setEditWalletName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Wallet?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
