"use client";

import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "../wallet-context";

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

interface TransactionType {
  id: string;
  name: string;
  type: string;
}

interface TransactionMeta {
  subcategories: Subcategory[];
  transactionTypes: TransactionType[];
}

export function AddShortcutDialog() {
  const { toast } = useToast();
  const { activeWallet } = useWallet();
  const [activeTab, setActiveTab] = useState<"income" | "outcome">("income");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meta, setMeta] = useState<TransactionMeta | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    note: "",
    description: "",
    subcategoryId: "",
    transactionTypeId: "",
  });

  // Fetch metadata on component mount or when tab changes
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await fetch(`/api/transaction-meta?type=${activeTab}`);
        if (!response.ok) throw new Error("Failed to fetch metadata");
        const data = await response.json();
        setMeta(data);
        
        // Reset form data when switching tabs
        setFormData({
          amount: "",
          note: "",
          description: "",
          subcategoryId: "",
          transactionTypeId: "",
        });
      } catch (error) {
        console.error("Error fetching metadata:", error);
        toast({
          title: "Error",
          description: "Failed to load transaction metadata",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchMeta();
    }
  }, [open, activeTab, toast]);

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!activeWallet) {
        toast({
          title: "Error",
          description: "Please select a wallet first",
          variant: "destructive",
        });
        return;
      }

      // Basic validation
      if (!formData.amount || !formData.subcategoryId || !formData.transactionTypeId) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Get the category ID from the selected subcategory
      const selectedSubcategory = meta?.subcategories.find(
        (sub) => sub.id === formData.subcategoryId
      );

      if (!selectedSubcategory) {
        toast({
          title: "Error",
          description: "Invalid subcategory selected",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for API
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        walletId: activeWallet.id,
        categoryId: selectedSubcategory.categoryId,
        period: new Date().toISOString(),
      };

      // Call API
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      toast({
        title: "Success",
        description: "Transaction created successfully!",
      });

      // Reset form and close dialog
      setFormData({
        amount: "",
        note: "",
        description: "",
        subcategoryId: "",
        transactionTypeId: "",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter transaction types based on active tab
  const filteredTransactionTypes = meta?.transactionTypes.filter(
    (type) => type.type === activeTab
  ) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Create a new income or expense transaction.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="income"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "income" | "outcome")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="outcome">Expense</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="col-span-3"
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subcategory" className="text-right">
                  Category
                </Label>
                <Select
                  value={formData.subcategoryId}
                  onValueChange={(value) => handleChange("subcategoryId", value)}
                >
                  <SelectTrigger id="subcategory" className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {meta?.subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name} ({subcategory.category.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transactionType" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.transactionTypeId}
                  onValueChange={(value) => handleChange("transactionTypeId", value)}
                >
                  <SelectTrigger id="transactionType" className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTransactionTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="note" className="text-right">
                  Note
                </Label>
                <Input
                  id="note"
                  placeholder="Optional note"
                  className="col-span-3"
                  value={formData.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Optional description"
                  className="col-span-3"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            className="mr-2"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
