'use client';

import { JSX, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/shared/Header';

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
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    id: 'hemocomponentes',
    name: 'Hemocomponentes',
    href: '/dashboard-users/hemocomponentes',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
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
    if (sidebarOpen) setSidebarOpen(false);
  }, [pathname, sidebarOpen]);

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
      {/* Sidebar fijo (drawer en mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-blue-800 shadow-lg transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        aria-label="Barra lateral"
      >
        {/* Logo Section*/}
        <div className="flex flex-col items-center p-6 bg-blue-800">
          <div className="w-24 h-24 bg-white rounded-2xl mb-4 p-3 shadow-lg">
            <img
              src="/logo-hospital.png"
              alt="Logo del Hospital"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-white text-xl font-bold text-center">
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
                  className={`flex items-center px-4 py-3 rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
                    ${
                      (item as any).active
                        ? 'bg-blue-600 bg-opacity-50 border-l-4 border-blue-300'
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

        {/* Footer por implementar */}
      </aside>

      {/* Overlay móvil para cerrar */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden"
          aria-label="Cerrar menú"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenedor principal: header + contenido con scroll */}
       <div className="flex min-h-screen flex-col">
        {/* Header */}
        <Header
          currentSection={currentSection}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        {/* Área de contenido: ocupa el resto y scroll propio */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>

      {/* Botón cerrar (móvil) */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 right-4 z-50 lg:hidden bg-white rounded-full p-2 shadow-lg"
          aria-label="Cerrar menú"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
