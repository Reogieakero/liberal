import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAdminToken, AUTH_COOKIE_NAME } from '@/lib/auth';

const EIGHT_HOURS_IN_SECONDS = 60 * 60 * 8;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username : '';
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const validUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!validUsername || !passwordHash) {
    console.error(
      'ADMIN_USERNAME or ADMIN_PASSWORD_HASH is missing from the environment.'
    );
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const usernameMatches = username === validUsername;
  const passwordMatches = await bcrypt.compare(password, passwordHash);

  if (!usernameMatches || !passwordMatches) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signAdminToken(username);

  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: EIGHT_HOURS_IN_SECONDS,
  });

  return response;
}