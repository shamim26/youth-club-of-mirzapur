"use client";

import { useState } from "react";
import { EventAccountExpense } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  addEventExpense,
  updateEventExpense,
  deleteEventExpense,
} from "../actions";
import { toast } from "sonner";
import { Trash2, Plus, ArrowDownRight, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
});

export function ExpenseSection({
  eventId,
  expenses,
  loadingData,
  totalExpense,
  onDataChange,
}: {
  eventId: string;
  expenses: EventAccountExpense[];
  loadingData: boolean;
  totalExpense: number;
  onDataChange: (eventId: string) => void;
}) {
  const [editingExpense, setEditingExpense] =
    useState<EventAccountExpense | null>(null);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [isUpdatingExpense, setIsUpdatingExpense] = useState(false);

  const expenseForm = useForm<z.infer<typeof expenseSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: { description: "", amount: 0 },
  });

  const editExpenseForm = useForm<z.infer<typeof expenseSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(expenseSchema) as any,
    defaultValues: { description: "", amount: 0 },
  });

  const onAddExpense = async (values: z.infer<typeof expenseSchema>) => {
    setIsSubmittingExpense(true);
    const result = await addEventExpense(
      eventId,
      values.description,
      values.amount,
    );
    if (result.success) {
      toast.success("Expense added");
      expenseForm.reset();
      onDataChange(eventId);
    } else {
      toast.error("Failed to add expense");
    }
    setIsSubmittingExpense(false);
  };

  const openEditExpense = (expense: EventAccountExpense) => {
    setEditingExpense(expense);
    editExpenseForm.reset({
      description: expense.description,
      amount: Number(expense.amount),
    });
  };

  const onUpdateExpense = async (values: z.infer<typeof expenseSchema>) => {
    if (!editingExpense) return;

    setIsUpdatingExpense(true);
    const result = await updateEventExpense(
      editingExpense.id,
      values.description,
      values.amount,
    );
    if (result.success) {
      toast.success("Expense updated");
      setEditingExpense(null);
      onDataChange(eventId);
    } else {
      toast.error("Failed to update expense");
    }
    setIsUpdatingExpense(false);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense entry?")) return;
    const result = await deleteEventExpense(id);
    if (result.success) {
      toast.success("Expense deleted");
      onDataChange(eventId);
    } else {
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="print:shadow-none print:border-0 print:m-0 print:p-0">
        <CardHeader className="print:p-0 print:pb-2 print:border-b print:border-black print:mb-4">
          <CardTitle className="text-xl flex items-center gap-2 text-rose-600 print:text-black">
            <ArrowDownRight className="w-5 h-5" /> Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 print:p-0">
          <div className="overflow-x-auto">
            <Table className="print:text-black print:border print:border-collapse print:border-gray-300">
              <TableHeader className="bg-muted/50 print:bg-white">
                <TableRow className="print:border-b print:border-gray-300">
                  <TableHead className="print:border print:border-gray-300">
                    Description
                  </TableHead>
                  <TableHead className="text-right print:border print:border-gray-300">
                    Amount (Tk)
                  </TableHead>
                  <TableHead className="text-right print:hidden">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="print:divide-gray-300">
                {loadingData ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-4 text-muted-foreground"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : expenses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground print:text-black"
                    >
                      No expense entries yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors print:hover:bg-white"
                    >
                      <TableCell className="font-medium print:border print:border-gray-300">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-right text-rose-600 dark:text-rose-400 font-semibold print:text-black print:border print:border-gray-300">
                        {Number(item.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right print:hidden">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => openEditExpense(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950"
                            onClick={() => handleDeleteExpense(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {/* Print Total Row */}
                <TableRow className="hidden print:table-row font-bold hover:bg-transparent">
                  <TableCell className="px-4 py-2 print:border-t print:border-gray-800">
                    Total Expense
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    {totalExpense.toLocaleString()}
                  </TableCell>
                  <TableCell className="print:hidden"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Form */}
      <Card className="print:hidden border-dashed bg-rose-500/5 border-rose-500/20">
        <CardHeader>
          <CardTitle className="text-base text-rose-700 dark:text-rose-400">
            Add Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...expenseForm}>
            <form
              onSubmit={expenseForm.handleSubmit(onAddExpense)}
              className="space-y-4"
            >
              <FormField
                control={expenseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Food / Decor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={expenseForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (Tk)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="1500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmittingExpense}
                variant="destructive"
                className="w-full gap-2 mt-4"
              >
                <Plus className="w-4 h-4" />
                {isSubmittingExpense ? "Adding..." : "Add Expense"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Edit Expense Dialog */}
      <Dialog
        open={!!editingExpense}
        onOpenChange={(open) => !open && setEditingExpense(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <Form {...editExpenseForm}>
            <form
              onSubmit={editExpenseForm.handleSubmit(onUpdateExpense)}
              className="space-y-4"
            >
              <FormField
                control={editExpenseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Food / Decor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editExpenseForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (Tk)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="1500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setEditingExpense(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingExpense}>
                  {isUpdatingExpense ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
