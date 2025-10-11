import ProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'
import DashboardLayout from '../layout'
import FormsTable from '@/components/forms-module/FormsTable'

const index = () => {
    return (
        <ProtectedRoute requiredRole="admin">
            <DashboardLayout>
                <div className="mb-8">
                    <h1 className="text-black text-3xl font-semibold">Panel de Documentos</h1>
                    <p className="text-gray-400">Aqui podras administrar los documentos.</p>
                </div>
                <FormsTable />
            </DashboardLayout>

        </ProtectedRoute>)
}

export default index