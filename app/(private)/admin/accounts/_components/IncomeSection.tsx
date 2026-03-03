"use client";

import { useState } from "react";
import { EventAccountIncome } from "@/types/events";
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
  addEventIncome,
  updateEventIncome,
  deleteEventIncome,
} from "../actions";
import { toast } from "sonner";
import { Trash2, Plus, ArrowUpRight, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const incomeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
});

export function IncomeSection({
  eventId,
  incomes,
  loadingData,
  totalIncome,
  onDataChange,
}: {
  eventId: string;
  incomes: EventAccountIncome[];
  loadingData: boolean;
  totalIncome: number;
  onDataChange: (eventId: string) => void;
}) {
  const [editingIncome, setEditingIncome] = useState<EventAccountIncome | null>(
    null,
  );
  const [isSubmittingIncome, setIsSubmittingIncome] = useState(false);
  const [isUpdatingIncome, setIsUpdatingIncome] = useState(false);

  const incomeForm = useForm<z.infer<typeof incomeSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(incomeSchema) as any,
    defaultValues: { name: "", amount: 0 },
  });

  const editIncomeForm = useForm<z.infer<typeof incomeSchema>>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(incomeSchema) as any,
    defaultValues: { name: "", amount: 0 },
  });

  const onAddIncome = async (values: z.infer<typeof incomeSchema>) => {
    setIsSubmittingIncome(true);
    const result = await addEventIncome(eventId, values.name, values.amount);
    if (result.success) {
      toast.success("Income added");
      incomeForm.reset();
      onDataChange(eventId);
    } else {
      toast.error("Failed to add income");
    }
    setIsSubmittingIncome(false);
  };

  const openEditIncome = (income: EventAccountIncome) => {
    setEditingIncome(income);
    editIncomeForm.reset({
      name: income.person_name,
      amount: Number(income.amount),
    });
  };

  const onUpdateIncome = async (values: z.infer<typeof incomeSchema>) => {
    if (!editingIncome) return;

    setIsUpdatingIncome(true);
    const result = await updateEventIncome(
      editingIncome.id,
      values.name,
      values.amount,
    );
    if (result.success) {
      toast.success("Income updated");
      setEditingIncome(null);
      onDataChange(eventId);
    } else {
      toast.error("Failed to update income");
    }
    setIsUpdatingIncome(false);
  };

  const handleDeleteIncome = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income entry?")) return;
    const result = await deleteEventIncome(id);
    if (result.success) {
      toast.success("Income deleted");
      onDataChange(eventId);
    } else {
      toast.error("Failed to delete income");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="print:shadow-none print:border-0 print:m-0 print:p-0">
        <CardHeader className="print:p-0 print:pb-2 print:border-b print:border-black print:mb-4">
          <CardTitle className="text-xl flex items-center gap-2 text-emerald-600 print:text-black">
            <ArrowUpRight className="w-5 h-5" /> Income
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 print:p-0">
          <div className="overflow-x-auto">
            <Table className="print:text-black print:border print:border-collapse print:border-gray-300">
              <TableHeader className="bg-muted/50 print:bg-white">
                <TableRow className="print:border-b print:border-gray-300">
                  <TableHead className="print:border-r print:border-gray-300">
                    Name
                  </TableHead>
                  <TableHead className="print:hidden text-right">
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
                ) : incomes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground print:text-black"
                    >
                      No income entries yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  incomes.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors print:hover:bg-white"
                    >
                      <TableCell className="font-medium print:border print:border-gray-300">
                        {item.person_name}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600 dark:text-emerald-400 font-semibold print:hidden">
                        {Number(item.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right print:hidden">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => openEditIncome(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950"
                            onClick={() => handleDeleteIncome(item.id)}
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
                  <TableCell className="px-4 py-2 flex justify-between print:border-t">
                    <span>Total Income</span>
                    <span>{totalIncome.toLocaleString()} Tk</span>
                  </TableCell>
                  <TableCell className="print:hidden"></TableCell>
                  <TableCell className="print:hidden"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Income Form */}
      <Card className="print:hidden border-dashed bg-emerald-500/5 border-emerald-500/20">
        <CardHeader>
          <CardTitle className="text-base text-emerald-700 dark:text-emerald-400">
            Add Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...incomeForm}>
            <form
              onSubmit={incomeForm.handleSubmit(onAddIncome)}
              className="space-y-4"
            >
              <FormField
                control={incomeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Musfik" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={incomeForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (Tk)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmittingIncome}
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
              >
                <Plus className="w-4 h-4" />
                {isSubmittingIncome ? "Adding..." : "Add Income"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Edit Income Dialog */}
      <Dialog
        open={!!editingIncome}
        onOpenChange={(open) => !open && setEditingIncome(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          <Form {...editIncomeForm}>
            <form
              onSubmit={editIncomeForm.handleSubmit(onUpdateIncome)}
              className="space-y-4"
            >
              <FormField
                control={editIncomeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Musfik" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editIncomeForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (Tk)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="500"
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
                  onClick={() => setEditingIncome(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingIncome}>
                  {isUpdatingIncome ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
