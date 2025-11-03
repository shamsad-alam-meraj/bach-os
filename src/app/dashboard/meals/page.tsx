'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, Crown, Edit, Filter, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  messId: string;
  role?: string;
}

interface Meal {
  _id: string;
  userId: User;
  breakfast: number;
  lunch: number;
  dinner: number;
  date: string;
  canEdit?: boolean;
  canDelete?: boolean;
}

interface Mess {
  _id: string;
  managerId: {
    _id: string;
    name: string;
    email: string;
  };
  members: User[];
}

type TimeFilter = 'today' | 'week' | 'month' | 'all';

export default function MealsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messId, setMessId] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentMess, setCurrentMess] = useState<Mess | null>(null);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [members, setMembers] = useState<User[]>([]);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deletingMeal, setDeletingMeal] = useState<Meal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

      const userData = profileRes.data;
      setCurrentUser(userData);
      const id = userData.messId;
      setMessId(id);

      // Fetch mess details to get manager information
      const messRes = await apiClient.get<Mess>(`/mess/${id}`);
      if (messRes.data) {
        setCurrentMess(messRes.data);
        setMembers(messRes.data.members);

        // Fetch all meals for the mess
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const mealsRes = await apiClient.get<Meal[]>(
          `/meals/mess/${id}?year=${year}&month=${month}`
        );
        if (mealsRes.data) {
          // Check if current user is the manager
          const isManager = messRes.data.managerId._id === userData._id;
          const mealsWithPermissions = mealsRes.data.map((meal) => ({
            ...meal,
            canEdit: isManager,
            canDelete: isManager,
          }));
          setAllMeals(mealsWithPermissions);
          applyFilters(mealsWithPermissions, timeFilter, memberFilter);
        }
      }
    } catch (err) {
      setError('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  // Add this useEffect to re-apply permissions when currentMess is loaded
  useEffect(() => {
    if (currentMess && currentUser && allMeals.length > 0) {
      const isManager = currentMess.managerId._id === currentUser._id;
      const mealsWithPermissions = allMeals.map((meal) => ({
        ...meal,
        canEdit: isManager,
        canDelete: isManager,
      }));
      setAllMeals(mealsWithPermissions);
      applyFilters(mealsWithPermissions, timeFilter, memberFilter);
    }
  }, [currentMess, currentUser]);

  const applyFilters = (mealsList: Meal[], time: TimeFilter, member: string) => {
    let filtered = [...mealsList];

    // Apply time filter
    const now = new Date();
    switch (time) {
      case 'today':
        const today = new Date().toDateString();
        filtered = filtered.filter((meal) => new Date(meal.date).toDateString() === today);
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter((meal) => new Date(meal.date) >= weekAgo);
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter((meal) => new Date(meal.date) >= monthStart);
        break;
      case 'all':
        // No time filter applied
        break;
    }

    // Apply member filter
    if (member !== 'all') {
      filtered = filtered.filter((meal) => meal.userId._id === member);
    }

    setMeals(filtered);
  };

  const handleTimeFilterChange = (value: TimeFilter) => {
    setTimeFilter(value);
    applyFilters(allMeals, value, memberFilter);
  };

  const handleMemberFilterChange = (value: string) => {
    setMemberFilter(value);
    applyFilters(allMeals, timeFilter, value);
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setIsEditing(true);
  };

  const handleDeleteClick = (meal: Meal) => {
    setDeletingMeal(meal);
    setIsDeleting(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMeal) return;

    try {
      const res = await apiClient.delete(`/meals/${deletingMeal._id}`);
      if (res.error) {
        setError(res.error || 'Failed to delete meal record');
        return;
      }

      // Refresh meals
      await fetchUserAndMeals();
      setIsDeleting(false);
      setDeletingMeal(null);
    } catch (err) {
      setError('Failed to delete meal record');
      setIsDeleting(false);
      setDeletingMeal(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setDeletingMeal(null);
  };

  const handleUpdateMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeal) return;

    try {
      const res = await apiClient.put(`/meals/${editingMeal._id}`, {
        breakfast: editingMeal.breakfast,
        lunch: editingMeal.lunch,
        dinner: editingMeal.dinner,
        date: editingMeal.date,
      });

      if (res.error) {
        setError(res.error);
        return;
      }

      setIsEditing(false);
      setEditingMeal(null);
      await fetchUserAndMeals();
    } catch (err) {
      setError('Failed to update meal record');
    }
  };

  const clearFilters = () => {
    setTimeFilter('month');
    setMemberFilter('all');
    applyFilters(allMeals, 'month', 'all');
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

  // Check if current user is the manager by comparing IDs
  const isManager = currentMess?.managerId?._id === currentUser?._id;

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
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-bold">Meals</h2>
                  {isManager && <Crown className="w-6 h-6 text-yellow-500" />}
                </div>
                <p className="text-muted-foreground">
                  {isManager ? 'Manage all meal entries' : 'View meal entries'}
                </p>
              </div>
              {isManager && (
                <Link href="/dashboard/meals/add">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Meal
                  </Button>
                </Link>
              )}
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
                <Button variant="ghost" size="sm" onClick={() => setError('')}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Filters */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Time Period</label>
                    <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Member</label>
                    <Select value={memberFilter} onValueChange={handleMemberFilterChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        {members.map((member) => (
                          <SelectItem key={member._id} value={member._id}>
                            {member.name}
                            {member._id === currentMess?.managerId?._id && ' 👑'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Meal Modal */}
            {isEditing && editingMeal && isManager && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Edit Meal Record</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Editing meal for: <strong>{editingMeal.userId.name}</strong>
                  </p>
                  <form onSubmit={handleUpdateMeal}>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Breakfast</label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={editingMeal.breakfast}
                          onChange={(e) =>
                            setEditingMeal({
                              ...editingMeal,
                              breakfast: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Lunch</label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={editingMeal.lunch}
                          onChange={(e) =>
                            setEditingMeal({
                              ...editingMeal,
                              lunch: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Dinner</label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={editingMeal.dinner}
                          onChange={(e) =>
                            setEditingMeal({
                              ...editingMeal,
                              dinner: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Date</label>
                        <Input
                          type="date"
                          value={editingMeal.date.split('T')[0]}
                          onChange={(e) =>
                            setEditingMeal({
                              ...editingMeal,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <Button type="submit" className="flex-1">
                        Update Meal
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingMeal(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleting && deletingMeal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4 text-destructive">
                    Delete Meal Record
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Are you sure you want to delete this meal record?
                  </p>
                  <div className="bg-muted p-3 rounded-lg mb-4">
                    <p className="font-medium">{deletingMeal.userId.name}</p>
                    <p className="text-sm">
                      {new Date(deletingMeal.date).toLocaleDateString()} • B:{' '}
                      {deletingMeal.breakfast}, L: {deletingMeal.lunch}, D: {deletingMeal.dinner}
                    </p>
                  </div>
                  <p className="text-sm text-destructive mb-4">This action cannot be undone.</p>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDeleteConfirm} className="flex-1">
                      Delete
                    </Button>
                    <Button variant="outline" onClick={handleDeleteCancel} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Meal Entries</CardTitle>
                <CardDescription>
                  {meals.length} record(s) found
                  {timeFilter !== 'all' && ` for ${timeFilter}`}
                  {memberFilter !== 'all' &&
                    ` • ${members.find((m) => m._id === memberFilter)?.name}`}
                  {!isManager && ' • View only'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {meals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">No meals found matching your filters</p>
                    {isManager && (
                      <Link href="/dashboard/meals/add">
                        <Button>Add First Meal</Button>
                      </Link>
                    )}
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
                          {isManager && (
                            <th className="text-center py-3 px-4 font-semibold">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {meals.map((meal) => (
                          <tr
                            key={meal._id}
                            className="border-b border-white/10 dark:border-white/5 hover:bg-white/5"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {meal.userId.name}
                                {meal.userId._id === currentMess?.managerId?._id && (
                                  <Crown className="w-4 h-4 text-yellow-500" title="Manager" />
                                )}
                              </div>
                            </td>
                            <td className="text-center py-3 px-4">{meal.breakfast}</td>
                            <td className="text-center py-3 px-4">{meal.lunch}</td>
                            <td className="text-center py-3 px-4">{meal.dinner}</td>
                            <td className="text-center py-3 px-4 font-semibold">
                              {meal.breakfast + meal.lunch + meal.dinner}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(meal.date).toLocaleDateString()}
                            </td>
                            {isManager && (
                              <td className="py-3 px-4">
                                <div className="flex justify-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(meal)}
                                    title="Edit meal record"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClick(meal)}
                                    title="Delete meal record"
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info for regular members */}
            {!isManager && (
              <Card className="glass-card mt-6 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-500">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">
                      <strong>View Only:</strong> Only mess managers can add, edit, or delete meal
                      records. Contact your mess manager for any corrections.
                    </p>
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
