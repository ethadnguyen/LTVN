import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routes, allRoutes } from '@/utils/routes';
import { accessToken } from '@/constants';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(accessToken);
  const path = request.nextUrl.pathname;

  // Tìm route config cho path hiện tại
  const currentRoute = allRoutes.find((route) => {
    if (typeof route === 'object' && 'path' in route) {
      // Xử lý các route động như /products/:id
      const routePath = route.path.split('/').filter(Boolean);
      const currentPath = path.split('/').filter(Boolean);

      if (routePath.length !== currentPath.length) return false;

      return routePath.every(
        (segment, i) => segment.startsWith(':') || segment === currentPath[i]
      );
    }
    return false;
  });

  if (!currentRoute) {
    return NextResponse.next();
  }

  const isAuthenticated = !!token;

  // Kiểm tra quyền truy cập
  if (currentRoute.auth === 'required' && !isAuthenticated) {
    // Chuyển hướng đến trang đăng nhập nếu route yêu cầu đăng nhập
    const loginUrl = new URL(routes.auth.login.path, request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  if (currentRoute.auth === 'forbidden' && isAuthenticated) {
    // Chuyển hướng về trang chủ nếu user đã đăng nhập nhưng cố truy cập các route như login
    return NextResponse.redirect(new URL(routes.home.path, request.url));
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
