import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface MealRateCalculationProps {
  calculationBreakdown: {
    totalExpenses: number;
    totalMeals: number;
    mealRate: number;
    formula: string;
    period: {
      month: string;
    };
  };
}

export default function MealRateCalculation({ calculationBreakdown }: MealRateCalculationProps) {
  if (!calculationBreakdown) return null;

  return (
    <Card className="glass-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Meal Rate Calculation
        </CardTitle>
        <CardDescription>
          How your meal rate is calculated for {calculationBreakdown.period.month}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 glass-light bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
            <p className="font-semibold text-blue-800 dark:text-blue-200">Total Expenses</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ৳{calculationBreakdown.totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 glass-light bg-green-50/50 dark:bg-green-900/20 rounded-lg">
            <p className="font-semibold text-green-800 dark:text-green-200">Total Meals</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {calculationBreakdown.totalMeals}
            </p>
          </div>
          <div className="text-center p-4 glass-light bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
            <p className="font-semibold text-purple-800 dark:text-purple-200">Meal Rate</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ৳{calculationBreakdown.mealRate}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {calculationBreakdown.formula}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
