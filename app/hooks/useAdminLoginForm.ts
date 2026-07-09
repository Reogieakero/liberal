import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseAdminLoginFormResult {
  username: string;
  password: string;
  error: string;
  isSubmitting: boolean;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Owns all the state and submit logic for the admin login form:
 * field values, in-flight/error state, and the POST to /api/auth/login.
 * The page component just wires this up to inputs and renders the result.
 */
export function useAdminLoginForm(): UseAdminLoginFormResult {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Invalid credentials');
        setIsSubmitting(false);
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return {
    username,
    password,
    error,
    isSubmitting,
    setUsername,
    setPassword,
    handleSubmit,
  };
}