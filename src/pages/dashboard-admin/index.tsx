import { useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import UsersTable from "@/components/users-module/UsersTable";
import DashboardLayout from "./layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import CTAWidget from "@/components/CTAWidget";

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
                    <h1 className="text-black text-3xl font-semibold">Bienvenido al panel de Adminitrador</h1>
                    <p className="text-gray-400">En este dashboard podras adminitrar los usuarios que tienen acceso al sistema</p>
                </div>

                <CTAWidget
                    title="Agregar Usuario"
                    description="Crea nuevos usuarios para tu plataforma de forma rápida y sencilla"
                    route="/dashboard-admin/users"
                    icon="users"
                    color="blue"
                />

            </DashboardLayout>
        </ProtectedRoute>
    )
}