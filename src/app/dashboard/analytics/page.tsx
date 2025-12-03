'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  DollarSign,
  TrendingDown,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AnalyticsData {
  summary: {
    totalMembers: number;
    totalMeals: number;
    totalExpenses: number;
    totalDeposits: number;
    mealRate: number;
    expenseCount: number;
    mealEntries: number;
    depositCount: number;
    period: {
      start: string;
      end: string;
      month: string;
    };
  };
  memberStats: Array<{
    name: string;
    meals: number;
    mealCost: number;
    totalDeposit: number;
    mealDays: number;
  }>;
  financialOverview: Array<{
    name: string;
    value: number;
  }>;
  categoryStats: Array<{
    name: string;
    value: number;
    count: number;
  }>;
  dailyTrends: Array<{
    date: string;
    meals: number;
  }>;
  calculations: {
    avgMealsPerMember: string;
    avgExpensePerMember: string;
    netBalance: number;
    mealCostPercentage: string;
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  const FINANCIAL_COLORS = ['#ef4444', '#10b981']; // Red for expenses, Green for deposits
  const CATEGORY_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

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
      const profileRes = await apiClient.get<any>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      const messId = profileRes.data.messId;

      // Fetch analytics data from backend
      const analyticsRes = await apiClient.get<AnalyticsData>(`/analytics/${messId}`);
      if (analyticsRes.data) {
        setAnalyticsData(analyticsRes.data);
      } else {
        setError('Failed to load analytics data');
      }
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
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

  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    );
  }

  const { summary, memberStats, financialOverview, categoryStats, dailyTrends, calculations } =
    analyticsData;

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
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">Analytics</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Detailed insights and statistics for {summary.period.month}
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Meals
                    <UtensilsCrossed className="w-4 h-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.totalMeals}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.mealEntries} entries
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Expenses
                    <DollarSign className="w-4 h-4 text-red-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ৳{summary.totalExpenses.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.expenseCount} transactions
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Deposits
                    <Wallet className="w-4 h-4 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ৳{summary.totalDeposits.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {summary.depositCount} deposits
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Net Balance
                    {calculations.netBalance >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-3xl font-bold ${
                      calculations.netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ৳{calculations.netBalance.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {calculations.netBalance >= 0 ? 'Surplus' : 'Deficit'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg Meals Per Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{calculations.avgMealsPerMember}</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg Expense Per Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">৳{calculations.avgExpensePerMember}</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Current Meal Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">৳{summary.mealRate}</div>
                  <p className="text-xs text-muted-foreground mt-1">Per meal</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Financial Overview - Expenses vs Deposits */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Total Expenses vs Total Deposits</CardDescription>
                </CardHeader>
                <CardContent>
                  {financialOverview.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={financialOverview}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ৳${value.toLocaleString()}`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {financialOverview.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={FINANCIAL_COLORS[index % FINANCIAL_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`৳${value.toLocaleString()}`, 'Amount']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      No financial data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Expense Categories */}
              <Card className="glass-card">
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
                          label={({ name, value }) => `${name}: ৳${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryStats.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `৳${value}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      No expense data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Member Statistics - Meal Cost vs Deposits */}
            <Card className="glass-card mb-8">
              <CardHeader>
                <CardTitle>Member Financial Overview</CardTitle>
                <CardDescription>Meal Cost vs Total Deposits per member</CardDescription>
              </CardHeader>
              <CardContent>
                {memberStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={memberStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          `৳${value}`,
                          name === 'mealCost' ? 'Meal Cost' : 'Total Deposit',
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="mealCost"
                        fill="#ef4444"
                        name="Meal Cost"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="totalDeposit"
                        fill="#10b981"
                        name="Total Deposit"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No member data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Daily Meal Trends */}
            <Card className="glass-card">
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
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="meals"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Meals"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No meal data available
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
