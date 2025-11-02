'use client';

import type React from 'react';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  messId?: string;
}

interface Mess {
  _id: string;
  name: string;
  description?: string;
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
  const [hasMessCreated, setHasMessCreated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mealRate: '50',
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

        if (profileRes.data.messId) {
          setHasMessCreated(true);
          const messRes = await apiClient.get<Mess>(`/mess/${profileRes.data.messId}`);
          if (messRes.data) {
            setMess(messRes.data);
            setFormData({
              name: messRes.data.name,
              description: messRes.data.description || '',
              mealRate: messRes.data.mealRate.toString(),
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

      const res = await apiClient.post<Mess>('/mess/create', {
        name: formData.name,
        description: formData.description,
        mealRate: Number.parseInt(formData.mealRate),
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      if (res.data) {
        setMess(res.data);
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

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Settings</h2>
              <p className="text-muted-foreground">Manage your mess settings</p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-green-100 text-green-800 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}

            {!hasMessCreated ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create Mess</CardTitle>
                  <CardDescription>Set up your first mess to get started</CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Mess Name
                      </label>
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
                      <label htmlFor="description" className="text-sm font-medium">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Describe your mess..."
                        value={formData.description}
                        onChange={handleChange}
                        disabled={submitting}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="mealRate" className="text-sm font-medium">
                        Meal Rate (৳)
                      </label>
                      <Input
                        id="mealRate"
                        name="mealRate"
                        type="number"
                        min="1"
                        value={formData.mealRate}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                      />
                      <p className="text-xs text-muted-foreground">Cost per meal in taka</p>
                    </div>

                    <Button type="submit" disabled={submitting} className="w-full">
                      {submitting ? 'Creating...' : 'Create Mess'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Mess Information</CardTitle>
                  <CardDescription>Your current mess details</CardDescription>
                </CardHeader>

                <CardContent>
                  {mess && (
                    <div className="space-y-4">
                      <div className="p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted-foreground">Mess Name</p>
                        <p className="text-lg font-semibold">{mess.name}</p>
                      </div>

                      {mess.description && (
                        <div className="p-4 bg-surface rounded-lg">
                          <p className="text-sm text-muted-foreground">Description</p>
                          <p className="text-lg">{mess.description}</p>
                        </div>
                      )}

                      <div className="p-4 bg-surface rounded-lg">
                        <p className="text-sm text-muted-foreground">Meal Rate</p>
                        <p className="text-lg font-semibold">৳{mess.mealRate} per meal</p>
                      </div>

                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
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
