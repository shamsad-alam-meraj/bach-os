'use client';

import type React from 'react';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
  role: string;
  messId?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUserProfile();
  }, [router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<UserProfile>('/users/profile');
      if (res.error) {
        setError(res.error);
        return;
      }

      if (res.data) {
        setUser(res.data);
        setFormData({
          name: res.data.name,
          phone: res.data.phone || '',
          dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.split('T')[0] : '',
        });
      }
    } catch (err) {
      setError('Failed to load profile');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const res = await apiClient.put<UserProfile>('/users/profile', {
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      if (res.data) {
        setUser(res.data);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
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

        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold">Profile</h2>
              <p className="text-muted-foreground">Manage your account information</p>
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

            {user && (
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Your account details</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    )}
                  </CardHeader>

                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="phone" className="text-sm font-medium">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={submitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="dateOfBirth" className="text-sm font-medium">
                            Date of Birth
                          </label>
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            disabled={submitting}
                          />
                        </div>

                        <div className="flex gap-4">
                          <Button type="submit" disabled={submitting} className="flex-1">
                            {submitting ? 'Saving...' : 'Save Changes'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-transparent"
                            disabled={submitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 glass-light rounded-lg">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="text-lg font-semibold">{user.name}</p>
                          </div>
                        </div>

                        <div className="p-4 glass-light rounded-lg">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="text-lg font-semibold">{user.email}</p>
                        </div>

                        {user.phone && (
                        <div className="p-4 glass-light rounded-lg">
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="text-lg font-semibold">{user.phone}</p>
                          </div>
                        )}

                        {user.dateOfBirth && (
                        <div className="p-4 glass-light rounded-lg">
                            <p className="text-sm text-muted-foreground">Date of Birth</p>
                            <p className="text-lg font-semibold">
                              {new Date(user.dateOfBirth).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        <div className="p-4 glass-light rounded-lg">
                          <p className="text-sm text-muted-foreground">Role</p>
                          <p className="text-lg font-semibold capitalize">{user.role}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
