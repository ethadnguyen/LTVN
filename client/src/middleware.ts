import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { accessToken } from '@/constants';

// Các route cần authentication
const protectedRoutes = [
  '/cart',
  '/checkout',
  '/profile',
  '/orders',
  '/saved-configs',
];

// Các route không cho phép truy cập khi đã đăng nhập
const authRoutes = ['/auth/sign-in', '/auth/register'];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(accessToken);
  const path = request.nextUrl.pathname;

  // Kiểm tra các route cần authentication
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (!token) {
      // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
      const loginUrl = new URL('/auth/sign-in', request.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Kiểm tra các route auth (login, register)
  if (authRoutes.includes(path)) {
    if (token) {
      // Chuyển hướng về trang chủ nếu đã đăng nhập
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Chỉ định các path cần được middleware xử lý
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
