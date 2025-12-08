'use client';

import type React from 'react';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

export default function AddMemberPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [messId, setMessId] = useState('');
  const [email, setEmail] = useState('');

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

      setMessId(profileRes.data.messId);
    } catch (err) {
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (!email) {
        setError('Please enter an email address');
        setSubmitting(false);
        return;
      }

      const res = await apiClient.post(`/mess/${messId}/members`, { email });

      if (res.error) {
        setError(res.error);
        return;
      }

      setSuccess('Member added successfully!');
      setEmail('');
      setTimeout(() => {
        router.push('/dashboard/members');
      }, 1500);
    } catch (err) {
      setError('Failed to add member');
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
              href="/dashboard/members"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Members
            </Link>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Add Member</CardTitle>
                <CardDescription>Invite a user to join this mess by their email</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 p-4 glass-light bg-green-100/50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {success}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="member@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={submitting}
                    />
                    <p className="text-xs text-muted-foreground">
                      The user must already have an account in the system
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? 'Adding...' : 'Add Member'}
                    </Button>
                    <Link href="/dashboard/members" className="flex-1">
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
