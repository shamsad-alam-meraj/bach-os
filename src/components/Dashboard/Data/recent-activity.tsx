import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense, Meal } from '@/types/types';
import Link from 'next/link';

interface RecentActivityProps {
  type: 'meals' | 'expenses';
  title: string;
  description: string;
  data: Meal[] | Expense[];
  viewAllLink: string;
}

export default function RecentActivity({
  type,
  title,
  description,
  data,
  viewAllLink,
}: RecentActivityProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Link href={viewAllLink}>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No {type} recorded yet</div>
        ) : (
          <div className="space-y-4">
            {data.slice(0, 5).map((item) => (
              <RecentActivityItem key={item._id} type={type} data={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RecentActivityItemProps {
  type: 'meals' | 'expenses';
  data: Meal | Expense;
}

function RecentActivityItem({ type, data }: RecentActivityItemProps) {
  if (type === 'meals') {
    const meal = data as Meal;
    return (
      <div className="flex items-center justify-between p-3 glass-light rounded-lg">
        <div>
          <p className="font-medium">{meal.userId.name}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(meal.date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{meal.breakfast + meal.lunch + meal.dinner} meals</p>
          <p className="text-xs text-muted-foreground">
            B: {meal.breakfast} | L: {meal.lunch} | D: {meal.dinner}
          </p>
        </div>
      </div>
    );
  }

  const expense = data as Expense;
  return (
    <div className="flex items-center justify-between p-3 glass-light rounded-lg">
      <div className="flex-1">
        <p className="font-medium">{expense.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-muted-foreground">{expense.addedBy.name}</p>
          <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded capitalize">
            {expense.category}
          </span>
        </div>
      </div>
      <p className="font-semibold text-lg">৳{expense.amount}</p>
    </div>
  );
}
