import UsersTable from "@/components/usersTable";
import DashboardLayout from "./layout";

export default function DashboardAdmin() {
    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-black text-3xl font-semibold">Bienvenido al panel de Adminitrador</h1>
                <p className="text-gray-400">En este dashboard podras adminitrar los usuarios que tienen acceso al sistema</p>
            </div>
            <UsersTable/>
        </DashboardLayout>
    )
}