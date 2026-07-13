"use client";

import { useState, useCallback } from "react";

export function useGoogleSignIn() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setIsRedirecting(true);
    try {
      window.location.href = "/api/auth/google/student"; // replace with your real OAuth start route
    } catch (err) {
      setError("Something went wrong starting Google sign-in. Please try again.");
      setIsRedirecting(false);
    }
  }, []);

  return { signInWithGoogle, isRedirecting, error };
}