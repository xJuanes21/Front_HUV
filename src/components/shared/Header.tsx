'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';

interface HeaderProps {
  currentSection: string;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentSection, onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Obtener iniciales del usuario
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mapeo de roles a títulos más descriptivos
  const getRoleTitle = (rol: string): string => {
    const roleTitles: { [key: string]: string } = {
      'admin': 'Administrador del Sistema',
      'user': 'Usuario del Sistema',
      'editor': 'Editor del Sistema'
    };
    return roleTitles[rol] || 'Usuario';
  };

  return (
    <header className="sticky top-0 z-30 bg-blue-800 text-white shadow-lg">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Botón menú móvil */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Título dinámico + subtítulo fijo */}
        <div className="flex-1 lg:flex-none min-w-0 mx-4">
          <h2 className="text-xl font-semibold truncate">{currentSection}</h2>
          <p className="text-blue-200 text-sm">MIS - BANCO DE SANGRE</p>
        </div>

        {/* Estado + Usuario*/}
        <div className="flex items-center space-x-4">
          {/* Indicador de estado del sistema */}
          <div className="hidden md:flex items-center space-x-2 bg-green-500 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Sistema Activo</span>
          </div>

          {/* Información del usuario */}
          <div className="flex items-center space-x-3 relative">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium truncate max-w-[150px]">
                {user?.nombre || 'Usuario'}
              </p>
              <p className="text-xs text-blue-200">
                {getRoleTitle(user?.rol || 'user')}
              </p>
            </div>
            
            {/* Avatar del usuario */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Menú de usuario"
              >
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user ? getInitials(user.nombre) : 'U'}
                </div>
                <svg 
                  className={`w-4 h-4 text-blue-200 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              {/* Menú desplegable del usuario */}
              {isUserMenuOpen && (
                <UserMenu 
                  user={user}
                  onClose={() => setIsUserMenuOpen(false)}
                  onLogout={logout}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;