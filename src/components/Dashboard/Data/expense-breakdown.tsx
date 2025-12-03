import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExpenseBreakdownItem } from '@/types/types';
import { PieChart } from 'lucide-react';

interface ExpenseBreakdownProps {
  expenseBreakdown: ExpenseBreakdownItem[];
}

export default function ExpenseBreakdown({ expenseBreakdown }: ExpenseBreakdownProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Expense Breakdown
        </CardTitle>
        <CardDescription>Spending by category this month</CardDescription>
      </CardHeader>
      <CardContent>
        {expenseBreakdown.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No expense data available</div>
        ) : (
          <div className="space-y-3">
            {expenseBreakdown.slice(0, 5).map((category) => (
              <div
                key={category.category}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 glass-light rounded-lg"
              >
                <div>
                  <p className="font-medium capitalize">{category.category}</p>
                  <p className="text-sm text-muted-foreground">{category.count} transactions</p>
                </div>
                <p className="font-semibold text-lg sm:text-right">৳{category.totalAmount}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
