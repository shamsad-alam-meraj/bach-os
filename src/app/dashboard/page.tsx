'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Users, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Mess {
  _id: string;
  name: string;
  members: User[];
  mealRate: number;
}

interface Meal {
  _id: string;
  userId: User;
  breakfast: number;
  lunch: number;
  dinner: number;
  date: string;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  addedBy: User;
  date: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mess, setMess] = useState<Mess | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setIsAuthenticated(true);
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error) {
        setError(profileRes.error);
        return;
      }

      const user = profileRes.data;
      if (!user?.messId) {
        // User doesn't have a mess yet
        setLoading(false);
        return;
      }

      // Fetch mess details
      const messRes = await apiClient.get<Mess>(`/mess/${user.messId}`);
      if (messRes.data) {
        setMess(messRes.data);
      }

      // Fetch current month meals
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const mealsRes = await apiClient.get<Meal[]>(
        `/meals/mess/${user.messId}/month?year=${year}&month=${month}`
      );
      if (mealsRes.data) {
        setMeals(mealsRes.data);
      }

      // Fetch expenses
      const expensesRes = await apiClient.get<Expense[]>(`/expenses/mess/${user.messId}`);
      if (expensesRes.data) {
        setExpenses(expensesRes.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalMembers = mess?.members.length || 0;
  const totalMeals = meals.reduce(
    (sum, meal) => sum + meal.breakfast + meal.lunch + meal.dinner,
    0
  );
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgPerMember = totalMembers > 0 ? (totalExpenses / totalMembers).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>
          )}

          {!mess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mt-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to Meal System</CardTitle>
                  <CardDescription>Create or join a mess to get started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You haven't joined a mess yet. Create a new one or ask someone to add you to
                    their mess.
                  </p>
                  <Link href="/dashboard/settings">
                    <Button className="w-full">Create Mess</Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">{mess.name}</h2>
                <p className="text-muted-foreground">Meal rate: ৳{mess.mealRate} per meal</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  title="Total Members"
                  value={totalMembers}
                  description="Active members"
                  icon={<Users className="w-5 h-5" />}
                />
                <StatCard
                  title="Total Meals"
                  value={totalMeals}
                  description="This month"
                  icon={<UtensilsCrossed className="w-5 h-5" />}
                />
                <StatCard
                  title="Total Expenses"
                  value={`৳${totalExpenses}`}
                  description="This month"
                  icon={<DollarSign className="w-5 h-5" />}
                />
                <StatCard
                  title="Avg Per Member"
                  value={`৳${avgPerMember}`}
                  description="Per month"
                  icon={<TrendingUp className="w-5 h-5" />}
                />
              </div>

              {/* Recent Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Meals</CardTitle>
                      <CardDescription>Latest meal entries</CardDescription>
                    </div>
                    <Link href="/dashboard/meals">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {meals.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No meals recorded yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {meals.slice(0, 5).map((meal) => (
                          <div
                            key={meal._id}
                            className="flex items-center justify-between p-3 bg-surface rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{meal.userId.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(meal.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {meal.breakfast + meal.lunch + meal.dinner} meals
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Expenses</CardTitle>
                      <CardDescription>Latest expense entries</CardDescription>
                    </div>
                    <Link href="/dashboard/expenses">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {expenses.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No expenses recorded yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {expenses.slice(0, 5).map((expense) => (
                          <div
                            key={expense._id}
                            className="flex items-center justify-between p-3 bg-surface rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {expense.addedBy.name}
                              </p>
                            </div>
                            <p className="font-semibold">৳{expense.amount}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
