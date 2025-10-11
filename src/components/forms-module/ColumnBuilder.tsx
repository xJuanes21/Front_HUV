// components/forms/ColumnBuilder.tsx
import React, { useState } from 'react';
import { FormColumn, COLUMN_TYPES } from './types/types';

interface ColumnBuilderProps {
  columns: FormColumn[];
  onChange: (columns: FormColumn[]) => void;
}

const ColumnBuilder: React.FC<ColumnBuilderProps> = ({ columns, onChange }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addColumn = () => {
    const newColumn: FormColumn = {
      name: '',
      type: 'string',
      label: '',
      required: false
    };
    onChange([...columns, newColumn]);
    setEditingIndex(columns.length);
  };

  const updateColumn = (index: number, updates: Partial<FormColumn>) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], ...updates };
    
    // Si cambia el tipo, limpiar opciones si no es enum
    if (updates.type && updates.type !== 'enum') {
      delete updated[index].options;
    }
    
    onChange(updated);
  };

  const removeColumn = (index: number) => {
    onChange(columns.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= columns.length) return;
    
    const updated = [...columns];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const generateFieldName = (label: string): string => {
    return label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Columnas del Formulario ({columns.length})
        </h3>
        <button
          type="button"
          onClick={addColumn}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Agregar Columna</span>
        </button>
      </div>

      {columns.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">No hay columnas definidas</p>
          <p className="text-xs text-gray-500 mt-1">Haz clic en "Agregar Columna" para empezar</p>
        </div>
      )}

      <div className="space-y-3">
        {columns.map((column, index) => (
          <div
            key={index}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                  #{index + 1}
                </span>
                <span className="text-lg">{COLUMN_TYPES.find(t => t.value === column.type)?.icon}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => moveColumn(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Mover arriba"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveColumn(index, 'down')}
                  disabled={index === columns.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Mover abajo"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeColumn(index)}
                  className="p-1 text-red-400 hover:text-red-600"
                  title="Eliminar"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etiqueta (Label) *
                </label>
                <input
                  type="text"
                  value={column.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    updateColumn(index, { 
                      label,
                      name: column.name || generateFieldName(label)
                    });
                  }}
                  placeholder="ej: Fecha de Donación"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Campo *
                </label>
                <input
                  type="text"
                  value={column.name}
                  onChange={(e) => updateColumn(index, { name: e.target.value })}
                  placeholder="ej: fecha_donacion"
                  className="w-full px-3 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Dato *
                </label>
                <select
                  value={column.type}
                  onChange={(e) => updateColumn(index, { type: e.target.value as FormColumn['type'] })}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {COLUMN_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-7">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={column.required}
                    onChange={(e) => updateColumn(index, { required: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Campo Obligatorio</span>
                </label>
              </div>
            </div>

            {column.type === 'enum' && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opciones (separadas por coma) *
                </label>
                <input
                  type="text"
                  value={column.options?.join(', ') || ''}
                  onChange={(e) => {
                    const options = e.target.value.split(',').map(o => o.trim()).filter(o => o);
                    updateColumn(index, { options });
                  }}
                  placeholder="ej: A+, A-, B+, B-, AB+, AB-, O+, O-"
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {column.options && column.options.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {column.options.map((opt, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnBuilder;