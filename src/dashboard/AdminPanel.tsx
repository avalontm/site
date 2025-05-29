import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FaCashRegister, FaUsers, FaClipboardList, FaBoxOpen, FaRegChartBar, FaCog } from "react-icons/fa"; // Agregado FaRegChartBar
import { useAuth } from "../AuthContext"; // Importamos el hook useAuth

const AdminPanel = () => {
  const { user } = useAuth(); // Usamos useAuth para obtener la información del usuario
  
  return (
    <div className="flex min-h-screen w-full flex-col items-center rounded-lg bg-gray-50 p-6">
      <Helmet>
        <title>Panel Administrativo</title>
      </Helmet>
      <h1 className="text-4xl font-semibold text-blue-900">Panel de Administración</h1>
      {/* Mostrar el nombre del usuario */}
      <p className="mt-2 text-gray-500">Bienvenido, {user.name || 'Administrador'}.</p>

      {/* Contenedor de botones con diseño responsivo y estilos mejorados */}
      <div className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Punto de venta */}
        <Link
          to="/dashboard/pos"
          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-400 to-teal-600 px-6 py-4 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:bg-teal-700"
        >
          <FaCashRegister className="mr-3 text-3xl" />
          <span>Punto de venta</span>
        </Link>

        {/* Gestionar Usuarios */}
        <Link
          to="/dashboard/usuarios"
          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 px-6 py-4 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:bg-purple-700"
        >
          <FaUsers className="mr-3 text-3xl" />
          <span>Gestionar Usuarios</span>
        </Link>

        {/* Revisar Ordenes */}
        <Link
          to="/dashboard/ordenes"
          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-green-400 to-green-600 px-6 py-4 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:bg-green-700"
        >
          <FaClipboardList className="mr-3 text-3xl" />
          <span>Revisar Ordenes</span>
        </Link>

        {/* Agregar Producto */}
        <Link
          to="/dashboard/productos"
          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-4 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:bg-yellow-700"
        >
          <FaBoxOpen className="mr-3 text-3xl" />
          <span>Agregar Producto</span>
        </Link>

        {/* Ver Ventas Realizadas */}
        <Link
          to="/dashboard/ventas"
          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-600 px-6 py-4 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:bg-indigo-700"
        >
          <FaRegChartBar className="mr-3 text-3xl" />
          <span>Ver Ventas Realizadas</span>
        </Link>

         {/* Ver Carousel */}
        <Link
          to="/dashboard/carousel"
          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-400 to-indigo-600 px-6 py-4 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:bg-indigo-700"
        >
          <FaRegChartBar className="mr-3 text-3xl" />
          <span>Ver Carousel</span>
        </Link>

        {/* Configuración del Sitio */}
        <Link
          to="/dashboard/configuracion"
          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 px-6 py-4 text-center font-medium text-white shadow-lg transition hover:scale-105 hover:bg-gray-700"
        >
          <FaCog className="mr-3 text-3xl" />
          <span>Configuración del Sitio</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
