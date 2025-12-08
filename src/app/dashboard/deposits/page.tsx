'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, Crown, Edit, Filter, Plus, Trash2, Wallet, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  messId?: string;
}

interface Deposit {
  _id: string;
  userId: User;
  amount: number;
  date: string;
  description?: string;
  createdAt: string;
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

export default function DepositsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [messId, setMessId] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentMess, setCurrentMess] = useState<Mess | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [allDeposits, setAllDeposits] = useState<Deposit[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [editingDeposit, setEditingDeposit] = useState<Deposit | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingDeposit, setDeletingDeposit] = useState<Deposit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    date: '',
    description: '',
  });

  // Initialize date after component mounts
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      date: new Date().toISOString().split('T')[0],
    }));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchDepositsData();
  }, [router]);

  const fetchDepositsData = async () => {
    try {
      setLoading(true);

      // Fetch user profile to get messId
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      const userData = profileRes.data;
      setCurrentUser(userData);
      const messId = userData.messId;
      setMessId(messId);

      // Fetch mess details
      const messRes = await apiClient.get<Mess>(`/mess/${messId}`);
      if (messRes.data) {
        setCurrentMess(messRes.data);
        setMembers(messRes.data.members);

        // Fetch deposits
        const depositsRes = await apiClient.get<Deposit[]>(`/deposits/mess/${messId}`);
        if (depositsRes.data) {
          // Check if current user is the manager
          const isManager = messRes.data.managerId._id === userData._id;
          const depositsWithPermissions = depositsRes.data.map((deposit) => ({
            ...deposit,
            canEdit: isManager,
            canDelete: isManager,
          }));
          setAllDeposits(depositsWithPermissions);
          applyFilters(depositsWithPermissions, timeFilter, memberFilter);
        }
      }
    } catch (err) {
      setError('Failed to load deposits data');
    } finally {
      setLoading(false);
    }
  };

  // Re-apply permissions when currentMess is loaded
  useEffect(() => {
    if (currentMess && currentUser && allDeposits.length > 0) {
      const isManager = currentMess.managerId._id === currentUser._id;
      const depositsWithPermissions = allDeposits.map((deposit) => ({
        ...deposit,
        canEdit: isManager,
        canDelete: isManager,
      }));
      setAllDeposits(depositsWithPermissions);
      applyFilters(depositsWithPermissions, timeFilter, memberFilter);
    }
  }, [currentMess, currentUser]);

  const applyFilters = (depositsList: Deposit[], time: TimeFilter, member: string) => {
    let filtered = [...depositsList];

    // Apply time filter
    const now = new Date();
    switch (time) {
      case 'today':
        const today = new Date().toDateString();
        filtered = filtered.filter((deposit) => new Date(deposit.date).toDateString() === today);
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((deposit) => new Date(deposit.date) >= weekAgo);
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter((deposit) => new Date(deposit.date) >= monthStart);
        break;
      case 'all':
        // No time filter applied
        break;
    }

    // Apply member filter
    if (member !== 'all') {
      filtered = filtered.filter((deposit) => deposit.userId._id === member);
    }

    setDeposits(filtered);
  };

  const handleTimeFilterChange = (value: TimeFilter) => {
    setTimeFilter(value);
    applyFilters(allDeposits, value, memberFilter);
  };

  const handleMemberFilterChange = (value: string) => {
    setMemberFilter(value);
    applyFilters(allDeposits, timeFilter, value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      userId: value,
    }));
  };

  const handleEdit = (deposit: Deposit) => {
    setEditingDeposit(deposit);
    setIsEditing(true);
  };

  const handleDeleteClick = (deposit: Deposit) => {
    setDeletingDeposit(deposit);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDeposit) return;

    try {
      const res = await apiClient.delete(`/deposits/${deletingDeposit._id}`);
      if (res.error) {
        setError(res.error || 'Failed to delete deposit record');
        return;
      }

      // Refresh deposits
      await fetchDepositsData();
      setIsDeleting(false);
      setDeletingDeposit(null);
    } catch (err) {
      setError('Failed to delete deposit record');
      setIsDeleting(false);
      setDeletingDeposit(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setDeletingDeposit(null);
  };

  const handleUpdateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeposit) return;

    try {
      const res = await apiClient.put(`/deposits/${editingDeposit._id}`, {
        amount: editingDeposit.amount,
        description: editingDeposit.description,
        date: editingDeposit.date,
        userId: editingDeposit.userId._id,
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      setIsEditing(false);
      setEditingDeposit(null);
      await fetchDepositsData();
    } catch (err) {
      setError('Failed to update deposit record');
    }
  };

  const clearFilters = () => {
    setTimeFilter('month');
    setMemberFilter('all');
    applyFilters(allDeposits, 'month', 'all');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (!formData.userId || !formData.amount) {
        setError('Please select a member and enter amount');
        setSubmitting(false);
        return;
      }

      // Validate amount
      const amount = Number.parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid amount greater than 0');
        setSubmitting(false);
        return;
      }

      console.log('Submitting deposit:', {
        messId,
        userId: formData.userId,
        amount,
        date: formData.date,
        description: formData.description,
      });

      const res = await apiClient.post<Deposit>('/deposits', {
        messId,
        userId: formData.userId,
        amount: amount,
        date: formData.date,
        description: formData.description,
      });

      console.log('Deposit response:', res);

      if (res.error) {
        setError(res.error);
        return;
      }

      if (res.data) {
        setSuccess('Deposit added successfully!');
        setFormData({
          userId: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
        });
        // Refresh the list
        await fetchDepositsData();
      }
    } catch (err) {
      console.error('Deposit submission error:', err);
      setError('Failed to add deposit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  const totalAllDeposits = allDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading deposits...</p>
        </div>
      </div>
    );
  }

  // Check if current user is the manager by comparing IDs
  const isManager = currentMess?.managerId?._id === currentUser?._id;

  return (
    <div className="min-h-screen bg-background page-theme-unified page-themed">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold">Deposits</h2>
                    {isManager && <Crown className="w-6 h-6 text-yellow-500" />}
                  </div>
                  <p className="text-muted-foreground">
                    {isManager ? 'Manage all deposits' : 'View deposits'}
                  </p>
                </div>
              </div>
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

            {success && (
              <div className="mb-6 p-4 glass-light bg-green-100/50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg">
                {success}
              </div>
            )}

            {/* Filters Section */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="text-sm font-medium mb-2 block">Member</label>
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

            {/* Edit Deposit Modal */}
            {isEditing && editingDeposit && isManager && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Edit Deposit</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingDeposit(null);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium">Editing deposit record</p>
                    <p className="text-sm text-muted-foreground">
                      Originally added on {new Date(editingDeposit.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <form onSubmit={handleUpdateDeposit}>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Member</label>
                        <Select
                          value={editingDeposit.userId._id}
                          onValueChange={(value) =>
                            setEditingDeposit({
                              ...editingDeposit,
                              userId: members.find((m) => m._id === value) || editingDeposit.userId,
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
                        <label className="text-sm font-medium mb-2 block">Amount (৳)</label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingDeposit.amount}
                          onChange={(e) =>
                            setEditingDeposit({
                              ...editingDeposit,
                              amount: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Date</label>
                        <Input
                          type="date"
                          value={editingDeposit.date.split('T')[0]}
                          onChange={(e) =>
                            setEditingDeposit({
                              ...editingDeposit,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <textarea
                          value={editingDeposit.description || ''}
                          onChange={(e) =>
                            setEditingDeposit({
                              ...editingDeposit,
                              description: e.target.value,
                            })
                          }
                          placeholder="Add a note about this deposit..."
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <Button type="submit" className="flex-1">
                        Update Deposit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingDeposit(null);
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
            {isDeleting && deletingDeposit && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center gap-2 mb-4">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <h3 className="text-lg font-semibold text-destructive">Delete Deposit</h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to delete this deposit? This action cannot be undone.
                  </p>

                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{deletingDeposit.userId.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {deletingDeposit.description || 'No description'}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        ৳{deletingDeposit.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>Date: {new Date(deletingDeposit.date).toLocaleDateString()}</p>
                      <p className="text-muted-foreground">
                        Added on {new Date(deletingDeposit.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDeleteConfirm} className="flex-1">
                      Delete Deposit
                    </Button>
                    <Button variant="outline" onClick={handleDeleteCancel} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Deposit Form - Only show for managers */}
              {isManager && (
                <Card className="glass-card lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add Deposit
                    </CardTitle>
                    <CardDescription>Record a new member deposit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="member">Select Member *</Label>
                        <Select value={formData.userId} onValueChange={handleMemberChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a member" />
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

                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (৳) *</Label>
                        <Input
                          id="amount"
                          name="amount"
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="Enter amount"
                          value={formData.amount}
                          onChange={handleChange}
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          disabled={submitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <textarea
                          id="description"
                          name="description"
                          placeholder="Add a note about this deposit..."
                          value={formData.description}
                          onChange={handleChange}
                          disabled={submitting}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                        />
                      </div>

                      <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? 'Adding Deposit...' : 'Add Deposit'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Deposits List */}
              <Card className={`glass-card ${isManager ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Deposit Records
                  </CardTitle>
                  <CardDescription>
                    {deposits.length} record(s) found
                    {timeFilter !== 'all' && ` for ${timeFilter}`}
                    {memberFilter !== 'all' &&
                      ` • ${members.find((m) => m._id === memberFilter)?.name}`}
                    {!isManager && ' • View only'}
                    <br />
                    Total shown: <strong>৳{totalDeposits.toLocaleString()}</strong>
                    {timeFilter !== 'all' && (
                      <span className="text-muted-foreground">
                        {' '}
                        (Overall: ৳{totalAllDeposits.toLocaleString()})
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deposits.length === 0 ? (
                    <div className="text-center py-12">
                      <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No deposits found matching your filters
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {isManager
                          ? 'Add your first deposit using the form'
                          : 'No deposits recorded yet'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {deposits.map((deposit) => (
                        <motion.div
                          key={deposit._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 glass-light rounded-lg border border-white/20 dark:border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Wallet className="w-5 h-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold truncate">{deposit.userId.name}</p>
                                  {deposit.userId._id === currentMess?.managerId?._id && (
                                    <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                  )}
                                  {isManager && (
                                    <div className="flex gap-1 ml-auto">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(deposit)}
                                        title="Edit deposit"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick(deposit)}
                                        title="Delete deposit"
                                      >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {deposit.description || 'No description'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(deposit.date).toLocaleDateString()} •{' '}
                                  {new Date(deposit.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className="text-lg font-bold text-green-600">
                              ৳{deposit.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Deposit</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Info for regular members */}
            {!isManager && (
              <Card className="glass-card mt-6 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-500">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">
                      <strong>View Only:</strong> Only mess managers can add, edit, or delete
                      deposits. Contact your mess manager for any corrections.
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
