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

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold">Members</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Manage mess members</p>
              </div>
              {isManager && (
                <Link href="/dashboard/members/add" className="w-full sm:w-auto">
                  <Button className="gap-2 w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Add Member
                  </Button>
                </Link>
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 sm:mb-6 flex items-start sm:items-center gap-2 p-3 sm:p-4 glass-light bg-destructive/10 text-destructive rounded-lg text-sm sm:text-base">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span>{error}</span>
              </div>
            )}

            {mess && (
              <div className="space-y-4 sm:space-y-6">
                {/* Mess Information Card */}
                <Card className="glass-card">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl">Mess Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Mess Name</p>
                      <p className="text-base sm:text-lg font-semibold">{mess.name}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Manager</p>
                      <p className="text-base sm:text-lg font-semibold">{mess.managerId.name}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">Total Members</p>
                      <p className="text-base sm:text-lg font-semibold">{mess.members.length}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Members List Card */}
                <Card className="glass-card">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl">Members List</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      All members in this mess
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {mess.members.map((member) => (
                        <div
                          key={member._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 glass-light rounded-lg border border-white/20 dark:border-white/10 gap-3 sm:gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg truncate">
                              {member.name}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              {member.phone && (
                                <div className="flex items-center gap-1 truncate">
                                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="truncate">{member.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Badges Section */}
                          <div className="flex flex-wrap gap-2 sm:gap-3 self-start sm:self-auto">
                            {member._id === mess.managerId._id && (
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full whitespace-nowrap">
                                Manager
                              </span>
                            )}
                            {member._id === currentUserId && (
                              <span className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full whitespace-nowrap">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Empty State */}
                    {mess.members.length === 0 && (
                      <div className="text-center py-8 sm:py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                          <Mail className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No Members</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {isManager
                            ? 'Get started by adding your first member'
                            : 'No members have been added yet'}
                        </p>
                        {isManager && (
                          <Link href="/dashboard/members/add">
                            <Button className="gap-2">
                              <Plus className="w-4 h-4" />
                              Add Member
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* No Mess State */}
            {!mess && !error && (
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No Mess Found</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      You need to create or join a mess to manage members
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/dashboard/create-mess">
                        <Button variant="default">Create Mess</Button>
                      </Link>
                      <Link href="/dashboard/join-mess">
                        <Button variant="outline">Join Mess</Button>
                      </Link>
                    </div>
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
