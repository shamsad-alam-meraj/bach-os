'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import AdminWelcomeCard from '@/components/Dashboard/Admin/admin-welcome-card';
import AuthState from '@/components/Dashboard/auth-state';
import ExpenseBreakdown from '@/components/Dashboard/Data/expense-breakdown';
import MemberStats from '@/components/Dashboard/Data/member-stats';
import RecentActivity from '@/components/Dashboard/Data/recent-activity';
import DataCleanupDialog from '@/components/Dashboard/Dialogs/data-cleanup-dialog';
import DeleteMessDialog from '@/components/Dashboard/Dialogs/delete-mess-dialog';
import DashboardLayout from '@/components/Dashboard/layout';
import LoadingState from '@/components/Dashboard/loading-state';
import MealRateCalculation from '@/components/Dashboard/Mess/meal-rate-calculation';
import MessHeader from '@/components/Dashboard/Mess/mess-header';
import StatCard from '@/components/stat-card';
import { apiClient } from '@/lib/api-client';
import { DashboardData, Mess, User } from '@/types/types';
import { DollarSign, Users, UtensilsCrossed, Wallet } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dialog states
  const [showCreateMess, setShowCreateMess] = useState(false);
  const [showDeleteMess, setShowDeleteMess] = useState(false);
  const [showDataCleanup, setShowDataCleanup] = useState(false);

  // Admin states
  const [allMesses, setAllMesses] = useState<Mess[]>([]);
  const [selectedMessForDeletion, setSelectedMessForDeletion] = useState('');
  const [selectedMessForCleanup, setSelectedMessForCleanup] = useState('');
  const [cleanupStartDate, setCleanupStartDate] = useState('');
  const [cleanupEndDate, setCleanupEndDate] = useState('');
  const [cleanupType, setCleanupType] = useState<'meals' | 'expenses' | 'deposits' | 'all'>('all');

  // Create mess form state
  const [createMessData, setCreateMessData] = useState({
    name: '',
    description: '',
    address: '',
  });

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

      // If user is admin, fetch all messes
      if (userData?.role === 'admin') {
        const messesRes = await apiClient.get<Mess[]>('/mess');
        if (messesRes.data) {
          setAllMesses(messesRes.data);
        }
      }

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

  // Admin Functions
  const handleCreateMess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await apiClient.post<Mess>('/mess/create', {
        ...createMessData,
        managerId: user?._id,
      });
      if (res.error) {
        setError(res.error);
        return;
      }

      if (res.data) {
        setSuccess('Mess created successfully!');
        setShowCreateMess(false);
        setCreateMessData({ name: '', description: '', address: '' });
        fetchDashboardData();
      }
    } catch (err) {
      setError('Failed to create mess');
    }
  };

  const handleDeleteMess = async () => {
    if (!selectedMessForDeletion) return;

    try {
      const res = await apiClient.delete(`/mess/admin/${selectedMessForDeletion}`);
      if (res.error) {
        setError(res.error);
        return;
      }

      setSuccess('Mess and all related data deleted successfully!');
      setShowDeleteMess(false);
      setSelectedMessForDeletion('');
      fetchDashboardData();
    } catch (err) {
      setError('Failed to delete mess');
    }
  };

  const handleDataCleanup = async () => {
    if (!selectedMessForCleanup || !cleanupStartDate || !cleanupEndDate) {
      setError('Please select mess and date range');
      return;
    }

    try {
      const res = await apiClient.post('/mess/admin/cleanup', {
        messId: selectedMessForCleanup,
        startDate: cleanupStartDate,
        endDate: cleanupEndDate,
        type: cleanupType,
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      setSuccess(
        `Data cleanup completed successfully! ${res.data?.deletedCount || 0} records deleted.`
      );
      setShowDataCleanup(false);
      setSelectedMessForCleanup('');
      setCleanupStartDate('');
      setCleanupEndDate('');
      setCleanupType('all');
      fetchDashboardData();
    } catch (err) {
      setError('Failed to cleanup data');
    }
  };

  if (loading) {
    return (
      <DashboardLayout mess={null}>
        <LoadingState />
      </DashboardLayout>
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

  const totalMembers = monthlyStats?.totalMembers || 0;
  const totalMeals = monthlyStats?.totalMeals || 0;
  const totalExpenses = monthlyStats?.totalExpenses || 0;
  const totalDeposits = monthlyStats?.totalDeposits || 0;
  const expenseCount = monthlyStats?.expenseCount || 0;
  const mealEntries = monthlyStats?.mealEntries || 0;
  const depositCount = monthlyStats?.depositCount || 0;

  const isAdmin = user?.role === 'admin';

  return (
    <DashboardLayout mess={mess} themeClass="page-theme-unified">
      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 glass-light bg-green-100/50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg">
          {success}
        </div>
      )}

      {!mess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mt-8 space-y-6"
        >
          {isAdmin ? (
            <AdminWelcomeCard
              onCreateMess={() => router.push('/dashboard/settings')}
              onDeleteMess={() => setShowDeleteMess(true)}
              onDataCleanup={() => setShowDataCleanup(true)}
              allMesses={allMesses}
            />
          ) : (
            <AuthState
              message="You need to be added to a mess by a manager. Please contact your mess manager and ask them to add you using your email:"
              userEmail={user?.email}
            />
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header Section */}
          <MessHeader
            mess={mess}
            user={user!}
            calculationBreakdown={calculationBreakdown}
            onCreateMess={() => router.push('/dashboard/settings')}
            onDeleteMess={() => setShowDeleteMess(true)}
            onDataCleanup={() => setShowDataCleanup(true)}
          />

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

          {/* Meal Rate Calculation */}
          <MealRateCalculation calculationBreakdown={calculationBreakdown} />

          {/* Additional Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <MemberStats memberStats={memberStats} />
            <ExpenseBreakdown expenseBreakdown={expenseBreakdown} />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity
              type="meals"
              title="Recent Meals"
              description="Latest meal entries"
              data={recentMeals}
              viewAllLink="/dashboard/meals"
            />
            <RecentActivity
              type="expenses"
              title="Recent Expenses"
              description="Latest expense entries"
              data={recentExpenses}
              viewAllLink="/dashboard/expenses"
            />
          </div>
        </motion.div>
      )}

      <DeleteMessDialog
        open={showDeleteMess}
        onOpenChange={setShowDeleteMess}
        selectedMess={selectedMessForDeletion}
        onMessChange={setSelectedMessForDeletion}
        allMesses={allMesses}
        onConfirm={handleDeleteMess}
      />

      <DataCleanupDialog
        open={showDataCleanup}
        onOpenChange={setShowDataCleanup}
        selectedMess={selectedMessForCleanup}
        onMessChange={setSelectedMessForCleanup}
        allMesses={allMesses}
        cleanupType={cleanupType}
        onTypeChange={setCleanupType}
        startDate={cleanupStartDate}
        onStartDateChange={setCleanupStartDate}
        endDate={cleanupEndDate}
        onEndDateChange={setCleanupEndDate}
        onCleanupPreviousMonth={() => {
          const now = new Date();
          const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          setCleanupStartDate(startOfPreviousMonth.toISOString().split('T')[0]);
          setCleanupEndDate(endOfPreviousMonth.toISOString().split('T')[0]);
        }}
        onConfirm={handleDataCleanup}
      />
    </DashboardLayout>
  );
}
