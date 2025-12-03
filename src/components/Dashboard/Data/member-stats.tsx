import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface MemberStatsProps {
  memberStats: Array<{
    userId: string;
    userName: string;
    totalMeals: number;
    daysWithMeals: number;
    avgMealsPerDay: string;
  }>;
}

export default function MemberStats({ memberStats }: MemberStatsProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Member Meal Statistics
        </CardTitle>
        <CardDescription>Individual meal consumption this month</CardDescription>
      </CardHeader>
      <CardContent>
        {memberStats.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No meal data available</div>
        ) : (
          <div className="space-y-3">
            {memberStats.slice(0, 5).map((member) => (
              <div
                key={member.userId}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 glass-light rounded-lg"
              >
                <div>
                  <p className="font-medium">{member.userName}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.daysWithMeals} days with meals
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-semibold">{member.totalMeals} meals</p>
                  <p className="text-xs text-muted-foreground">Avg: {member.avgMealsPerDay}/day</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
