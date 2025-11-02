import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
}

export default function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card className="glass-glow hover:glass-light transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && (
            <div className="text-primary bg-primary/10 rounded-lg p-2 glass-light">{icon}</div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
