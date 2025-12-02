'use client';

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
import { AlertCircle, Crown, Edit, Search, Shield, Trash2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
  messId?: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    profileImage: '',
    role: 'user' as 'admin' | 'user' | 'manager',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchUsers();
  }, [router]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch current user profile
      const profileRes = await apiClient.get<User>('/users/profile');
      if (profileRes.error) {
        setError(profileRes.error.message || 'Failed to load profile');
        return;
      }

      if (
        profileRes.data?.role?.toLowerCase() !== 'admin' &&
        !profileRes.data?.email?.toLowerCase()?.includes('@bachos.com')
      ) {
        setError('Access denied. Admin privileges required.');
        return;
      }

      setCurrentUser(profileRes.data);

      // Fetch all users
      const usersRes = await apiClient.get<User[]>('/users/all-users');
      if (usersRes.data) {
        setUsers(usersRes.data);
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      profileImage: user.profileImage || '',
      role: user.role,
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
    setIsDeleting(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await apiClient.put(`/users/${editingUser.id}`, {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        dateOfBirth: editFormData.dateOfBirth,
        profileImage: editFormData.profileImage,
        role: editFormData.role,
      });

      if (res.error) {
        setError(res.error.message || 'Failed to update user');
        return;
      }

      setIsEditing(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    try {
      const res = await apiClient.delete(`/users/${deletingUser.id}`);
      if (res.error) {
        setError(res.error.message || 'Failed to delete user');
        return;
      }

      setIsDeleting(false);
      setDeletingUser(null);
      await fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      setIsDeleting(false);
      setDeletingUser(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setDeletingUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
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
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">User Management</h2>
                <p className="text-muted-foreground">Manage all users in the system</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 glass-light bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Filters */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="search">Search Users</Label>
                    <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Filter by Role</Label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Users ({filteredUsers.length})
                </CardTitle>
                <CardDescription>All registered users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">User</th>
                          <th className="text-left py-3 px-4 font-semibold">Role</th>
                          <th className="text-left py-3 px-4 font-semibold">Phone</th>
                          <th className="text-left py-3 px-4 font-semibold">Mess</th>
                          <th className="text-right py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-white/10 dark:border-white/5 hover:bg-white/5"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {user.role?.toLowerCase() === 'admin' && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                                {user.role?.toLowerCase() === 'manager' && (
                                  <Shield className="w-4 h-4 text-blue-500" />
                                )}
                                <span className="capitalize">{user.role}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{user.phone || 'N/A'}</td>
                            <td className="py-3 px-4">
                              {user.messId ? 'Assigned' : 'Not assigned'}
                            </td>
                            <td className="text-right py-3 px-4">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(user)}
                                  title="Edit user"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                {user.id !== currentUser?.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClick(user)}
                                    title="Delete user"
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit User Modal */}
            {isEditing && editingUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Edit User</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingUser(null);
                      }}
                    >
                      ×
                    </Button>
                  </div>

                  <form onSubmit={handleUpdateUser}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, name: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editFormData.email}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input
                          id="edit-phone"
                          value={editFormData.phone}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, phone: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-dob">Date of Birth</Label>
                        <Input
                          id="edit-dob"
                          type="date"
                          value={editFormData.dateOfBirth}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, dateOfBirth: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="edit-role">Role</Label>
                        <Select
                          value={editFormData.role}
                          onValueChange={(value: 'admin' | 'user' | 'manager') =>
                            setEditFormData({ ...editFormData, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <Button type="submit" className="flex-1">
                        Update User
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingUser(null);
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
            {isDeleting && deletingUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center gap-2 mb-4">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <h3 className="text-lg font-semibold text-destructive">Delete User</h3>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>

                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{deletingUser.name}</p>
                        <p className="text-sm text-muted-foreground">{deletingUser.email}</p>
                      </div>
                      <span className="capitalize px-2 py-1 bg-secondary/20 rounded text-sm">
                        {deletingUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDeleteConfirm} className="flex-1">
                      Delete User
                    </Button>
                    <Button variant="outline" onClick={handleDeleteCancel} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
