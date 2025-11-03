import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserWelcomeCardProps {
  userEmail?: string;
}

export default function UserWelcomeCard({ userEmail }: UserWelcomeCardProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Welcome to Mess Manager</CardTitle>
        <CardDescription>
          You need to be added to a mess by a manager to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please contact your mess manager and ask them to add you using your email:{' '}
          <strong>{userEmail}</strong>
        </p>
        <div className="p-4 glass-light bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Only admins can create new messes. Regular users need to be
            invited by an existing mess manager.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
