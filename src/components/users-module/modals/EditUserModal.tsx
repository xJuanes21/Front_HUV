'use client';

import React, { useState, useEffect } from 'react';
import { EditUserModalProps, UserFormData } from '../types/types';

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  user,
  onSubmit,
  onClose,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    rol: 'user',
  });

  const [error, setError] = useState('');

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        nombre: user.nombre,
        correo: user.correo,
        password: '', // No mostrar password actual
        telefono: user.telefono,
        rol: user.rol,
      });
      setError('');
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar usuario');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[140] flex items-center justify-center p-4">

      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">
            Editar Usuario
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            Modifique la información del usuario
          </p>
        </div>

        {/* Información del usuario */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
              {(() => {
                const name = user?.nombre ?? '';
                const trimmed = name.trim();
                if (!trimmed) return '?';

                const initials = trimmed
                  .split(/\s+/)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase();

                return initials.slice(0, 2) || '?';
              })()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.nombre}</p>
              <p className="text-xs text-gray-500">ID: {user.id}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
              placeholder="Dr. Juan Pérez"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="correo"
              required
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
              placeholder="juan.perez@huv.gov.co"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nueva Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
              placeholder="Dejar vacío para no cambiar"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Complete solo si desea cambiar la contraseña
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              name="telefono"
              required
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
              placeholder="3001234567"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select
              name="rol"
              required
              value={formData.rol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
              disabled={isLoading}
            >
              <option value="user">Usuario Regular</option>
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Información adicional */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Nota:</strong> Los cambios se aplicarán inmediatamente.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Actualizando...
                </>
              ) : (
                'Actualizar Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;