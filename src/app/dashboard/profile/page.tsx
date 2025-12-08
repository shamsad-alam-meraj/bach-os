'use client';

import type React from 'react';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import type { User } from '@/types/api';
import { motion } from 'framer-motion';
import { AlertCircle, Bell, Calendar, Clock, Edit3, Globe, Mail, Moon, Phone, Shield, Sun, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
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
      const res = await apiClient.get<User>('/users/profile');
      if (res.error) {
        setError(typeof res.error === 'string' ? res.error : res.error.message || 'Failed to load profile');
        return;
      }

      if (res.data) {
        setUser(res.data);
        setFormData({
          name: res.data.name,
          phone: res.data.phone || '',
          dateOfBirth: res.data.dateOfBirth ? new Date(res.data.dateOfBirth).toISOString().split('T')[0] : '',
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
      const res = await apiClient.put<User>('/users/profile', {
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
      });

      if (res.error) {
        setError(typeof res.error === 'string' ? res.error : res.error.message || 'Failed to update profile');
        return;
      }

      if (res.data) {
        // Refetch the complete profile data to ensure all updates are reflected
        await fetchUserProfile();
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

        <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto"
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
              <div className="space-y-8">
                {/* Personal Information Card */}
                <Card className="glass-card">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Manage your account details and preferences</CardDescription>
                    </div>
                    {!isEditing && (
                      <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2 w-full sm:w-auto">
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    )}
                  </CardHeader>

                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                              <UserIcon className="w-4 h-4" />
                              Full Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              disabled={submitting}
                              className="glass-light"
                            />
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Phone Number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              disabled={submitting}
                              className="glass-light"
                            />
                          </div>

                          <div className="space-y-2 sm:col-span-2">
                            <label htmlFor="dateOfBirth" className="text-sm font-medium flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Date of Birth
                            </label>
                            <Input
                              id="dateOfBirth"
                              name="dateOfBirth"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                              disabled={submitting}
                              className="glass-light"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                          <Button type="submit" disabled={submitting} className="flex-1 gap-2 order-2 sm:order-1">
                            {submitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Edit3 className="w-4 h-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-transparent order-1 sm:order-2"
                            disabled={submitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-muted-foreground">Full Name</p>
                              <p className="text-base sm:text-lg font-semibold truncate">{user.name}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-muted-foreground">Email Address</p>
                              <p className="text-base sm:text-lg font-semibold break-all sm:truncate">{user.email}</p>
                            </div>
                          </div>

                          {user.phone && (
                            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-muted-foreground">Phone Number</p>
                                <p className="text-base sm:text-lg font-semibold truncate">{user.phone}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional Information */}
                        <div className="space-y-4">
                          {user.dateOfBirth && (
                            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm text-muted-foreground">Date of Birth</p>
                                <p className="text-base sm:text-lg font-semibold">
                                  {new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-muted-foreground">Account Role</p>
                              <p className="text-base sm:text-lg font-semibold capitalize">{user.role}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              {user.preferences?.theme === 'dark' ? <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-muted-foreground">Preferred Theme</p>
                              <p className="text-base sm:text-lg font-semibold capitalize">{user.preferences?.theme || 'light'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Preferences Card */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Preferences & Settings
                    </CardTitle>
                    <CardDescription>Your app preferences and notification settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">Notifications</p>
                          <p className="font-semibold">{user.preferences?.notifications ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">Language</p>
                          <p className="font-semibold uppercase">{user.preferences?.language || 'en'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          {user.preferences?.theme === 'dark' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">Theme</p>
                          <p className="font-semibold capitalize">{user.preferences?.theme || 'light'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Information Card */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>Account creation and last update details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">Account Created</p>
                          <p className="font-semibold text-sm sm:text-base">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-light rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-semibold text-sm sm:text-base">
                            {new Date(user.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(user.updatedAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
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
