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
  managerId: User;
}

export default function AddMealPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [messId, setMessId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formData, setFormData] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    date: new Date().toISOString().split('T')[0],
  });

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
      setCurrentUserId(profileRes.data._id);

      // Set default selected user to current user
      setSelectedUserId(profileRes.data._id);

      // Fetch mess details to get members and check if current user is manager
      const messRes = await apiClient.get<Mess>(`/mess/${profileRes.data.messId}`);
      if (messRes.data) {
        setMembers(messRes.data.members);
        setIsManager(messRes.data.managerId._id === profileRes.data._id);
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
      [name]: name === 'date' ? value : Math.max(0, Number.parseInt(value) || 0),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Use selected user ID if manager selected someone else, otherwise use current user ID
      const userIdToUse = isManager && selectedUserId ? selectedUserId : currentUserId;

      const res = await apiClient.post('/meals', {
        messId,
        userId: userIdToUse,
        breakfast: formData.breakfast,
        lunch: formData.lunch,
        dinner: formData.dinner,
        date: formData.date,
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      router.push('/dashboard/meals');
    } catch (err) {
      setError('Failed to add meal');
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
            <Link
              href="/dashboard/meals"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Meals
            </Link>

            <Card>
              <CardHeader>
                <CardTitle>Add Meal Entry</CardTitle>
                <CardDescription>
                  {isManager
                    ? 'Record meal consumption for yourself or other members'
                    : 'Record your meal consumption for today'}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  {/* Member Selection - Only show for managers */}
                  {isManager && (
                    <div className="space-y-2">
                      <Label htmlFor="member">Select Member</Label>
                      <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a member" />
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
                  )}

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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="breakfast">Breakfast</Label>
                      <Input
                        id="breakfast"
                        name="breakfast"
                        type="number"
                        min="0"
                        value={formData.breakfast}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lunch">Lunch</Label>
                      <Input
                        id="lunch"
                        name="lunch"
                        type="number"
                        min="0"
                        value={formData.lunch}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dinner">Dinner</Label>
                      <Input
                        id="dinner"
                        name="dinner"
                        type="number"
                        min="0"
                        value={formData.dinner}
                        onChange={handleChange}
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-surface rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Total Meals</p>
                    <p className="text-3xl font-bold">
                      {formData.breakfast + formData.lunch + formData.dinner}
                    </p>
                    {isManager && selectedUserId && (
                      <p className="text-sm text-muted-foreground mt-2">
                        For: {members.find((m) => m._id === selectedUserId)?.name}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={submitting} className="flex-1">
                      {submitting ? 'Adding...' : 'Add Meal'}
                    </Button>
                    <Link href="/dashboard/meals" className="flex-1">
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
