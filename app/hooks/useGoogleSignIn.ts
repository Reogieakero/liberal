"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Kicks off the Google OAuth flow via Supabase for student sign-in.
 *
 * Supabase handles the Google redirect, then sends the user back to
 * /auth/callback (see app/auth/callback/route.ts) which exchanges the
 * code for a session. Supabase auto-creates the user record on first
 * sign-in — there's no separate registration step.
 */
export function useGoogleSignIn() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setIsRedirecting(true);

    const supabase = createClient();

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        queryParams: {
          access_type: "online",
          prompt: "select_account",
        },
      },
    });

    if (oauthError) {
      setError("Something went wrong starting Google sign-in. Please try again.");
      setIsRedirecting(false);
    }
  }, []);

  return { signInWithGoogle, isRedirecting, error };
}