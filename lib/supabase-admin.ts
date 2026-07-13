import { createClient } from '@supabase/supabase-js';

// SERVER-ONLY. Never import this file from a "use client" component —
// the service role key must never reach the browser bundle.
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set.');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (server-only, do NOT prefix with NEXT_PUBLIC_).');
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);