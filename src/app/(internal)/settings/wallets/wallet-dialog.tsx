"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
export default function WalletDialog() {
  const [newWalletName, setNewWalletName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
    } catch {
      toast.error("Failed to create wallet");
    }
  };
  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Wallet</DialogTitle>
          <DialogDescription>Add a new wallet.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Wallet Name</Label>
          <Input
            value={newWalletName}
            onChange={(e) => setNewWalletName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
