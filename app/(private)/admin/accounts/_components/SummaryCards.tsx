import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SummaryCards({
  totalIncome,
  totalExpense,
  balance,
  isPositive,
}: {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  isPositive: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3 print:grid-cols-3 print:gap-4">
      <Card className="bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-100 print:bg-white print:border-gray-300 print:text-black print:shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4" /> Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            <span className="mr-1">৳</span>
            {totalIncome.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-100 print:bg-white print:border-gray-300 print:text-black print:shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4" /> Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            <span className="mr-1">৳</span>
            {totalExpense.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "border-2 print:bg-white print:text-black print:shadow-none print:border-gray-500",
          isPositive
            ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
            : "border-rose-500 text-rose-600 dark:text-rose-400",
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold flex items-center">
            <span className="mr-1">৳</span>
            {balance.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
