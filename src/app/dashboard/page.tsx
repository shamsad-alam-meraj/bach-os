'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Calculator,
  Calendar,
  DollarSign,
  PieChart,
  Users,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  messId?: string;
}

interface Mess {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  managerId: User;
  members: User[];
  mealRate: number;
  totalExpenses: number;
  totalMeals: number;
  totalDeposits: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
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

interface DashboardData {
  mess: Mess;
  monthlyStats: {
    totalMembers: number;
    totalMeals: number;
    totalExpenses: number;
    totalDeposits: number;
    mealRate: number;
    expenseCount: number;
    mealEntries: number;
    depositCount: number;
  };
  memberStats: Array<{
    userId: string;
    userName: string;
    totalMeals: number;
    daysWithMeals: number;
    avgMealsPerDay: string;
  }>;
  expenseBreakdown: Array<{
    _id: string;
    totalAmount: number;
    count: number;
  }>;
  recentMeals: Meal[];
  recentExpenses: Expense[];
  calculationBreakdown: {
    totalExpenses: number;
    totalMeals: number;
    mealRate: number;
    formula: string;
    period: {
      start: string;
      end: string;
      month: string;
    };
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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

      const userData = profileRes.data;
      setUser(userData);

      if (!userData?.messId) {
        setLoading(false);
        return;
      }

      // Fetch comprehensive dashboard data
      const dashboardRes = await apiClient.get<DashboardData>(`/dashboard/${userData.messId}`);
      if (dashboardRes.data) {
        setDashboardData(dashboardRes.data);
      } else {
        setError('Failed to load dashboard data');
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

  const mess = dashboardData?.mess;
  const monthlyStats = dashboardData?.monthlyStats;
  const memberStats = dashboardData?.memberStats || [];
  const expenseBreakdown = dashboardData?.expenseBreakdown || [];
  const recentMeals = dashboardData?.recentMeals || [];
  const recentExpenses = dashboardData?.recentExpenses || [];
  const calculationBreakdown = dashboardData?.calculationBreakdown;

  // All data comes from backend - no frontend calculations
  const totalMembers = monthlyStats?.totalMembers || 0;
  const totalMeals = monthlyStats?.totalMeals || 0;
  const totalExpenses = monthlyStats?.totalExpenses || 0;
  const totalDeposits = monthlyStats?.totalDeposits || 0;
  const currentMealRate = monthlyStats?.mealRate || 0;
  const expenseCount = monthlyStats?.expenseCount || 0;
  const mealEntries = monthlyStats?.mealEntries || 0;
  const depositCount = monthlyStats?.depositCount || 0;

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
            <div className="mb-6 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">{error}</div>
          )}

          {!mess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mt-12"
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Welcome to Meal System</CardTitle>
                  <CardDescription>
                    {user?.role === 'admin'
                      ? 'Create or join a mess to get started'
                      : 'Join a mess to get started'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user?.role === 'admin' ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        You haven't joined a mess yet. Create a new one or ask someone to add you to
                        their mess.
                      </p>
                      <Link href="/dashboard/settings">
                        <Button className="w-full">Create Mess</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        You need to be added to a mess by a manager. Please contact your mess
                        manager and ask them to add you using your email:{' '}
                        <strong>{user?.email}</strong>
                      </p>
                      <div className="p-4 glass-light bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Note:</strong> Only admins can create new messes. Regular users
                          need to be invited by an existing mess manager.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">{mess.name}</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-muted-foreground">
                    Current Meal Rate: <strong className="text-primary">৳{currentMealRate}</strong>{' '}
                    per meal
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {calculationBreakdown?.period.month ||
                      new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                  {user?.role === 'admin' || user?.role === 'manager' ? (
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                      {user?.role === 'admin' ? 'Admin' : 'Manager'}
                    </span>
                  ) : (
                    'Member'
                  )}
                </div>
                {mess.description && (
                  <p className="text-muted-foreground mt-2">{mess.description}</p>
                )}
              </div>

              {/* Main Stats Grid */}
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
                  description={`${mealEntries} entries`}
                  icon={<UtensilsCrossed className="w-5 h-5" />}
                />
                <StatCard
                  title="Total Expenses"
                  value={`৳${totalExpenses.toLocaleString()}`}
                  description={`${expenseCount} transactions`}
                  icon={<DollarSign className="w-5 h-5" />}
                />
                <StatCard
                  title="Total Deposits"
                  value={`৳${totalDeposits.toLocaleString()}`}
                  description={`${depositCount} deposits`}
                  icon={<Wallet className="w-5 h-5" />}
                />
              </div>

              {/* Meal Rate Calculation Card */}
              <Card className="glass-card mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Meal Rate Calculation
                  </CardTitle>
                  <CardDescription>
                    How your meal rate is calculated for {calculationBreakdown?.period.month}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-4 glass-light bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-semibold text-blue-800 dark:text-blue-200">Total Expenses</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ৳{calculationBreakdown?.totalExpenses.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 glass-light bg-green-50/50 dark:bg-green-900/20 rounded-lg">
                      <p className="font-semibold text-green-800 dark:text-green-200">Total Meals</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {calculationBreakdown?.totalMeals}
                      </p>
                    </div>
                    <div className="text-center p-4 glass-light bg-purple-50/50 dark:bg-purple-900/20 rounded-lg">
                      <p className="font-semibold text-purple-800 dark:text-purple-200">Meal Rate</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        ৳{calculationBreakdown?.mealRate}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                        {calculationBreakdown?.formula}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Insights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Member Meal Statistics */}
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
                      <div className="text-center py-8 text-muted-foreground">
                        No meal data available
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {memberStats.slice(0, 5).map((member) => (
                          <div
                            key={member.userId}
                            className="flex items-center justify-between p-3 glass-light rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{member.userName}</p>
                              <p className="text-sm text-muted-foreground">
                                {member.daysWithMeals} days with meals
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{member.totalMeals} meals</p>
                              <p className="text-xs text-muted-foreground">
                                Avg: {member.avgMealsPerDay}/day
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Expense Breakdown */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Expense Breakdown
                    </CardTitle>
                    <CardDescription>Spending by category this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {expenseBreakdown.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No expense data available
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {expenseBreakdown.slice(0, 5).map((category) => (
                          <div
                            key={category._id}
                            className="flex items-center justify-between p-3 glass-light rounded-lg"
                          >
                            <div>
                              <p className="font-medium capitalize">{category._id}</p>
                              <p className="text-sm text-muted-foreground">
                                {category.count} transactions
                              </p>
                            </div>
                            <p className="font-semibold text-lg">৳{category.totalAmount}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
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
                    {recentMeals.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No meals recorded yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentMeals.slice(0, 5).map((meal) => (
                          <div
                            key={meal._id}
                            className="flex items-center justify-between p-3 glass-light rounded-lg"
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
                              <p className="text-xs text-muted-foreground">
                                B: {meal.breakfast} | L: {meal.lunch} | D: {meal.dinner}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card">
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
                    {recentExpenses.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No expenses recorded yet
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentExpenses.slice(0, 5).map((expense) => (
                          <div
                            key={expense._id}
                            className="flex items-center justify-between p-3 glass-light rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{expense.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-muted-foreground">
                                  {expense.addedBy.name}
                                </p>
                                <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded capitalize">
                                  {expense.category}
                                </span>
                              </div>
                            </div>
                            <p className="font-semibold text-lg">৳{expense.amount}</p>
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
