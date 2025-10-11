import UnderConstruction from "@/components/underConstruction";
import DashboardLayoutUsers from "./layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import CTAWidget from "@/components/CTAWidget";

export default function DashboardAdmin() {
    return (
        <ProtectedRoute>
            <DashboardLayoutUsers>
                <div className="mb-8">
                    <h1 className="text-black text-3xl font-semibold">Bienvenido...</h1>
                    <p className="text-gray-400">En este dashboard podras responder todos los formularios asignados</p>
                </div>
                <CTAWidget
                    title="Gestiona tus Documentos"
                    description="Crea y administra registros personalizados para tus documentos."
                    route="/dashboard-users/hemocomponentes"
                    icon="documents"
                    color="blue"
                />
                <UnderConstruction
                   
                />
            </DashboardLayoutUsers>
        </ProtectedRoute>
    )
}