'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  messId: string;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  addedBy: User;
  date: string;
}

export default function ExpensesPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messId, setMessId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUserAndExpenses();
  }, [router]);

  const fetchUserAndExpenses = async () => {
    try {
      setLoading(true);
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      const id = profileRes.data.messId;
      setMessId(id);

      const expensesRes = await apiClient.get<Expense[]>(`/expenses/mess/${id}`);
      if (expensesRes.data) {
        setExpenses(expensesRes.data);
      }
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-green-100 text-green-800',
      utilities: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Expenses</h2>
                <p className="text-muted-foreground">Track and manage expenses</p>
              </div>
              <Link href="/dashboard/expenses/add">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Expense
                </Button>
              </Link>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Expense Records</CardTitle>
                <CardDescription>All expenses for this mess</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">No expenses recorded yet</p>
                    <Link href="/dashboard/expenses/add">
                      <Button>Add First Expense</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.map((expense) => (
                      <div
                        key={expense._id}
                        className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{expense.description}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                                expense.category
                              )}`}
                            >
                              {expense.category}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Added by {expense.addedBy.name} on{' '}
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-primary">₹{expense.amount}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
