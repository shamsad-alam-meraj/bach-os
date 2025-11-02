'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
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

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  addedBy: User;
  expensedBy: User;
  date: string;
}

interface Deposit {
  _id: string;
  userId: User;
  amount: number;
  description?: string;
  date: string;
}

interface MemberReport {
  name: string;
  email: string;
  totalMeals: number;
  mealCost: number;
  totalDeposit: number;
  expenseShare: number;
  balance: number;
}

interface ReportsData {
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
  memberReports: MemberReport[];
  detailedExpenses: Expense[];
  detailedDeposits: Deposit[];
  calculations: {
    expensePerMember: string;
    netBalance: number;
  };
}

export default function ReportsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);

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

      // Fetch reports data from backend
      const reportsRes = await apiClient.get<ReportsData>(`/reports/${messId}`);
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
    const month = summary.period.month;

    let csv = 'Member Settlement Report - ' + month + '\n\n';
    csv += 'Name,Email,Total Meals,Meal Cost (৳),Total Deposit (৳),Expense Share (৳),Balance (৳)\n';

    memberReports.forEach((report) => {
      csv += `"${report.name}","${report.email}",${report.totalMeals},${report.mealCost.toFixed(
        2
      )},${report.totalDeposit.toFixed(2)},${report.expenseShare.toFixed(
        2
      )},${report.balance.toFixed(2)}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `meal-report-${month.replace(' ', '-')}.csv`);
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

  const { summary, memberReports, detailedExpenses, detailedDeposits, calculations } = reportsData;

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
                <h2 className="text-3xl font-bold">Reports</h2>
                <p className="text-muted-foreground">
                  Settlement and detailed reports for {summary.period.month}
                </p>
              </div>
              <Button onClick={downloadReport} className="gap-2">
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
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

              <Card>
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

              <Card>
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

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Meal Rate
                    <Users className="w-4 h-4 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">৳{summary.mealRate}</div>
                  <p className="text-xs text-muted-foreground mt-1">Per meal</p>
                </CardContent>
              </Card>
            </div>

            {/* Settlement Report */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Member Settlement Report</CardTitle>
                <CardDescription>
                  Balance = Total Deposit - (Meal Cost + Expense Share of ৳
                  {calculations.expensePerMember})
                </CardDescription>
              </CardHeader>
              <CardContent>
                {memberReports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No data available</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Member</th>
                          <th className="text-center py-3 px-4 font-semibold">Meals</th>
                          <th className="text-right py-3 px-4 font-semibold">Meal Cost</th>
                          <th className="text-right py-3 px-4 font-semibold">Total Deposit</th>
                          <th className="text-right py-3 px-4 font-semibold">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {memberReports.map((report, idx) => (
                          <tr key={idx} className="border-b border-border hover:bg-surface/50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{report.name}</p>
                                <p className="text-xs text-muted-foreground">{report.email}</p>
                              </div>
                            </td>
                            <td className="text-center py-3 px-4">{report.totalMeals}</td>
                            <td className="text-right py-3 px-4">৳{report.mealCost.toFixed(2)}</td>
                            <td className="text-right py-3 px-4">
                              ৳{report.totalDeposit.toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                {report.balance >= 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                                <span
                                  className={`font-semibold ${
                                    report.balance >= 0 ? 'text-green-600' : 'text-red-600'
                                  }`}
                                >
                                  ৳{Math.abs(report.balance).toFixed(2)}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {report.balance >= 0 ? 'Will receive' : 'Will pay'}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expense Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
                <CardDescription>
                  All recorded expenses with expensed by information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {detailedExpenses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No expenses recorded
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Description</th>
                          <th className="text-left py-3 px-4 font-semibold">Category</th>
                          <th className="text-left py-3 px-4 font-semibold">Expensed By</th>
                          <th className="text-left py-3 px-4 font-semibold">Added By</th>
                          <th className="text-right py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedExpenses.map((expense) => (
                          <tr
                            key={expense._id}
                            className="border-b border-border hover:bg-surface/50"
                          >
                            <td className="py-3 px-4">{expense.description}</td>
                            <td className="py-3 px-4 capitalize">{expense.category}</td>
                            <td className="py-3 px-4">{expense?.expensedBy?.name}</td>
                            <td className="py-3 px-4">{expense.addedBy.name}</td>
                            <td className="text-right py-3 px-4 font-semibold">
                              ৳{expense.amount}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(expense.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deposit Details */}
            <Card>
              <CardHeader>
                <CardTitle>Deposit Details</CardTitle>
                <CardDescription>All member deposits</CardDescription>
              </CardHeader>
              <CardContent>
                {detailedDeposits.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No deposits recorded
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Member</th>
                          <th className="text-left py-3 px-4 font-semibold">Description</th>
                          <th className="text-right py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedDeposits.map((deposit) => (
                          <tr
                            key={deposit._id}
                            className="border-b border-border hover:bg-surface/50"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{deposit.userId.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {deposit.userId.email}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">{deposit.description || 'No description'}</td>
                            <td className="text-right py-3 px-4 font-semibold text-green-600">
                              ৳{deposit.amount}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(deposit.date).toLocaleDateString()}
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
