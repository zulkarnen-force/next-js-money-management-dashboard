"use client";

import { useState } from "react";
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
import { createShortcut, ShortcutData } from "@/lib/api";

export function AddShortcutDialog() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"income" | "expense">("income");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    income: {
      name: "",
      amount: "",
      category: "",
    },
    expense: {
      name: "",
      amount: "",
      category: "",
    },
  });

  // Handle input changes
  const handleChange = (
    tab: "income" | "expense",
    field: "name" | "amount" | "category",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const currentForm = formData[activeTab];

      // Basic validation
      if (!currentForm.name || !currentForm.amount || !currentForm.category) {
        toast({
          title: "Validation Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for API
      const shortcutData: ShortcutData = {
        type: activeTab,
        name: currentForm.name,
        amount: Number.parseFloat(currentForm.amount),
        category: currentForm.category,
      };

      // Call API function
      console.info(shortcutData);
      const result = await createShortcut(shortcutData);

      if (result.success) {
        toast({
          title: "Success",
          description: `${
            activeTab === "income" ? "Income" : "Expense"
          } shortcut created successfully!`,
        });

        // Reset form and close dialog
        setFormData({
          income: { name: "", amount: "", category: "" },
          expense: { name: "", amount: "", category: "" },
        });
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create shortcut",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Icon
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Shortcut</DialogTitle>
          <DialogDescription>
            Create a new income or expense shortcut for quick access.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="income"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "income" | "expense")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>

          <TabsContent value="income" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="income-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="income-name"
                  placeholder="Salary"
                  className="col-span-3"
                  value={formData.income.name}
                  onChange={(e) =>
                    handleChange("income", "name", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="income-amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="income-amount"
                  type="number"
                  placeholder="0.00"
                  className="col-span-3"
                  value={formData.income.amount}
                  onChange={(e) =>
                    handleChange("income", "amount", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="income-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={formData.income.category}
                  onValueChange={(value) =>
                    handleChange("income", "category", value)
                  }
                >
                  <SelectTrigger id="income-category" className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expense" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="expense-name"
                  placeholder="Groceries"
                  className="col-span-3"
                  value={formData.expense.name}
                  onChange={(e) =>
                    handleChange("expense", "name", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense-amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  className="col-span-3"
                  value={formData.expense.amount}
                  onChange={(e) =>
                    handleChange("expense", "amount", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense-category" className="text-right">
                  Category
                </Label>
                <Select
                  value={formData.expense.category}
                  onValueChange={(value) =>
                    handleChange("expense", "category", value)
                  }
                >
                  <SelectTrigger id="expense-category" className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
            {isSubmitting ? "Saving..." : "Save shortcut"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
