'use client';

import { JSX, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/shared/Header';
import { Home, FileText, X } from 'lucide-react';

type MenuItem = {
  id: string;
  name: string;
  href: string;
  icon: JSX.Element;
};

const menuItems: MenuItem[] = [
  {
    id: 'inicio',
    name: 'Inicio',
    href: '/dashboard-users',
    icon: <Home className="w-6 h-6" />,
  },
  {
    id: 'hemocomponentes',
    name: 'Mis Documentos',
    href: '/dashboard-users/hemocomponentes',
    icon: <FileText className="w-6 h-6" />,
  },
];

// Normaliza quitando trailing slash excepto si es raíz
const normalize = (s: string) => (s !== '/' ? s.replace(/\/+$/, '') : '/');

export default function DashboardLayoutUsers({ children }: { children: ReactNode }) {
  const pathname = normalize(usePathname() || '/');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tomamos el href más corto como "raíz" del menú (Inicio)
  const rootHref = useMemo(
    () => normalize(menuItems.reduce((a, b) => (a.href.length <= b.href.length ? a : b)).href),
    []
  );

  // Cierra el sidebar en móvil al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Regla de activo:
  // - Para el rootHref (Inicio): match EXACTO
  // - Para los demás: exacto o prefijo por segmento (href + '/')
  const isActive = (href: string) => {
    const h = normalize(href);
    if (h === rootHref) return pathname === rootHref;
    return pathname === h || pathname.startsWith(h + '/');
  };

  const computedMenu = useMemo(
    () =>
      menuItems.map((item) => ({
        ...item,
        active: isActive(item.href),
      })),
    [pathname] // se recalcula en cada navegación
  );

  // Título dinámico
  const currentSection = computedMenu.find((m) => (m as any).active)?.name ?? 'Inicio';

  return (
    // Reservamos el espacio del sidebar en desktop
    <div className="min-h-screen bg-gray-50 lg:pl-80">
      {/* Overlay móvil para cerrar (debe ir ANTES del sidebar para estar debajo) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          aria-label="Cerrar menú"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar fijo (drawer en mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-blue-800 shadow-xl transition-transform duration-300 ease-in-out pt-20 lg:pt-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        aria-label="Barra lateral"
      >
        {/* Botón cerrar móvil (dentro del sidebar) */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Logo Section*/}
        <div className="flex flex-col items-center px-6 py-8 bg-blue-900/30">
          <div className="w-28 h-28 bg-white rounded-2xl mb-4 p-4 shadow-lg">
            <img
              src="/logo-hospital.png"
              alt="Logo del Hospital"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-white text-lg font-bold text-center leading-tight">
            MIS - BANCO DE SANGRE
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8 px-4" role="navigation" aria-label="Navegación principal">
          <ul className="space-y-2">
            {computedMenu.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
                    ${
                      (item as any).active
                        ? 'bg-blue-600 bg-opacity-50 border-l-4 border-blue-300 shadow-lg'
                        : 'hover:bg-blue-700 hover:bg-opacity-50'
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer información */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-blue-900/30 border-t border-blue-700/50">
          <p className="text-xs text-blue-200 text-center">
            Hospital Universitario del Valle
          </p>
        </div>
      </aside>

      {/* Contenedor principal: header + contenido con scroll */}
       <div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header
          currentSection={currentSection}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        {/* Área de contenido: ocupa el resto y scroll propio */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
