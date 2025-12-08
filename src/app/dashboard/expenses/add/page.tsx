'use client';

import type React from 'react';

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
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  messId: string;
}

interface Mess {
  _id: string;
  name: string;
  members: User[];
}

export default function AddExpensePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [messId, setMessId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [members, setMembers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    expensedBy: '',
    date: '',
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
    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      const userData = profileRes.data;
      setMessId(userData.messId);
      setCurrentUserId(userData._id);

      // Set current user as default expensedBy
      setFormData((prev) => ({
        ...prev,
        expensedBy: userData._id,
      }));

      // Fetch mess details to get members
      const messRes = await apiClient.get<Mess>(`/mess/${userData.messId}`);
      if (messRes.data) {
        setMembers(messRes.data.members);
      }
    } catch (err) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (!formData.description || !formData.amount || !formData.expensedBy) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      const res = await apiClient.post('/expenses', {
        messId,
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        category: formData.category,
        expensedBy: formData.expensedBy,
        date: formData.date,
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      router.push('/dashboard/expenses');
    } catch (err) {
      setError('Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-theme-unified page-themed">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 md:ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <Link
              href="/dashboard/expenses"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Expenses
            </Link>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Add Expense</CardTitle>
                <CardDescription>Record a new expense for the mess</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      placeholder="e.g., Vegetables, Rice, Cooking Oil"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (৳)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food & Groceries</SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expensedBy">Expensed By</Label>
                      <Select
                        value={formData.expensedBy}
                        onValueChange={(value) => handleSelectChange('expensedBy', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member._id} value={member._id}>
                              {member.name} {member._id === currentUserId && '(You)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? 'Adding...' : 'Add Expense'}
                    </Button>
                    <Link href="/dashboard/expenses" className="flex-1">
                      <Button type="button" variant="outline" className="w-full bg-transparent">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
