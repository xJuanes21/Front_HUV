// pages/my-documents/[id]/index.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { formsService } from '@/lib/formService';
import { useState, useEffect } from 'react';
import type { DynamicForm } from '@/lib/formService';
import DashboardLayoutUsers from '../../layout';
import UserRecordsTable from '@/components/my-documents-user/UserRecordTable';

const UserDocumentRecordsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<DynamicForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady || !id) return;

    const loadForm = async () => {
      try {
        setLoading(true);
        const formData = await formsService.getFormById(Number(id));
        setForm(formData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar documento');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [router.isReady, id]);

  if (loading) {
    return (
      <ProtectedRoute requiredRole="user">
        <DashboardLayoutUsers>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayoutUsers>
      </ProtectedRoute>
    );
  }

  if (error || !form) {
    return (
      <ProtectedRoute requiredRole="user">
        <DashboardLayoutUsers>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Documento no encontrado'}
          </div>
        </DashboardLayoutUsers>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="user">
      <DashboardLayoutUsers>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.name}</h1>
              <p className="text-gray-600">Registros del documento</p>
            </div>
            <button
              onClick={() => router.push('/dashboard-users/hemocomponentes')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              ← Volver a Mis Documentos
            </button>
          </div>
          
          <UserRecordsTable 
            form={form} 
            documentId={form.id}
          />
        </div>
      </DashboardLayoutUsers>
    </ProtectedRoute>
  );
};

export default UserDocumentRecordsPage;