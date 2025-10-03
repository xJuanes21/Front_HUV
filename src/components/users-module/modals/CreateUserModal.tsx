'use client';

import React, { useState, useEffect } from 'react';
import { CreateUserModalProps, UserFormData } from '../types/types';
import { ChevronLeft, ChevronRight, ChevronDown, User, Settings } from 'lucide-react';

interface ExtendedUserFormData extends UserFormData {
  hemocomponentes: string[];
  registroDiario: string[];
  maquinaria: string[];
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onSubmit,
  onClose,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({
    hemocomponentes: false,
    registroDiario: false,
    maquinaria: false
  });
  const [formData, setFormData] = useState<ExtendedUserFormData>({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    rol: 'user',
    hemocomponentes: [],
    registroDiario: [],
    maquinaria: []
  });

  const [error, setError] = useState('');

  // Opciones para las categorías
  const categorias = {
    hemocomponentes: [
      'Glóbulos Rojos Empacados',
      'Plasma Fresco Congelado',
      'Concentrado Plaquetario'
    ],
    registroDiario: [
      'Control de Temperatura',
      'Inventario de Productos',
      'Mantenimiento Preventivo'
    ],
    maquinaria: [
      'Centrífuga Refrigerada',
      'Congelador -80°C',
      'Sistema de Monitoreo'
    ]
  };

  // Resetear form cuando se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setExpandedCategories({
        hemocomponentes: false,
        registroDiario: false,
        maquinaria: false
      });
      setFormData({
        nombre: '',
        correo: '',
        password: '',
        telefono: '',
        rol: 'user',
        hemocomponentes: [],
        registroDiario: [],
        maquinaria: []
      });
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentStep === 1) {
      // Validaciones del paso 1
      if (!formData.password) {
        setError('La contraseña es requerida');
        return;
      }

      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      // Pasar al paso 2
      setCurrentStep(2);
      return;
    }

    // Paso 2 - Enviar datos
    try {
      // Convertir a formato original para el backend
      const finalData = {
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password,
        telefono: formData.telefono,
        rol: formData.rol,
        // Agregar permisos como metadata
        permisos: {
          hemocomponentes: formData.hemocomponentes,
          registroDiario: formData.registroDiario,
          maquinaria: formData.maquinaria
        }
      };
      
      await onSubmit(finalData as any);
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category: keyof typeof categorias, option: string) => {
    setFormData(prev => {
      const currentSelections = prev[category] || [];
      const isSelected = currentSelections.includes(option);
      
      return {
        ...prev,
        [category]: isSelected 
          ? currentSelections.filter(item => item !== option)
          : [...currentSelections, option]
      };
    });
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const goBack = () => {
    setCurrentStep(1);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header con progress */}
        <div className="bg-green-600 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">
              Crear Nuevo Usuario
            </h3>
            <div className="text-white text-sm">
              {currentStep}/2
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-green-500 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
          
          <p className="text-green-100 text-sm mt-2">
            {currentStep === 1 ? 'Información básica del usuario' : 'Permisos y accesos del sistema'}
          </p>
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
        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Step 1: Información básica */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4 text-green-600">
                <User className="w-5 h-5" />
                <span className="font-medium">Información Personal</span>
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-black"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-black"
                  placeholder="juan.perez@huv.gov.co"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-black"
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  La contraseña debe tener al menos 6 caracteres
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-black"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-black"
                  disabled={isLoading}
                >
                  <option value="user">Usuario Regular</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Permisos y categorías */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Permisos del Usuario</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configure los accesos y permisos que tendrá el usuario en el sistema de banco de sangre.
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  Total de opciones disponibles: 9 permisos en 3 categorías principales
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries({
                  hemocomponentes: {
                    label: 'Gestión de Hemocomponentes',
                    icon: '🩸',
                    color: 'red',
                    description: 'Control y manejo de productos sanguíneos'
                  },
                  registroDiario: {
                    label: 'Registro y Monitoreo Diario', 
                    icon: '📋',
                    color: 'blue',
                    description: 'Seguimiento de actividades operativas'
                  },
                  maquinaria: {
                    label: 'Equipamiento y Maquinaria',
                    icon: '⚙️', 
                    color: 'green',
                    description: 'Gestión de equipos médicos especializados'
                  }
                }).map(([categoryKey, categoryInfo]) => {
                  const isExpanded = expandedCategories[categoryKey] || false;
                  const selectedCount = (formData[categoryKey as keyof ExtendedUserFormData] as string[] || []).length;
                  const totalOptions = categorias[categoryKey as keyof typeof categorias].length;

                  return (
                    <div key={categoryKey} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div
                        className={`bg-${categoryInfo.color}-50 p-4 flex items-center cursor-pointer hover:bg-${categoryInfo.color}-100 transition-colors`}
                        onClick={() => toggleCategory(categoryKey)}
                      >
                        <button className="mr-2">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <span className="text-lg mr-3">{categoryInfo.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {categoryInfo.label}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {categoryInfo.description} • {totalOptions} opciones disponibles
                            {selectedCount > 0 && (
                              <span className={`text-${categoryInfo.color}-600 font-medium`}>
                                {' '}({selectedCount} seleccionados)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                          {categorias[categoryKey as keyof typeof categorias].map((option) => (
                            <label
                              key={option}
                              className="flex items-start space-x-3 cursor-pointer p-3 hover:bg-gray-50 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={(formData[categoryKey as keyof ExtendedUserFormData] as string[] || []).includes(option)}
                                onChange={() => handleCategoryChange(categoryKey as keyof typeof categorias, option)}
                                className={`w-4 h-4 text-${categoryInfo.color}-600 rounded border-gray-300 mt-1`}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {option}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Acceso completo a {option.toLowerCase()} del sistema
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Los permisos seleccionados determinarán a qué secciones del sistema puede acceder el usuario. Puede expandir cada categoría para ver las opciones específicas.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-6">
            {currentStep === 2 && (
              <button
                type="button"
                onClick={goBack}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Atrás
              </button>
            )}
            
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
              className="flex-1 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : currentStep === 1 ? (
                <>
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                'Crear Usuario'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;