interface AuthStateProps {
  message: string;
  userEmail?: string;
}

export default function AuthState({ message, userEmail }: AuthStateProps) {
  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <div className="p-4 glass-light bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {message}
          {userEmail && (
            <>
              {' '}
              Your email: <strong>{userEmail}</strong>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
