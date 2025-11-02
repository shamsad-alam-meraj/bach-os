'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, Mail, Phone, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  messId: string;
}

interface Mess {
  _id: string;
  name: string;
  members: User[];
  managerId: User;
}

export default function MembersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mess, setMess] = useState<Mess | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchMembersData();
  }, [router]);

  const fetchMembersData = async () => {
    try {
      setLoading(true);
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      setCurrentUserId(profileRes.data._id);

      const messRes = await apiClient.get<Mess>(`/mess/${profileRes.data.messId}`);
      if (messRes.data) {
        setMess(messRes.data);
      }
    } catch (err) {
      setError('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading members...</p>
        </div>
      </div>
    );
  }

  const isManager = mess?.managerId._id === currentUserId;

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
                <h2 className="text-3xl font-bold">Members</h2>
                <p className="text-muted-foreground">Manage mess members</p>
              </div>
              {isManager && (
                <Link href="/dashboard/members/add">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Member
                  </Button>
                </Link>
              )}
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {mess && (
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Mess Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Mess Name</p>
                        <p className="text-lg font-semibold">{mess.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Manager</p>
                        <p className="text-lg font-semibold">{mess.managerId.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Members</p>
                        <p className="text-lg font-semibold">{mess.members.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Members List</CardTitle>
                    <CardDescription>All members in this mess</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mess.members.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-4 glass-light rounded-lg border border-white/20 dark:border-white/10"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold">{member.name}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {member.email}
                              </div>
                              {member.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {member.phone}
                                </div>
                              )}
                            </div>
                          </div>
                          {member._id === mess.managerId._id && (
                            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                              Manager
                            </span>
                          )}
                          {member._id === currentUserId && (
                            <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      ))}
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
