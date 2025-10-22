'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'premium' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  uploads?: number;
  recommendations?: number;
  purchases?: number;
}

interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    role?: string;
  };
  banned_until?: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
}

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(10);

  const { user: currentUser } = useAuth();

  // Check if current user is admin
  const isAdmin = currentUser?.user_metadata?.role === 'admin' || currentUser?.email === 'admin@artdecor.ai';

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users from Supabase auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
        page: currentPage,
        perPage: usersPerPage
      });

      if (authError) {
        // Fallback: try to get users from profiles table if admin access is not available
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .range((currentPage - 1) * usersPerPage, currentPage * usersPerPage - 1);

        if (profileError) {
          console.error('Profile error:', profileError);
          // Use mock data as fallback
          setUsers(getMockUsers());
          setTotalUsers(5);
        } else {
          const formattedUsers = profiles.map(profile => ({
            id: profile.id,
            email: profile.email,
            name: profile.full_name,
            role: profile.role || 'user',
            status: profile.status || 'active',
            created_at: profile.created_at,
            last_sign_in_at: profile.last_sign_in_at,
            email_confirmed_at: profile.email_confirmed_at,
            uploads: profile.uploads || 0,
            recommendations: profile.recommendations || 0,
            purchases: profile.purchases || 0
          }));
          setUsers(formattedUsers);
          setTotalUsers(formattedUsers.length);
        }
      } else {
        // Format auth users data
        const formattedUsers = authUsers.users.map((authUser: SupabaseUser) => ({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
          role: authUser.user_metadata?.role || 'user',
          status: authUser.banned_until ? 'suspended' : 'active',
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at,
          email_confirmed_at: authUser.email_confirmed_at,
          uploads: 0,
          recommendations: 0,
          purchases: 0
        })) as User[];
        setUsers(formattedUsers);
        setTotalUsers(authUsers.total || formattedUsers.length);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      // Use mock data as fallback
      setUsers(getMockUsers());
      setTotalUsers(5);
    } finally {
      setLoading(false);
    }
  }, [currentPage, usersPerPage]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, currentPage, fetchUsers]);

  const getMockUsers = (): User[] => [
    {
      id: '1',
      email: 'john.doe@gmail.com',
      name: 'John Doe',
      role: 'user',
      status: 'active',
      created_at: '2024-01-10T00:00:00Z',
      last_sign_in_at: '2024-01-15T12:00:00Z',
      email_confirmed_at: '2024-01-10T00:00:00Z',
      uploads: 5,
      recommendations: 12,
      purchases: 2
    },
    {
      id: '2',
      email: 'sarah.smith@gmail.com',
      name: 'Sarah Smith',
      role: 'premium',
      status: 'active',
      created_at: '2024-01-08T00:00:00Z',
      last_sign_in_at: '2024-01-15T13:00:00Z',
      email_confirmed_at: '2024-01-08T00:00:00Z',
      uploads: 8,
      recommendations: 25,
      purchases: 5
    },
    {
      id: '3',
      email: 'mike.wilson@gmail.com',
      name: 'Mike Wilson',
      role: 'user',
      status: 'inactive',
      created_at: '2024-01-05T00:00:00Z',
      last_sign_in_at: '2024-01-12T00:00:00Z',
      email_confirmed_at: '2024-01-05T00:00:00Z',
      uploads: 2,
      recommendations: 6,
      purchases: 0
    },
    {
      id: '4',
      email: 'emma.brown@gmail.com',
      name: 'Emma Brown',
      role: 'admin',
      status: 'active',
      created_at: '2024-01-01T00:00:00Z',
      last_sign_in_at: '2024-01-15T14:30:00Z',
      email_confirmed_at: '2024-01-01T00:00:00Z',
      uploads: 15,
      recommendations: 45,
      purchases: 8
    },
    {
      id: '5',
      email: 'alex.johnson@gmail.com',
      name: 'Alex Johnson',
      role: 'user',
      status: 'active',
      created_at: '2024-01-12T00:00:00Z',
      last_sign_in_at: '2024-01-15T09:00:00Z',
      email_confirmed_at: '2024-01-12T00:00:00Z',
      uploads: 3,
      recommendations: 9,
      purchases: 1
    }
  ];

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user.id)
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    try {
      switch (action) {
        case 'suspend':
          // Implement suspend logic
          console.log(`Suspending users:`, selectedUsers);
          break;
        case 'activate':
          // Implement activate logic
          console.log(`Activating users:`, selectedUsers);
          break;
        case 'export':
          // Implement export logic
          console.log(`Exporting users:`, selectedUsers);
          break;
      }
      setSelectedUsers([]);
      await fetchUsers(); // Refresh data
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      switch (action) {
        case 'suspend':
          // Implement suspend logic
          console.log(`Suspending user:`, userId);
          break;
        case 'activate':
          // Implement activate logic
          console.log(`Activating user:`, userId);
          break;
        case 'delete':
          // Implement delete logic
          console.log(`Deleting user:`, userId);
          break;
      }
      await fetchUsers(); // Refresh data
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastActive = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const totalPages = Math.ceil(totalUsers / usersPerPage);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access the admin panel.</p>
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h2>
          <p className="text-gray-600">Manage users, system settings, and platform operations</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['users', 'analytics', 'settings', 'logs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <div>
                {/* User Management Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                      <span className="text-sm text-gray-600">
                        {loading ? 'Loading...' : `${filteredUsers.length} users`}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleBulkAction('export')}
                        disabled={selectedUsers.length === 0}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Export Selected
                      </button>
                      <button
                        onClick={() => handleBulkAction('suspend')}
                        disabled={selectedUsers.length === 0}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Suspend Selected
                      </button>
                      <button
                        onClick={() => handleBulkAction('activate')}
                        disabled={selectedUsers.length === 0}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Activate Selected
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center">
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                <span className="ml-2 text-gray-600">Loading users...</span>
                              </div>
                            </td>
                          </tr>
                        ) : filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                              No users found
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => handleSelectUser(user.id)}
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.name || 'No name'}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                  <div className="text-xs text-gray-400">
                                    Joined {formatDate(user.created_at)}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                  user.role === 'premium' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  user.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div>Last active: {formatLastActive(user.last_sign_in_at)}</div>
                                <div>Uploads: {user.uploads || 0} | Recs: {user.recommendations || 0}</div>
                                <div className="text-xs text-gray-400">
                                  {user.email_confirmed_at ? 'Email verified' : 'Email not verified'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                                    className={`${
                                      user.status === 'active' 
                                        ? 'text-yellow-600 hover:text-yellow-900' 
                                        : 'text-green-600 hover:text-green-900'
                                    }`}
                                  >
                                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                                  </button>
                                  <button
                                    onClick={() => handleUserAction(user.id, 'delete')}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-2 text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Total Users</h4>
                    <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
                    <div className="text-sm text-gray-600">registered users</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Active Users</h4>
                    <div className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">currently active</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Premium Users</h4>
                    <div className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === 'premium').length}
                    </div>
                    <div className="text-sm text-gray-600">premium subscribers</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Send email notifications to users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                      <p className="text-sm text-gray-600">Enable maintenance mode</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Logs</h3>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                  <div>2024-01-15 14:30:15 [INFO] User john.doe@gmail.com uploaded room photo</div>
                  <div>2024-01-15 14:30:18 [INFO] AI analysis completed for room photo</div>
                  <div>2024-01-15 14:30:20 [INFO] Generated 5 artwork recommendations</div>
                  <div>2024-01-15 14:30:22 [INFO] User sarah.smith@gmail.com started chat session</div>
                  <div>2024-01-15 14:30:25 [INFO] AI chat response generated</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
