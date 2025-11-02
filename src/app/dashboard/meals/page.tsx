'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  messId: string;
}

interface Meal {
  _id: string;
  userId: User;
  breakfast: number;
  lunch: number;
  dinner: number;
  date: string;
}

export default function MealsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messId, setMessId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUserAndMeals();
  }, [router]);

  const fetchUserAndMeals = async () => {
    try {
      setLoading(true);
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error || !profileRes.data?.messId) {
        setError('Please create or join a mess first');
        return;
      }

      const id = profileRes.data.messId;
      setMessId(id);

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const mealsRes = await apiClient.get<Meal[]>(
        `/meals/mess/${id}/month?year=${year}&month=${month}`
      );
      if (mealsRes.data) {
        setMeals(mealsRes.data);
      }
    } catch (err) {
      setError('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading meals...</p>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Meals</h2>
                <p className="text-muted-foreground">Track and manage meal entries</p>
              </div>
              <Link href="/dashboard/meals/add">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Meal
                </Button>
              </Link>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Meal Entries</CardTitle>
                <CardDescription>All meal records for this month</CardDescription>
              </CardHeader>
              <CardContent>
                {meals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">No meals recorded yet</p>
                    <Link href="/dashboard/meals/add">
                      <Button>Add First Meal</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Member</th>
                          <th className="text-center py-3 px-4 font-semibold">Breakfast</th>
                          <th className="text-center py-3 px-4 font-semibold">Lunch</th>
                          <th className="text-center py-3 px-4 font-semibold">Dinner</th>
                          <th className="text-center py-3 px-4 font-semibold">Total</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {meals.map((meal) => (
                          <tr key={meal._id} className="border-b border-border hover:bg-surface/50">
                            <td className="py-3 px-4">{meal.userId.name}</td>
                            <td className="text-center py-3 px-4">{meal.breakfast}</td>
                            <td className="text-center py-3 px-4">{meal.lunch}</td>
                            <td className="text-center py-3 px-4">{meal.dinner}</td>
                            <td className="text-center py-3 px-4 font-semibold">
                              {meal.breakfast + meal.lunch + meal.dinner}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(meal.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
