// components/forms-module/DynamicRecordForm.tsx
import React, { useState, useEffect, JSX } from 'react';
import { useRouter } from 'next/router';
import { DynamicForm, FormColumn } from './types/types';
import { formsService } from '@/lib/formService';

interface DynamicRecordFormProps {
  form: DynamicForm;
  documentId: number;
  recordId: number | null;
}

const DynamicRecordForm: React.FC<DynamicRecordFormProps> = ({ form, documentId, recordId }) => {
  const router = useRouter();
  const isEditing = recordId !== null;

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (isEditing && recordId) {
      loadRecord();
    } else {
      const defaultValues: Record<string, any> = {};
      form.columns_config.forEach(column => {
        if (column.type === 'boolean') {
          defaultValues[column.name] = false;
        } else {
          defaultValues[column.name] = '';
        }
      });
      setFormData(defaultValues);
    }
  }, [recordId]);

  const loadRecord = async () => {
    if (!recordId) return;

    try {
      setLoading(true);
      const response = await formsService.getFormRecords(documentId);
      const recordsData = formsService.normalizeRecordsResponse(response);
      const record = recordsData.find((r: any) => r.id === recordId);
      
      if (record) {
        setFormData(record);
      } else {
        setGeneralError('Registro no encontrado');
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Error al cargar registro');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (columnName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [columnName]: value
    }));
    if (errors[columnName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[columnName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    form.columns_config.forEach(column => {
      if (column.required) {
        const value = formData[column.name];
        if (value === undefined || value === null || value === '') {
          newErrors[column.name] = `${column.label} es obligatorio`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setGeneralError('');

    if (!validateForm()) {
      setGeneralError('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
      setSaving(true);

      const dataToSave = { ...formData };
      delete dataToSave.id;
      delete dataToSave.created_at;
      delete dataToSave.updated_at;

      if (isEditing && recordId) {
        await formsService.updateFormRecord(documentId, recordId, dataToSave);
      } else {
        await formsService.createFormRecord(documentId, dataToSave);
      }

      router.push(`/dashboard-admin/documents/${documentId}`);
    } catch (err: any) {
      setGeneralError(err.message || 'Error al guardar registro');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard-admin/documents/${documentId}`);
  };

  const renderInput = (column: FormColumn) => {
    const value = formData[column.name] ?? '';
    const hasError = !!errors[column.name];

    const inputClasses = `w-full px-4 text-black py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
      hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400'
    }`;

    switch (column.type) {
      case 'enum':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(column.name, e.target.value)}
            className={inputClasses}
          >
            <option value="">Seleccionar...</option>
            {column.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-6">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name={column.name}
                checked={value === true}
                onChange={() => handleInputChange(column.name, true)}
                className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500 cursor-pointer"
              />
              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                ✓ Sí
              </span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name={column.name}
                checked={value === false}
                onChange={() => handleInputChange(column.name, false)}
                className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500 cursor-pointer"
              />
              <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                ✗ No
              </span>
            </label>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(column.name, e.target.value)}
            className={inputClasses}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(column.name, e.target.value)}
            className={inputClasses}
            placeholder={`Ingrese ${column.label.toLowerCase()}`}
          />
        );

      case 'decimal':
        return (
          <input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => handleInputChange(column.name, e.target.value)}
            className={inputClasses}
            placeholder={`Ingrese ${column.label.toLowerCase()}`}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(column.name, e.target.value)}
            className={inputClasses}
            placeholder={`Ingrese ${column.label.toLowerCase()}`}
          />
        );
    }
  };

  const getColumnIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'string':
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>;
      case 'number':
      case 'decimal':
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm-7 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>;
      case 'date':
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
      case 'boolean':
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
      case 'enum':
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
      default:
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando registro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? '✏️ Editar Registro' : '➕ Crear Registro'}
            </h2>
            <p className="text-blue-200 text-sm mt-1">
              {form.name} {isEditing && `- ID: #${recordId}`}
            </p>
          </div>
          <div className="flex space-x-3 mt-3 sm:mt-0">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Cancelar</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {generalError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 m-6 rounded flex items-start space-x-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Error al guardar</p>
            <p className="text-sm">{generalError}</p>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-6">
          {form.columns_config.map((column, index) => (
            <div
              key={column.name}
              className={`bg-gradient-to-r from-gray-50 to-blue-50 border-2 rounded-lg p-5 transition-all duration-200 ${
                errors[column.name] ? 'border-red-500 shadow-lg' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex flex-col items-center space-y-2">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </span>
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-200" title={column.type}>
                      {getColumnIcon(column.type)}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-900">
                      {column.label}
                      {column.required && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                          Obligatorio
                        </span>
                      )}
                    </label>
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-300">
                      {column.type}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 font-mono bg-white px-2 py-1 rounded border border-gray-200 inline-block">
                    Campo: {column.name}
                  </p>

                  {renderInput(column)}

                  {errors[column.name] && (
                    <div className="mt-2 flex items-center space-x-2 text-red-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-semibold">{errors[column.name]}</p>
                    </div>
                  )}

                  {column.type === 'enum' && column.options && (
                    <p className="mt-2 text-xs text-gray-500">
                      Opciones disponibles: {column.options.length}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Información del formulario</p>
              <ul className="space-y-1 text-xs">
                <li>• Total de campos: <span className="font-bold">{form.columns_config.length}</span></li>
                <li>• Campos obligatorios: <span className="font-bold">{form.columns_config.filter(c => c.required).length}</span></li>
                <li>• Campos opcionales: <span className="font-bold">{form.columns_config.filter(c => !c.required).length}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRecordForm;