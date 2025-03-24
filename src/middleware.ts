import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import envConfig from "@/config";
import CryptoJS from 'crypto-js';

const SECRET_KEY = envConfig.CRYPTOJS_SECRECT; // Use the same key as above

const privatePaths = ['/dashboard', '/dashboard/played', '/dashboard/favorites', '/dashboard/account'];
const authPaths = ['/login', '/register', '/change-password', '/forgot-pass'];
const adminPaths = ['/dashboard/secret'];
const managerPaths = ['/dashboard/manager'];

// Middleware function
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('sessionToken')?.value;
  const encryptedRole = request.cookies.get('userRole')?.value;

  // Block access to private paths if not logged in
  if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Prevent logged-in users from accessing login/register paths
  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (encryptedRole) {
    try {
      const decryptedRole = CryptoJS.AES.decrypt(encryptedRole, SECRET_KEY).toString(CryptoJS.enc.Utf8);

      // Restrict access to `/dashboard/secret/*` to admin users only
      if (pathname.startsWith('/dashboard/secret') && decryptedRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (pathname.startsWith('/dashboard/manager') && decryptedRole !== 'manager' && decryptedRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Failed to decrypt user role:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/favorites',
    '/dashboard/account',
    '/login',
    '/register',
    '/change-password',
    '/forgot-pass',
    '/dashboard/secret/:path*',
    '/dashboard/manager/:path*'
  ]
};
