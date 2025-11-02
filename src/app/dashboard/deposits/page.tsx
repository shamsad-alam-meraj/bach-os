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
import { ArrowLeft, Plus, Wallet } from 'lucide-react';
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

interface Deposit {
  _id: string;
  userId: User;
  amount: number;
  date: string;
  description?: string;
  createdAt: string;
}

export default function DepositsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [messId, setMessId] = useState('');
  const [members, setMembers] = useState<User[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

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

      const messId = profileRes.data.messId;
      setMessId(messId);

      // Fetch mess members
      const messRes = await apiClient.get(`/mess/${messId}`);
      if (messRes.data) {
        setMembers(messRes.data.members);
      }

      // Fetch deposits
      const depositsRes = await apiClient.get<Deposit[]>(`/deposits/mess/${messId}`);
      if (depositsRes.data) {
        setDeposits(depositsRes.data);
      }
    } catch (err) {
      setError('Failed to load deposits data');
    } finally {
      setLoading(false);
    }
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

      const res = await apiClient.post<Deposit>('/deposits', {
        messId,
        userId: formData.userId,
        amount: Number.parseFloat(formData.amount),
        date: formData.date,
        description: formData.description,
      });

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
        fetchDepositsData(); // Refresh the list
      }
    } catch (err) {
      setError('Failed to add deposit');
    } finally {
      setSubmitting(false);
    }
  };

  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);

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
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <h2 className="text-3xl font-bold">Deposits</h2>
                  <p className="text-muted-foreground">Manage member deposits and payments</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">{success}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Deposit Form */}
              <Card className="lg:col-span-1">
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
                      <Label htmlFor="member">Select Member</Label>
                      <Select value={formData.userId} onValueChange={handleMemberChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a member" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member._id} value={member._id}>
                              {member.name} ({member.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (৳)</Label>
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
                      <Label htmlFor="date">Date</Label>
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
                      {submitting ? 'Adding...' : 'Add Deposit'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Deposits List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Recent Deposits
                  </CardTitle>
                  <CardDescription>
                    Total deposits: <strong>৳{totalDeposits.toLocaleString()}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {deposits.length === 0 ? (
                    <div className="text-center py-12">
                      <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No deposits recorded yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Add your first deposit using the form
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {deposits.map((deposit) => (
                        <div
                          key={deposit._id}
                          className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold">{deposit.userId.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {deposit.description || 'No description'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(deposit.date).toLocaleDateString()} •{' '}
                                  {new Date(deposit.createdAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ৳{deposit.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">Deposit</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
