'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

interface MemberReport {
  name: string;
  email: string;
  totalMeals: number;
  totalCost: number;
  balance: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [messId, setMessId] = useState('');
  const [mealRate, setMealRate] = useState(30);
  const [members, setMembers] = useState<any[]>([]);

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
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      const id = profileRes.data.messId;
      setMessId(id);

      // Fetch mess details
      const messRes = await apiClient.get<any>(`/mess/${id}`);
      if (messRes.data) {
        setMealRate(messRes.data.mealRate);
        setMembers(messRes.data.members);
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
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const generateMemberReports = (): MemberReport[] => {
    const memberMap = new Map<string, MemberReport>();

    // Initialize all members
    members.forEach((member) => {
      memberMap.set(member._id, {
        name: member.name,
        email: member.email,
        totalMeals: 0,
        totalCost: 0,
        balance: 0,
      });
    });

    // Add meal data
    meals.forEach((meal) => {
      const report = memberMap.get(meal.userId._id);
      if (report) {
        const totalMeals = meal.breakfast + meal.lunch + meal.dinner;
        report.totalMeals += totalMeals;
        report.totalCost = report.totalMeals * mealRate;
      }
    });

    // Calculate balance (expenses per member)
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expensePerMember = totalExpenses / members.length;

    memberMap.forEach((report) => {
      report.balance = report.totalCost - expensePerMember;
    });

    return Array.from(memberMap.values()).sort((a, b) => b.totalMeals - a.totalMeals);
  };

  const downloadReport = () => {
    const reports = generateMemberReports();
    const now = new Date();
    const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    let csv = 'Member Settlement Report - ' + month + '\n\n';
    csv += 'Name,Email,Total Meals,Total Cost (₹),Expense Share (₹),Balance (₹)\n';

    reports.forEach((report) => {
      csv += `"${report.name}","${report.email}",${report.totalMeals},${report.totalCost.toFixed(
        2
      )},${(report.totalCost - report.balance).toFixed(2)},${report.balance.toFixed(2)}\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `meal-report-${now.getFullYear()}-${now.getMonth() + 1}.csv`);
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

  const memberReports = generateMemberReports();
  const totalMeals = memberReports.reduce((sum, r) => sum + r.totalMeals, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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
                <p className="text-muted-foreground">Settlement and detailed reports</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Meals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalMeals}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{totalExpenses}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Meal Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹{mealRate}</div>
                </CardContent>
              </Card>
            </div>

            {/* Settlement Report */}
            <Card>
              <CardHeader>
                <CardTitle>Member Settlement Report</CardTitle>
                <CardDescription>Current month settlement details</CardDescription>
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
                          <th className="text-right py-3 px-4 font-semibold">Expense Share</th>
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
                            <td className="text-right py-3 px-4">₹{report.totalCost.toFixed(2)}</td>
                            <td className="text-right py-3 px-4">
                              ₹{(report.totalCost - report.balance).toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-4 font-semibold">
                              <span
                                className={report.balance >= 0 ? 'text-green-600' : 'text-red-600'}
                              >
                                ₹{report.balance.toFixed(2)}
                              </span>
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
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Expense Details</CardTitle>
                <CardDescription>All recorded expenses</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
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
                          <th className="text-left py-3 px-4 font-semibold">Added By</th>
                          <th className="text-right py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((expense) => (
                          <tr
                            key={expense._id}
                            className="border-b border-border hover:bg-surface/50"
                          >
                            <td className="py-3 px-4">{expense.description}</td>
                            <td className="py-3 px-4 capitalize">{expense.category}</td>
                            <td className="py-3 px-4">{expense.addedBy.name}</td>
                            <td className="text-right py-3 px-4 font-semibold">
                              ₹{expense.amount}
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
          </motion.div>
        </main>
      </div>
    </div>
  );
}
