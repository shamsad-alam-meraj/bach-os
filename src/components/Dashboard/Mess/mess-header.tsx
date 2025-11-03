import { Mess, User } from '@/types/types';
import { Calendar, Crown } from 'lucide-react';
import AdminControls from '../Admin/admin-controls';

interface MessHeaderProps {
  mess: Mess;
  user: User;
  calculationBreakdown: any;
  onCreateMess: () => void;
  onDeleteMess: () => void;
  onDataCleanup: () => void;
}

export default function MessHeader({
  mess,
  user,
  calculationBreakdown,
  onCreateMess,
  onDeleteMess,
  onDataCleanup,
}: MessHeaderProps) {
  const isAdmin = user?.role === 'admin';
  const currentMealRate = calculationBreakdown?.mealRate || 0;

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold">{mess.name}</h2>
            {isAdmin && <Crown className="w-6 h-6 text-yellow-500" />}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-muted-foreground">
              Current Meal Rate: <strong className="text-primary">৳{currentMealRate}</strong> per
              meal
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {calculationBreakdown?.period.month ||
                new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
            </div>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                isAdmin
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : user?.role === 'manager'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-secondary/20 text-secondary'
              }`}
            >
              {isAdmin ? 'Admin' : user?.role === 'manager' ? 'Manager' : 'Member'}
            </span>
          </div>
          {mess.description && <p className="text-muted-foreground mt-2">{mess.description}</p>}
        </div>

        <AdminControls
          isAdmin={isAdmin}
          onCreateMess={onCreateMess}
          onDeleteMess={onDeleteMess}
          onDataCleanup={onDataCleanup}
        />
      </div>
    </div>
  );
}
