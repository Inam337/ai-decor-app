'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Pages where header should NOT be shown
  const noHeaderPages = [
    '/auth',
    '/auth/signin',
    '/auth/signup',
    '/auth/reset-password',
    '/auth/forgot-password'
  ];

  // Check if current path should not show header
  const shouldHideHeader = noHeaderPages.some(page => pathname.startsWith(page));

  // Don't show header on auth pages or if user is not logged in
  if (shouldHideHeader || !user) {
    return null;
  }

  return <Header />;
}
