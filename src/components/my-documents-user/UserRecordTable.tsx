// components/my-documents-user/UserRecordsTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { formsService, type FormRecord } from '@/lib/formService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { Eye, Edit, Trash2, Plus, FileText } from 'lucide-react';

interface UserRecordsTableProps {
  form: any;
  documentId: number;
}

const UserRecordsTable: React.FC<UserRecordsTableProps> = ({ form, documentId }) => {
  const [records, setRecords] = useState<FormRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  // Función helper para verificar permisos
  const hasPermission = (permission: 'view' | 'edit' | 'delete'): boolean => {
    if (!user) return false;
    
    // Si es admin, tiene todos los permisos
    if (user.rol === 'admin') return true;
    
    // Si tiene la función canAccessDocument, usarla
    if (typeof user.canAccessDocument === 'function') {
      return user.canAccessDocument(documentId, permission);
    }
    
    // Fallback: verificar permisos básicos basados en el rol
    if (user.rol === 'editor') {
      return permission === 'view' || permission === 'edit';
    }
    
    // Usuario normal solo puede ver
    return permission === 'view';
  };

  useEffect(() => {
    loadRecords();
  }, [documentId]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await formsService.getFormRecords(documentId);
      const recordsArray = formsService.normalizeRecordsResponse(response);
      setRecords(recordsArray);
    } catch (err: any) {
      setError('Error al cargar registros: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (recordId: number) => {
    router.push(`/dashboard-users/hemocomponentes/${documentId}/${recordId}`);
  };

  const handleCreateRecord = () => {
    router.push(`/dashboard-users/hemocomponentes/${documentId}/new`);
  };

  const handleDeleteRecord = async (recordId: number) => {
    if (!confirm('¿Está seguro de eliminar este registro?')) return;
    
    try {
      await formsService.deleteFormRecord(documentId, recordId);
      loadRecords(); // Recargar la lista
    } catch (err: any) {
      setError('Error al eliminar registro: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header de la tabla */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Registros</h3>
          <p className="text-sm text-gray-600">
            {records.length} registro{records.length !== 1 ? 's' : ''} encontrado{records.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {/* Botón crear solo si tiene permisos de edición */}
        {hasPermission('edit') && (
          <button
            onClick={handleCreateRecord}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Registro</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
          {error}
        </div>
      )}

      {/* Tabla de registros */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              {form.columns_config.slice(0, 3).map((column: any) => (
                <th key={column.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{record.id}
                </td>
                {form.columns_config.slice(0, 3).map((column: any) => (
                  <td key={column.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record[column.name] || '-'}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleViewRecord(record.id)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Ver registro"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {hasPermission('edit') && (
                    <button
                      onClick={() => handleViewRecord(record.id)}
                      className="text-green-600 hover:text-green-900"
                      title="Editar registro"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  
                  {hasPermission('delete') && (
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {records.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
            <p className="text-gray-500">
              {hasPermission('edit') 
                ? 'Crea el primer registro para este documento' 
                : 'No hay registros disponibles para este documento'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRecordsTable;