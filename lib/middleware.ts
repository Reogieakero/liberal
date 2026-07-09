import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = await verifyAdminToken(token);

  if (!payload) {
    const loginUrl = new URL('/admin-login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};