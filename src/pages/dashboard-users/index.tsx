import UnderConstruction from "@/components/underConstruction";
import DashboardLayoutUsers from "./layout";

export default function DashboardAdmin() {
    return (
        <DashboardLayoutUsers>
            <div className="mb-8">
                <h1 className="text-black text-3xl font-semibold">Bienvenido...</h1>
                <p className="text-gray-400">En este dashboard podras responder todos los formularios asignados</p>
            </div>
            <UnderConstruction 
                title="BAJO CONSTRUCCIÓN"
                subtitle="Módulo de inicio"
            />
        </DashboardLayoutUsers>
    )
}