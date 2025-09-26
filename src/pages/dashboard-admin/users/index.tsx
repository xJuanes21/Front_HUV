import { useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import UsersTable from "@/components/usersTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "../layout";

export default function DashboardAdmin() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Redirigir si no es admin
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.rol !== 'admin') {
            router.push('/dashboard-users');
        }
    }, [user, isAuthenticated, isLoading, router]);
    return (
        <ProtectedRoute requiredRole="admin">

            <DashboardLayout>
                <div className="mb-8">
                    <h1 className="text-black text-3xl font-semibold">Panel de Usuarios</h1>
                    <p className="text-gray-400">Aqui podras administrar los usuarios, crear y asignar formularios. Para registrar un nuevo usuario, haz clic en el boton de abajo.</p>
                </div>
                <UsersTable />
            </DashboardLayout>
        </ProtectedRoute>
    )
}