// pages/dashboard-admin/my-documents.tsx
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserDocumentsView from '@/components/my-documents-user/UserDocumentView';
import DashboardLayoutUsers from '../layout';

const MyDocumentsPage: React.FC = () => {
  return (
    <ProtectedRoute >
      <DashboardLayoutUsers>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Documentos</h1>
              <p className="text-gray-600">
                Gestiona los documentos a los que tienes acceso
              </p>
            </div>
          </div>
          
          <UserDocumentsView />
        </div>
      </DashboardLayoutUsers>
    </ProtectedRoute>
  );
};

export default MyDocumentsPage;