'use client';

import type React from 'react';

import DashboardHeader from '@/components/dashboard-header';
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
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  messId?: string;
}

interface Mess {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  managerId: User;
  members: User[];
  mealRate: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [mess, setMess] = useState<Mess | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [hasMessCreated, setHasMessCreated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    managerId: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUserAndMess();
  }, [router]);

  const fetchUserAndMess = async () => {
    try {
      setLoading(true);
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error) {
        setError(profileRes.error);
        return;
      }

      if (profileRes.data) {
        setUser(profileRes.data);

        // Fetch all users for manager selection (only for admins)
        if (profileRes.data.role === 'admin') {
          const usersRes = await apiClient.get<User[]>('/users/all');
          if (usersRes.data) {
            setUsers(usersRes.data);
          }
        }

        if (profileRes.data.messId) {
          setHasMessCreated(true);
          const messRes = await apiClient.get<Mess>(`/mess/${profileRes.data.messId}`);
          if (messRes.data) {
            setMess(messRes.data);
            setFormData({
              name: messRes.data.name,
              description: messRes.data.description || '',
              address: messRes.data.address || '',
              managerId: messRes.data.managerId._id,
            });
          }
        }
      }
    } catch (err) {
      setError('Failed to load settings');
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

  const handleManagerChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      managerId: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (!formData.name) {
        setError('Please enter a mess name');
        setSubmitting(false);
        return;
      }

      if (!formData.managerId) {
        setError('Please select a manager');
        setSubmitting(false);
        return;
      }

      const res = await apiClient.post<Mess>('/mess', {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        managerId: formData.managerId,
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      if (res.data.data) {
        setMess(res.data.data);
        setHasMessCreated(true);
        setSuccess('Mess created successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (err) {
      setError('Failed to create mess');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
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

      <div className="flex justify-center w-full">
        <main className="w-full max-w-4xl p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Settings</h2>
              <p className="text-muted-foreground">Manage your mess settings</p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-center gap-2 p-4 glass-light bg-green-100/50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}

            {!hasMessCreated ? (
              user?.role === 'admin' ? (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Create Mess</CardTitle>
                    <CardDescription>Set up a new mess with manager and details</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Mess Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g., Bachelor Pad, Shared House"
                          value={formData.name}
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
                          placeholder="Describe your mess..."
                          value={formData.description}
                          onChange={handleChange}
                          disabled={submitting}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address (Optional)</Label>
                        <textarea
                          id="address"
                          name="address"
                          placeholder="Enter mess address..."
                          value={formData.address}
                          onChange={handleChange}
                          disabled={submitting}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="manager">Select Manager</Label>
                        <Select value={formData.managerId} onValueChange={handleManagerChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a manager" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user._id} value={user._id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Select a user to be the manager of this mess
                        </p>
                      </div>

                      <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? 'Creating...' : 'Create Mess'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Join a Mess</CardTitle>
                    <CardDescription>You need to be added to a mess by a manager</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Only admins can create new messes. Please contact your mess manager and ask
                        them to add you using your email:
                      </p>
                      <div className="p-4 glass-light bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Your Email: <strong>{user?.email}</strong>
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Once a manager adds you to their mess, you'll be able to access all the
                        features.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Mess Information</CardTitle>
                  <CardDescription>Your current mess details</CardDescription>
                </CardHeader>

                <CardContent>
                  {mess && (
                    <div className="space-y-4">
                      <div className="p-4 glass-light rounded-lg">
                        <p className="text-sm text-muted-foreground">Mess Name</p>
                        <p className="text-lg font-semibold">{mess.name}</p>
                      </div>

                      {mess.description && (
                        <div className="p-4 glass-light rounded-lg">
                          <p className="text-sm text-muted-foreground">Description</p>
                          <p className="text-lg">{mess.description}</p>
                        </div>
                      )}

                      {mess.address && (
                        <div className="p-4 glass-light rounded-lg">
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="text-lg">{mess.address}</p>
                        </div>
                      )}

                      <div className="p-4 glass-light rounded-lg">
                        <p className="text-sm text-muted-foreground">Manager</p>
                        <p className="text-lg font-semibold">{mess.managerId.name}</p>
                        <p className="text-sm text-muted-foreground">{mess.managerId.email}</p>
                      </div>

                      <div className="p-4 glass-light rounded-lg">
                        <p className="text-sm text-muted-foreground">Current Meal Rate</p>
                        <p className="text-lg font-semibold">৳{mess.mealRate} per meal</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          * Meal rate is calculated dynamically based on total expenses and meals
                        </p>
                      </div>

                      <div className="p-4 glass-light bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-sm text-muted-foreground mb-2">Manage Members</p>
                        <p className="text-sm mb-4">
                          Go to the Members section to add or manage members in your mess.
                        </p>
                        <Button variant="outline" onClick={() => router.push('/dashboard/members')}>
                          Go to Members
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
