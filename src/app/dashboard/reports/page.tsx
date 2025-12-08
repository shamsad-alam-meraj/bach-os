'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { dashboardService } from '@/services/dashboard';
import { ReportData } from '@/types/api';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  DollarSign,
  Download,
  TrendingDown,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ReportParams {
  type: 'monthly' | 'member' | 'expense';
  month?: number;
  year?: number;
  startDate?: string;
  endDate?: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportsData, setReportsData] = useState<ReportData | null>(null);
  const [reportParams, setReportParams] = useState<ReportParams>({
    type: 'monthly',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchReportData();
  }, [router]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const profileRes = await apiClient.get<any>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      const messId = profileRes.data.messId;

      // Fetch reports data using dashboard service
      const reportsRes = await dashboardService.generateReport(messId, reportParams);
      if (reportsRes.data) {
        setReportsData(reportsRes.data);
      } else {
        setError('Failed to load reports data');
      }
    } catch (err) {
      setError('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportsData) return;

    const { memberReports, summary } = reportsData;

    let csv = `Member Settlement Report - ${summary.period.month}\n\n`;
    csv += 'Name,Email,Meals Taken,Total Deposit,Meal Cost,Balance\n';

    memberReports.forEach((member) => {
      csv += `"${member.name}","${member.email}",${member.totalMeals},${member.totalDeposit},${member.mealCost.toFixed(2)},${member.balance.toFixed(2)}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `meal-report-${summary.period.month.replace(' ', '-')}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!reportsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No reports data available</p>
        </div>
      </div>
    );
  }

  const { summary, memberReports, detailedExpenses, detailedDeposits } = reportsData;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Reports</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Settlement and detailed reports for {summary.period.month}
                </p>
              </div>
              <Button onClick={downloadReport} className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Members
                    <Users className="w-4 h-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.totalMembers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active members</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Total Meals
                    <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{summary.totalMeals}</div>
                  <p className="text-xs text-muted-foreground mt-1">Meals served</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Total expenses</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Total deposits</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Meal Rate
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">৳{summary.mealRate}</div>
                  <p className="text-xs text-muted-foreground mt-1">Per meal cost</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Net Balance
                    <DollarSign className="w-4 h-4 text-purple-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">৳{summary.calculations?.netBalance?.toFixed(2) || '0.00'}</div>
                  <p className="text-xs text-muted-foreground mt-1">Overall balance</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Expense Per Member
                    <Users className="w-4 h-4 text-indigo-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">৳{summary.calculations?.expensePerMember || '0.00'}</div>
                  <p className="text-xs text-muted-foreground mt-1">Average share</p>
                </CardContent>
              </Card>
            </div>

            {/* Member Reports */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle>Member Settlement Report</CardTitle>
                <CardDescription>Balance = Total Deposit - Meal Cost</CardDescription>
              </CardHeader>
              <CardContent>
                {memberReports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No member data available</div>
                ) : (
                  <div className="space-y-4">
                    {memberReports.map((member, idx) => (
                      <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-light rounded-lg border border-white/20 dark:border-white/10 gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg">{member.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{member.email}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground/70">Meals</span>
                              <span className="font-medium">{member.totalMeals}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground/70">Deposit</span>
                              <span className="font-medium">৳{member.totalDeposit}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground/70">Meal Cost</span>
                              <span className="font-medium">৳{member.mealCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center justify-end gap-2 mb-2">
                            {member.balance >= 0 ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                            <span
                              className={`text-2xl font-bold ${
                                member.balance >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              ৳{Math.abs(member.balance).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {member.balance >= 0 ? 'Will receive' : 'Will pay'}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Expenses */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle>Detailed Expenses</CardTitle>
                <CardDescription>All expense transactions with details</CardDescription>
              </CardHeader>
              <CardContent>
                {detailedExpenses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No expenses recorded
                  </div>
                ) : (
                  <div className="space-y-4">
                    {detailedExpenses.map((expense, idx) => (
                      <motion.div
                        key={expense._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-light rounded-lg border border-white/20 dark:border-white/10 gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg">{expense.description}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap mt-2">
                            <div className="flex items-center gap-1">
                              <span>Category:</span>
                              <span className="font-medium capitalize">{expense.category}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Added by:</span>
                              <span className="font-medium">{expense.addedBy.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Date:</span>
                              <span className="font-medium">{new Date(expense.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-red-500">
                            ৳{expense.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expensed by {expense.expensedBy.name}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Deposits */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle>Detailed Deposits</CardTitle>
                <CardDescription>All deposit transactions with details</CardDescription>
              </CardHeader>
              <CardContent>
                {detailedDeposits.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No deposits recorded
                  </div>
                ) : (
                  <div className="space-y-4">
                    {detailedDeposits.map((deposit, idx) => (
                      <motion.div
                        key={deposit._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-light rounded-lg border border-white/20 dark:border-white/10 gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg">{deposit.description}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap mt-2">
                            <div className="flex items-center gap-1">
                              <span>Deposited by:</span>
                              <span className="font-medium">{deposit.userId.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Email:</span>
                              <span className="font-medium">{deposit.userId.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Date:</span>
                              <span className="font-medium">{new Date(deposit.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-green-500">
                            ৳{deposit.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Deposit
                          </p>
                        </div>
                      </motion.div>
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
