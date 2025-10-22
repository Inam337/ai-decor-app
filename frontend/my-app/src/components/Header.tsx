'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine user role (you can modify this logic based on your user data structure)
  const isAdmin = user?.email?.includes('admin') || user?.user_metadata?.role === 'admin';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  // Role-based styling
  const headerGradient = isAdmin
    ? 'bg-gradient-to-r from-red-500/90 to-orange-500/70'
    : 'bg-gradient-to-r from-purple-500/90 to-blue-500/70';

  const logoGradient = isAdmin
    ? 'bg-gradient-to-r from-red-600 to-orange-600'
    : 'bg-gradient-to-r from-purple-600 to-blue-600';

  const signOutGradient = isAdmin
    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';

  return (
    <header className={`${headerGradient} backdrop-blur-sm border-b fixed top-0 left-0 z-90 w-full border-gray-200/50 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 py-1">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className={`w-10 h-10 ${logoGradient} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">
              Art.Decor.AI
              {isAdmin && (
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full text-white font-medium">
                  ADMIN
                </span>
              )}
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:drop-shadow-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/chat"
              className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:drop-shadow-sm"
            >
              Chat
            </Link>
            <Link
              href="/trending"
              className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:drop-shadow-sm"
            >
              Trending
            </Link>

            {/* Admin-only links */}
            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:drop-shadow-sm"
                >
                  Admin Panel
                </Link>
                <Link
                  href="/admin/users"
                  className="text-white/90 hover:text-white font-medium transition-colors duration-200 hover:drop-shadow-sm"
                >
                  Users
                </Link>
              </>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 transition-all duration-200 backdrop-blur-sm"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>

                {/* User Info */}
                <div className="text-left">
                  <p className="text-white text-sm font-medium">
                    {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-white/70 text-xs">
                    {isAdmin ? 'Administrator' : 'User'}
                  </p>
                </div>

                {/* Dropdown Arrow */}
                <svg
                  className={`w-4 h-4 text-white transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm z-80 animate-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${isAdmin
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                          }`}>
                          {isAdmin ? 'Administrator' : 'User'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Preferences
                    </Link>

                    <Link
                      href="/chat-history"
                      className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat History
                    </Link>

                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-100 my-2"></div>
                        <Link
                          href="/admin"
                          className="flex items-center px-6 py-3 text-red-700 hover:bg-red-50 transition-colors duration-150"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Admin Panel
                        </Link>
                        <Link
                          href="/admin/users"
                          className="flex items-center px-6 py-3 text-red-700 hover:bg-red-50 transition-colors duration-150"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          Manage Users
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-colors duration-150"
                    >
                      <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
