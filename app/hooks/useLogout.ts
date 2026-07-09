import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Handles calling /api/auth/logout and redirecting back to the login
 * page once the session cookie has been cleared server-side.
 */
export function useLogout() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/admin-login');
      router.refresh();
    }
  };

  return { logout, isLoggingOut };
}