// components/ProtectedRoute.tsx - VERSIÓN CORREGIDA
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'; // ← Usar next/navigation en lugar de next/router
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'editor';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isVerifying, user, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo actuar cuando termine la verificación inicial Y no esté loading
    if (!isVerifying && !isLoading) {

      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        router.push('/');
        return;
      }

      // Si requiere un rol específico y no lo tiene, redirigir
      if (requiredRole && !hasRole(requiredRole)) {
        // Redirigir según el rol que sí tiene
        if (user?.rol === 'admin') {
          router.push('/dashboard-admin');
        } else {
          router.push('/dashboard-users');
        }
        return;
      }
    }
  }, [isAuthenticated, isLoading, isVerifying, router, requiredRole, hasRole, user]);

  // MOSTRAR LOADING MIENTRAS VERIFICA O CARGA
  if (isVerifying || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          {/* Spinner elegante */}
          <div className="relative inline-block">
            {/* Spinner exterior */}
            <div className="w-20 h-20 border-4 border-red-200 rounded-full animate-spin"></div>

            {/* Spinner interior */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-red-500 rounded-full animate-spin animation-delay-75"></div>

            {/* Punto central */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full"></div>
          </div>

          {/* Texto */}
          <div className="mt-6 space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">Verificando autenticación</h3>
            <p className="text-gray-600 text-sm">Cargando tu información de usuario...</p>
          </div>

          {/* Puntos animados */}
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // NO RENDERIZAR si no cumple condiciones (ya se redirigió)
  if (!isAuthenticated || (requiredRole && !hasRole(requiredRole))) {
    return null;
  }

  return <>{children}</>;
}