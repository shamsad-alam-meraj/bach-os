import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

interface ExpenseBreakdownProps {
  expenseBreakdown: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
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
                key={category._id}
                className="flex items-center justify-between p-3 glass-light rounded-lg"
              >
                <div>
                  <p className="font-medium capitalize">{category._id}</p>
                  <p className="text-sm text-muted-foreground">{category.count} transactions</p>
                </div>
                <p className="font-semibold text-lg">৳{category.totalAmount}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
