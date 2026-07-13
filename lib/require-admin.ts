import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AUTH_COOKIE_NAME } from '@/lib/auth';

/**
 * Call at the top of every protected API route handler.
 * Returns a 401 NextResponse if the request isn't from a logged-in admin,
 * or null if it's fine to proceed.
 *
 * usage:
 *   const unauthorized = await requireAdmin(request);
 *   if (unauthorized) return unauthorized;
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = await verifyAdminToken(token);

  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}