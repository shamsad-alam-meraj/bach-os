'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Users, DollarSign, UtensilsCrossed } from 'lucide-react';
import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface User {
  _id: string;
  name: string;
  email: string;
  messId: string;
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

interface MemberStats {
  name: string;
  meals: number;
  cost: number;
}

interface CategoryStats {
  name: string;
  value: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [messId, setMessId] = useState('');
  const [mealRate, setMealRate] = useState(30);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4853', '#f59e0b', '#10b981', '#06b6d4'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchAnalyticsData();
  }, [router]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      const id = profileRes.data.messId;
      setMessId(id);

      // Fetch mess details for meal rate
      const messRes = await apiClient.get<any>(`/mess/${id}`);
      if (messRes.data) {
        setMealRate(messRes.data.mealRate);
      }

      // Fetch current month meals
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const mealsRes = await apiClient.get<Meal[]>(
        `/meals/mess/${id}/month?year=${year}&month=${month}`
      );
      if (mealsRes.data) {
        setMeals(mealsRes.data);
      }

      // Fetch expenses
      const expensesRes = await apiClient.get<Expense[]>(`/expenses/mess/${id}`);
      if (expensesRes.data) {
        setExpenses(expensesRes.data);
      }
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate member statistics
  const calculateMemberStats = (): MemberStats[] => {
    const memberMap = new Map<string, { name: string; meals: number }>();

    meals.forEach((meal) => {
      const key = meal.userId._id;
      const totalMeals = meal.breakfast + meal.lunch + meal.dinner;
      if (memberMap.has(key)) {
        const existing = memberMap.get(key)!;
        memberMap.set(key, {
          name: existing.name,
          meals: existing.meals + totalMeals,
        });
      } else {
        memberMap.set(key, {
          name: meal.userId.name,
          meals: totalMeals,
        });
      }
    });

    return Array.from(memberMap.values()).map((stat) => ({
      name: stat.name,
      meals: stat.meals,
      cost: stat.meals * mealRate,
    }));
  };

  // Calculate category statistics
  const calculateCategoryStats = (): CategoryStats[] => {
    const categoryMap = new Map<string, number>();

    expenses.forEach((expense) => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  };

  // Calculate daily meal trends
  const calculateDailyTrends = () => {
    const dailyMap = new Map<string, number>();

    meals.forEach((meal) => {
      const date = new Date(meal.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const totalMeals = meal.breakfast + meal.lunch + meal.dinner;
      const current = dailyMap.get(date) || 0;
      dailyMap.set(date, current + totalMeals);
    });

    return Array.from(dailyMap.entries())
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, meals]) => ({
        date,
        meals,
      }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const memberStats = calculateMemberStats();
  const categoryStats = calculateCategoryStats();
  const dailyTrends = calculateDailyTrends();

  const totalMeals = meals.reduce(
    (sum, meal) => sum + meal.breakfast + meal.lunch + meal.dinner,
    0
  );
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalMembers = new Set(meals.map((m) => m.userId._id)).size;
  const avgMealsPerMember = totalMembers > 0 ? (totalMeals / totalMembers).toFixed(1) : 0;

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
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Analytics</h2>
              <p className="text-muted-foreground">Detailed insights and statistics</p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Meals
                    <UtensilsCrossed className="w-4 h-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalMeals}</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Expenses
                    <DollarSign className="w-4 h-4 text-secondary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{totalExpenses}</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Active Members
                    <Users className="w-4 h-4 text-accent" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalMembers}</div>
                  <p className="text-xs text-muted-foreground mt-1">With meals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Avg Per Member
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{avgMealsPerMember}</div>
                  <p className="text-xs text-muted-foreground mt-1">Meals per person</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Daily Meal Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Meal Trends</CardTitle>
                  <CardDescription>Meals consumed per day</CardDescription>
                </CardHeader>
                <CardContent>
                  {dailyTrends.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dailyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="meals" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Expense Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>By category</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ₹${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Member Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Member Statistics</CardTitle>
                <CardDescription>Meals and costs per member</CardDescription>
              </CardHeader>
              <CardContent>
                {memberStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={memberStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="meals" fill="#3b82f6" name="Meals" />
                      <Bar yAxisId="right" dataKey="cost" fill="#8b5cf6" name="Cost (₹)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No data available
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
