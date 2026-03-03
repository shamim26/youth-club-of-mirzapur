"use client";

import { useState, useCallback } from "react";
import {
  YouthEvent,
  EventAccountIncome,
  EventAccountExpense,
} from "@/types/events";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Printer } from "lucide-react";
import { format } from "date-fns";

// Extracted Components
import { SummaryCards } from "./_components/SummaryCards";
import { IncomeSection } from "./_components/IncomeSection";
import { ExpenseSection } from "./_components/ExpenseSection";

export function AccountsClient({
  initialEvents,
}: {
  initialEvents: YouthEvent[];
}) {
  const supabase = createClient();
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [incomes, setIncomes] = useState<EventAccountIncome[]>([]);
  const [expenses, setExpenses] = useState<EventAccountExpense[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const fetchLedgerData = useCallback(
    async (eventId: string) => {
      setLoadingData(true);

      const { data: incomeData, error: incomeErr } = await supabase
        .from("event_accounts_income")
        .select("*")
        .eq("event_id", eventId)
        .order("date_added", { ascending: true });

      if (incomeErr) {
        toast.error("Failed to load income");
        console.error(incomeErr);
      } else {
        setIncomes(incomeData || []);
      }

      const { data: expenseData, error: expenseErr } = await supabase
        .from("event_accounts_expenses")
        .select("*")
        .eq("event_id", eventId)
        .order("date_added", { ascending: true });

      if (expenseErr) {
        toast.error("Failed to load expenses");
        console.error(expenseErr);
      } else {
        setExpenses(expenseData || []);
      }

      setLoadingData(false);
    },
    [supabase],
  );

  const handleEventChange = (value: string) => {
    setSelectedEventId(value);
    if (value) {
      fetchLedgerData(value);
    } else {
      setIncomes([]);
      setExpenses([]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalIncome = incomes.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );
  const totalExpense = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );
  const balance = totalIncome - totalExpense;
  const isPositive = balance >= 0;

  const selectedEvent = initialEvents.find((e) => e.id === selectedEventId);

  return (
    <div className="space-y-8">
      {/* Event Selection */}
      <Card className="print:hidden border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
          <CardDescription>
            Choose an event to manage its accounts and ledger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedEventId} onValueChange={handleEventChange}>
            <SelectTrigger className="w-full md:w-[400px] bg-background">
              <SelectValue placeholder="Select an event..." />
            </SelectTrigger>
            <SelectContent>
              {initialEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}{" "}
                  {event.event_date
                    ? `(${format(new Date(event.event_date), "MMM dd, yyyy")})`
                    : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Ledger UI */}
      {selectedEventId && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center print:hidden">
            <h2 className="text-2xl font-bold tracking-tight">
              Ledger for {selectedEvent?.title}
            </h2>
            <Button onClick={handlePrint} variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              Print Ledger
            </Button>
          </div>

          {/* Print Header */}
          <div className="hidden print:flex flex-col items-center justify-center text-center mb-8 pb-6 border-b-2 border-black/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-x.png"
              alt="Youth Club of Mirzapur"
              className="w-15 h-15 rounded-full mb-4 print:grayscale object-cover"
            />
            <h1 className="text-3xl font-bold uppercase tracking-widest text-black">
              Youth Club of Mirzapur
            </h1>
            <h2 className="text-xl mt-2 text-black/80 font-medium">
              {selectedEvent?.title}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Generated on {format(new Date(), "dd MMMM, yyyy | hh:mm a")}
            </p>
          </div>

          {/* Summary Cards Component */}
          <div className="print:hidden">
            <SummaryCards
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              balance={balance}
              isPositive={isPositive}
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2 print:grid-cols-2 print:gap-4">
            {/* Income Section Component */}
            <IncomeSection
              eventId={selectedEventId}
              incomes={incomes}
              loadingData={loadingData}
              totalIncome={totalIncome}
              onDataChange={fetchLedgerData}
            />

            {/* Expenses Section Component */}
            <ExpenseSection
              eventId={selectedEventId}
              expenses={expenses}
              loadingData={loadingData}
              totalExpense={totalExpense}
              onDataChange={fetchLedgerData}
            />
          </div>
          <div className="hidden print:block print:text-black font-bold text-center mt-5">
            <p>Remaining Amount: {balance} Tk</p>
          </div>

          <div className="hidden print:block mt-16 text-center text-sm text-gray-600">
            <p className="italic">
              Prepared by the Admins of Youth Club of Mirzapur.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
