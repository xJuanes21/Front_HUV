// components/my-documents-user/UserRecordForm.tsx
'use client';

import React from 'react';
import DynamicRecordForm from '@/components/forms-module/DynamicRecordForm';

interface UserRecordFormProps {
  form: any;
  documentId: number;
  recordId?: number | null;
  onSuccess: () => void;
}

const UserRecordForm: React.FC<UserRecordFormProps> = ({ 
  form, 
  documentId, 
  recordId, 
   
}) => {
  // Convertir undefined a null para que coincida con el tipo esperado
  const safeRecordId = recordId === undefined ? null : recordId;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <DynamicRecordForm 
        form={form}
        documentId={documentId}
        recordId={safeRecordId}
      />
    </div>
  );
};

export default UserRecordForm;