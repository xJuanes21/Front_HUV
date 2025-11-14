// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Rutas protegidas
  const protectedRoutes = ['/dashboard-admin', '/dashboard-users'];
  const adminRoutes = ['/dashboard-admin'];

  // Verificar rutas protegidas
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Las validaciones de rol más específicas se harán en el cliente
    // ya que el middleware no tiene acceso al contexto de React
  }

  // Si está en login y ya tiene token, redirigir al dashboard apropiado
  if (token && pathname === '/') {
    // No podemos saber el rol aquí, redirigimos a una ruta genérica
    const dashboardUrl = new URL('/dashboard-users', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard-admin/:path*',
    '/dashboard-users/:path*',
    '/',
  ],
};