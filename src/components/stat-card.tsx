import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { StatCardProps } from '@/types/types';

export default function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card
      className="glass-card hover:glass-light transition-all"
      role="article"
      aria-labelledby={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle
            id={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-sm font-medium"
          >
            {title}
          </CardTitle>
          {icon && (
            <div
              className="text-primary bg-primary/10 rounded-lg p-2 glass-light"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold" aria-label={`${title} value: ${value}`}>
          {value}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
