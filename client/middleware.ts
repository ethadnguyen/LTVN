import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routes, allRoutes, RouteConfig } from './src/utils/routes';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has('access_token');

  // Find the matching route configuration
  const matchingRoute = allRoutes.find((route) => route.path === pathname) as
    | RouteConfig
    | undefined;

  if (matchingRoute) {
    if (matchingRoute.auth === 'required' && !isAuthenticated) {
      // Redirect to login if authentication is required but user is not authenticated
      return NextResponse.redirect(
        new URL(routes.auth.login.path, request.url)
      );
    }

    if (matchingRoute.auth === 'forbidden' && isAuthenticated) {
      // Redirect to home if authentication is forbidden but user is authenticated
      return NextResponse.redirect(new URL(routes.home.path, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
