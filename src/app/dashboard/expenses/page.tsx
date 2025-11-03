'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, Crown, Edit, Filter, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  messId: string;
  role?: string;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  addedBy: User;
  expensedBy: User;
  date: string;
  canEdit?: boolean;
  canDelete?: boolean;
}

interface Mess {
  _id: string;
  managerId: {
    _id: string;
    name: string;
    email: string;
  };
  members: User[];
}

type TimeFilter = 'today' | 'week' | 'month' | 'all';

const CATEGORIES = [
  { value: 'food', label: 'Food & Groceries' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'kitchen', label: 'Kitchen Supplies' },
  { value: 'other', label: 'Other' },
];

export default function ExpensesPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messId, setMessId] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentMess, setCurrentMess] = useState<Mess | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [members, setMembers] = useState<User[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

      const userData = profileRes.data;
      setCurrentUser(userData);
      const id = userData.messId;
      setMessId(id);

      // Fetch mess details to get manager information
      const messRes = await apiClient.get<Mess>(`/mess/${id}`);
      if (messRes.data) {
        setCurrentMess(messRes.data);
        setMembers(messRes.data.members);

        // Fetch all expenses for the mess
        const expensesRes = await apiClient.get<Expense[]>(`/expenses/mess/${id}`);
        if (expensesRes.data) {
          // Check if current user is the manager
          const isManager = messRes.data.managerId._id === userData._id;
          const expensesWithPermissions = expensesRes.data.map((expense) => ({
            ...expense,
            canEdit: isManager,
            canDelete: isManager,
          }));
          setAllExpenses(expensesWithPermissions);
          applyFilters(expensesWithPermissions, timeFilter, categoryFilter, memberFilter);
        }
      }
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  // Re-apply permissions when currentMess is loaded
  useEffect(() => {
    if (currentMess && currentUser && allExpenses.length > 0) {
      const isManager = currentMess.managerId._id === currentUser._id;
      const expensesWithPermissions = allExpenses.map((expense) => ({
        ...expense,
        canEdit: isManager,
        canDelete: isManager,
      }));
      setAllExpenses(expensesWithPermissions);
      applyFilters(expensesWithPermissions, timeFilter, categoryFilter, memberFilter);
    }
  }, [currentMess, currentUser]);

  const applyFilters = (
    expensesList: Expense[],
    time: TimeFilter,
    category: string,
    member: string
  ) => {
    let filtered = [...expensesList];

    // Apply time filter
    const now = new Date();
    switch (time) {
      case 'today':
        const today = new Date().toDateString();
        filtered = filtered.filter((expense) => new Date(expense.date).toDateString() === today);
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((expense) => new Date(expense.date) >= weekAgo);
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter((expense) => new Date(expense.date) >= monthStart);
        break;
      case 'all':
        // No time filter applied
        break;
    }

    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter((expense) => expense.category === category);
    }

    // Apply member filter
    if (member !== 'all') {
      filtered = filtered.filter((expense) => expense.expensedBy._id === member);
    }

    setExpenses(filtered);
  };

  const handleTimeFilterChange = (value: TimeFilter) => {
    setTimeFilter(value);
    applyFilters(allExpenses, value, categoryFilter, memberFilter);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    applyFilters(allExpenses, timeFilter, value, memberFilter);
  };

  const handleMemberFilterChange = (value: string) => {
    setMemberFilter(value);
    applyFilters(allExpenses, timeFilter, categoryFilter, value);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditing(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setDeletingExpense(expense);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;

    try {
      const res = await apiClient.delete(`/expenses/${deletingExpense._id}`);
      if (res.error) {
        setError(res.error || 'Failed to delete expense record');
        return;
      }

      // Refresh expenses
      await fetchUserAndExpenses();
      setIsDeleting(false);
      setDeletingExpense(null);
    } catch (err) {
      setError('Failed to delete expense record');
      setIsDeleting(false);
      setDeletingExpense(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setDeletingExpense(null);
  };

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    try {
      const res = await apiClient.put(`/expenses/${editingExpense._id}`, {
        description: editingExpense.description,
        amount: editingExpense.amount,
        category: editingExpense.category,
        expensedBy: editingExpense.expensedBy._id,
        date: editingExpense.date,
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      setIsEditing(false);
      setEditingExpense(null);
      await fetchUserAndExpenses();
    } catch (err) {
      setError('Failed to update expense record');
    }
  };

  const clearFilters = () => {
    setTimeFilter('month');
    setCategoryFilter('all');
    setMemberFilter('all');
    applyFilters(allExpenses, 'month', 'all', 'all');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      utilities: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      maintenance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      kitchen: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[category] || colors.other;
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((cat) => cat.value === category)?.label || category;
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

  // Check if current user is the manager by comparing IDs
  const isManager = currentMess?.managerId?._id === currentUser?._id;

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
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-bold">Expenses</h2>
                  {isManager && <Crown className="w-6 h-6 text-yellow-500" />}
                </div>
                <p className="text-muted-foreground">
                  {isManager ? 'Manage all expenses' : 'View expenses'}
                </p>
              </div>
              {isManager && (
                <Link href="/dashboard/expenses/add">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Expense
                  </Button>
                </Link>
              )}
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
                <Button variant="ghost" size="sm" onClick={() => setError('')}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Filters Section - Enhanced Design */}
            <Card className="glass-card mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Period</label>
                    <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Expensed By</label>
                    <Select value={memberFilter} onValueChange={handleMemberFilterChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        {members.map((member) => (
                          <SelectItem key={member._id} value={member._id}>
                            {member.name}
                            {member._id === currentMess?.managerId?._id && ' 👑'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Expense Modal */}
            {isEditing && editingExpense && isManager && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Edit Expense</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingExpense(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium">Editing expense record</p>
                    <p className="text-sm text-muted-foreground">
                      Originally added by {editingExpense.addedBy.name} on{' '}
                      {new Date(editingExpense.date).toLocaleDateString()}
                    </p>
                  </div>

                  <form onSubmit={handleUpdateExpense}>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Input
                          type="text"
                          value={editingExpense.description}
                          onChange={(e) =>
                            setEditingExpense({
                              ...editingExpense,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter expense description"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Amount (৳)</label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingExpense.amount}
                          onChange={(e) =>
                            setEditingExpense({
                              ...editingExpense,
                              amount: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <Select
                          value={editingExpense.category}
                          onValueChange={(value) =>
                            setEditingExpense({
                              ...editingExpense,
                              category: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Expensed By</label>
                        <Select
                          value={editingExpense.expensedBy._id}
                          onValueChange={(value) =>
                            setEditingExpense({
                              ...editingExpense,
                              expensedBy:
                                members.find((m) => m._id === value) || editingExpense.expensedBy,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {members.map((member) => (
                              <SelectItem key={member._id} value={member._id}>
                                <div className="flex items-center gap-2">
                                  {member.name}
                                  {member._id === currentMess?.managerId?._id && (
                                    <Crown className="w-3 h-3 text-yellow-500" />
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Date</label>
                        <Input
                          type="date"
                          value={editingExpense.date.split('T')[0]}
                          onChange={(e) =>
                            setEditingExpense({
                              ...editingExpense,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <Button type="submit" className="flex-1">
                        Update Expense
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingExpense(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleting && deletingExpense && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center gap-2 mb-4">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <h3 className="text-lg font-semibold text-destructive">Delete Expense</h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to delete this expense? This action cannot be undone.
                  </p>

                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">{deletingExpense.description}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                          deletingExpense.category
                        )}`}
                      >
                        {getCategoryLabel(deletingExpense.category)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-lg font-bold text-primary">৳{deletingExpense.amount}</p>
                      <p>
                        Expensed by: <strong>{deletingExpense.expensedBy.name}</strong>
                      </p>
                      <p>Date: {new Date(deletingExpense.date).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">
                        Added by {deletingExpense.addedBy.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDeleteConfirm} className="flex-1">
                      Delete Expense
                    </Button>
                    <Button variant="outline" onClick={handleDeleteCancel} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Expense Records</CardTitle>
                <CardDescription>
                  {expenses.length} record(s) found
                  {timeFilter !== 'all' && ` for ${timeFilter}`}
                  {categoryFilter !== 'all' && ` • ${getCategoryLabel(categoryFilter)}`}
                  {memberFilter !== 'all' &&
                    ` • ${members.find((m) => m._id === memberFilter)?.name}`}
                  {!isManager && ' • View only'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">No expenses found matching your filters</p>
                    {isManager && (
                      <Link href="/dashboard/expenses/add">
                        <Button>Add First Expense</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.map((expense) => (
                      <motion.div
                        key={expense._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 glass-light rounded-lg border border-white/20 dark:border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">
                                {expense.description}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                                    expense.category
                                  )}`}
                                >
                                  {getCategoryLabel(expense.category)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(expense.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <span>Expensed by:</span>
                              <div className="flex items-center gap-1 font-medium">
                                {expense.expensedBy.name}
                                {expense.expensedBy._id === currentMess?.managerId?._id && (
                                  <Crown className="w-3 h-3 text-yellow-500" />
                                )}
                              </div>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span>Added by:</span>
                              <span className="font-medium">{expense.addedBy.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right  flex-shrink-0">
                          {isManager && (
                            <div className="flex gap-1 flex-shrink-0 mb-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(expense)}
                                title="Edit expense"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(expense)}
                                title="Delete expense"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                          <p className="text-2xl font-bold text-primary">৳{expense.amount}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info for regular members */}
            {!isManager && (
              <Card className="glass-card mt-6 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-500">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">
                      <strong>View Only:</strong> Only mess managers can add, edit, or delete
                      expenses. Contact your mess manager for any corrections.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
