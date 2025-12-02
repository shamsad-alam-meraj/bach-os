'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, TrendingUp, Users, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface DepositStats {
  monthly: {
    totalAmount: number;
    depositCount: number;
  };
  memberStats: Array<{
    userId: string;
    userName: string;
    totalAmount: number;
    depositCount: number;
  }>;
  period: {
    start: string;
    end: string;
    month: string;
  };
}

export default function DepositStatsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DepositStats | null>(null);
  const [messId, setMessId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchDepositStats();
  }, [router]);

  const fetchDepositStats = async () => {
    try {
      setLoading(true);

      // Fetch user profile to get messId
      const profileRes = await apiClient.get<any>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      const messId = profileRes.data.messId;
      setMessId(messId);

      // Fetch deposit stats
      const statsRes = await apiClient.get<DepositStats>(`/deposits/mess/${messId}/stats`);
      if (statsRes.data) {
        setStats(statsRes.data);
      } else {
        setError('Failed to load deposit statistics');
      }
    } catch (err) {
      setError('Failed to load deposit statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading deposit statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No deposit statistics available</p>
        </div>
      </div>
    );
  }

  const { monthly, memberStats, period } = stats;

  // Prepare chart data
  const chartData = memberStats.map((member) => ({
    name: member.userName.split(' ')[0], // Use first name for chart
    amount: member.totalAmount,
    count: member.depositCount,
  }));

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Deposit Statistics</h2>
                <p className="text-muted-foreground">
                  Detailed deposit analytics for {period.month}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Deposits
                    <Wallet className="w-4 h-4 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    ৳{monthly.totalAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This month
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Transactions
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monthly.depositCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Deposit entries
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Active Members
                    <Users className="w-4 h-4 text-purple-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{memberStats.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Made deposits
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Deposit Amounts by Member */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Deposit Amounts by Member</CardTitle>
                  <CardDescription>Total deposit amounts for each member</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`৳${value.toLocaleString()}`, 'Amount']}
                        />
                        <Bar
                          dataKey="amount"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      No deposit data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Deposit Count by Member */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Deposit Frequency by Member</CardTitle>
                  <CardDescription>Number of deposits made by each member</CardDescription>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${value}`, 'Count']}
                        />
                        <Bar
                          dataKey="count"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      No deposit data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Member Details Table */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Member Deposit Details</CardTitle>
                <CardDescription>Detailed breakdown of deposits by member</CardDescription>
              </CardHeader>
              <CardContent>
                {memberStats.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No member deposit data available</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Member</th>
                          <th className="text-right py-3 px-4 font-semibold">Total Amount</th>
                          <th className="text-right py-3 px-4 font-semibold">Deposit Count</th>
                          <th className="text-right py-3 px-4 font-semibold">Average per Deposit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memberStats.map((member, idx) => (
                          <tr
                            key={member.userId}
                            className="border-b border-white/10 dark:border-white/5 hover:bg-white/5"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                                  {member.userName.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{member.userName}</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4 font-semibold text-green-600">
                              ৳{member.totalAmount.toLocaleString()}
                            </td>
                            <td className="text-right py-3 px-4">{member.depositCount}</td>
                            <td className="text-right py-3 px-4">
                              ৳{member.depositCount > 0
                                ? (member.totalAmount / member.depositCount).toFixed(0)
                                : '0'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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