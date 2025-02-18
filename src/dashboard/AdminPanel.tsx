// src/admins/AdminPanel.tsx
import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>
      <p className="mt-2 text-gray-400">Bienvenido, administrador.</p>

      {/* Contenedor de botones con diseño responsivo */}
      <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          to="/dashboard/usuarios"
          className="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium transition hover:bg-blue-700"
        >
          Gestionar Usuarios
        </Link>
        <Link
          to="/dashboard/pedidos"
          className="rounded-lg bg-green-600 px-6 py-3 text-center font-medium transition hover:bg-green-700"
        >
          Revisar Pedidos
        </Link>
        <Link
          to="/dashboard/productos"
          className="rounded-lg bg-yellow-600 px-6 py-3 text-center font-medium transition hover:bg-yellow-700"
        >
          Agregar Producto
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
