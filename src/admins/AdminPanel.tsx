import { useAuth } from "../AuthContext"; 
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige al inicio después de cerrar sesión
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>
      <p className="mt-2 text-gray-400">Bienvenido, administrador.</p>

      <div className="mt-6 flex flex-col gap-4">
        <button
          className="rounded-lg bg-blue-600 px-6 py-3 transition hover:bg-blue-700"
          onClick={() => alert("Gestión de usuarios en desarrollo")}
        >
          Gestionar Usuarios
        </button>
        <button
          className="rounded-lg bg-green-600 px-6 py-3 transition hover:bg-green-700"
          onClick={() => alert("Revisión de pedidos en desarrollo")}
        >
          Revisar Pedidos
        </button>
        <button
          className="rounded-lg bg-red-600 px-6 py-3 transition hover:bg-red-700"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
