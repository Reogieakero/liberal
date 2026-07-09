import { SignJWT, jwtVerify } from 'jose';

const rawSecret = process.env.JWT_SECRET;

if (!rawSecret) {
  throw new Error(
    'JWT_SECRET is not set. Add it to .env.local (see .env.local.example).'
  );
}

const secretKey = new TextEncoder().encode(rawSecret);
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export const AUTH_COOKIE_NAME = 'admin_session';

export interface AdminTokenPayload {
  sub: string;
}

export async function signAdminToken(username: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(secretKey);
}

export async function verifyAdminToken(
  token: string | undefined
): Promise<AdminTokenPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (typeof payload.sub !== 'string') return null;
    return { sub: payload.sub };
  } catch {
    return null;
  }
}