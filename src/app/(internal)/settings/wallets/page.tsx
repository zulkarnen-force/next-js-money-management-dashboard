"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Wallet {
  id: string;
  name: string;
  createdAt: string;
  balance: number;
}

export default function WalletsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [newWalletName, setNewWalletName] = useState("");
  const [editWalletName, setEditWalletName] = useState("");

  // Fetch wallets
  const fetchWallets = async () => {
    try {
      const response = await fetch("/api/wallets");
      if (!response.ok) throw new Error("Failed to fetch wallets");
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      toast.error("Failed to load wallets");
    } finally {
      setIsLoading(false);
    }
  };

  // Create wallet
  const handleCreateWallet = async () => {
    try {
      const response = await fetch("/api/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWalletName }),
      });

      if (!response.ok) throw new Error("Failed to create wallet");

      toast.success("Wallet created successfully");
      setIsCreateDialogOpen(false);
      setNewWalletName("");
      fetchWallets();
    } catch (error) {
      toast.error("Failed to create wallet");
    }
  };

  // Update wallet
  const handleUpdateWallet = async () => {
    if (!selectedWallet) return;

    try {
      const response = await fetch(`/api/wallets/${selectedWallet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editWalletName }),
      });

      if (!response.ok) throw new Error("Failed to update wallet");

      toast.success("Wallet updated successfully");
      setIsEditDialogOpen(false);
      setSelectedWallet(null);
      setEditWalletName("");
      fetchWallets();
    } catch (error) {
      toast.error("Failed to update wallet");
    }
  };

  // Delete wallet
  const handleDeleteWallet = async () => {
    if (!selectedWallet) return;

    try {
      const response = await fetch(`/api/wallets/${selectedWallet.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete wallet");

      toast.success("Wallet deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedWallet(null);
      fetchWallets();
    } catch (error) {
      toast.error("Failed to delete wallet");
    }
  };

  // Open edit dialog
  const openEditDialog = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setEditWalletName(wallet.name);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setIsDeleteDialogOpen(true);
  };

  // Load wallets on component mount
  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Wallets</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Wallet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Wallet</DialogTitle>
              <DialogDescription>
                Add a new wallet to manage your finances.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Wallet Name</Label>
                <Input
                  id="name"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="Enter wallet name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateWallet}>Create Wallet</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
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
            {wallets.map((wallet) => (
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
                    onClick={() => openEditDialog(wallet)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(wallet)}
                  >
                    <Trash2 className="h-4 w-4" />
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
            <DialogDescription>
              Make changes to your wallet here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Wallet Name</Label>
              <Input
                id="edit-name"
                value={editWalletName}
                onChange={(e) => setEditWalletName(e.target.value)}
                placeholder="Enter wallet name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateWallet}>Save Changes</Button>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              wallet and all associated transactions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWallet}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
