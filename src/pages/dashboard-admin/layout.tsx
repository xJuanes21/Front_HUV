'use client';

import { JSX, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = {
  id: string;
  name: string;
  href: string;
  icon: JSX.Element;
  active?: boolean; // marcado dinámico
};

const menuItems: MenuItem[] = [
  {
    id: 'inicio',
    name: 'Inicio',
    href: '/dashboard-admin',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
];

// Normaliza quitando trailing slash excepto si es raíz
const normalize = (s: string) => (s !== '/' ? s.replace(/\/+$/, '') : '/');

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = normalize(usePathname() || '/');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // href "root" = el más corto del menú (Inicio)
  const rootHref = useMemo(
    () => normalize(menuItems.reduce((a, b) => (a.href.length <= b.href.length ? a : b)).href),
    []
  );

  // Cierra el sidebar en móvil al cambiar de ruta
  useEffect(() => {
    if (sidebarOpen) setSidebarOpen(false);
  }, [pathname, sidebarOpen]);

  // Regla de activo:
  // - Para rootHref (Inicio): match EXACTO
  // - Para otros: exacto o prefijo por segmento (href + '/')
  const isActive = (href: string) => {
    const h = normalize(href);
    if (h === rootHref) return pathname === rootHref;
    return pathname === h || pathname.startsWith(h + '/');
  };

  // Calcula items con estado activo
  const computedMenu = useMemo<MenuItem[]>(
    () => menuItems.map((item) => ({ ...item, active: isActive(item.href) })),
    [pathname]
  );

  // Título dinámico: usa el nombre del item activo o un fallback
  const currentSection = computedMenu.find((m) => m.active)?.name ?? 'Inicio';

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

        {/* Navigation Menu*/}
        <nav className="mt-8 px-4" role="navigation" aria-label="Navegación principal">
          <ul className="space-y-2">
            {computedMenu.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30
                    ${item.active
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
        <header className="sticky top-0 z-30 bg-blue-800 text-white shadow-lg">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            {/* Botón menú móvil */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Abrir menú"
              aria-expanded={sidebarOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Título dinámico + subtítulo fijo */}
            <div className="flex-1 lg:flex-none min-w-0">
              <h2 className="text-xl font-semibold truncate">{currentSection}</h2>
              <p className="text-blue-200 text-sm">MIS - BANCO DE SANGRE</p>
            </div>

            {/* Estado + Usuario*/}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-green-500 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm font-medium">Sistema Activo</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">Dr. Ana María López</p>
                  <p className="text-xs text-blue-200">Supervisor Médico</p>
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  AM
                </div>
                <button
                  className="hidden lg:block text-blue-200 hover:text-white transition-colors"
                  aria-label="Abrir menú de usuario"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

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
