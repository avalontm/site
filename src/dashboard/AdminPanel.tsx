//src/admins/AdminPanel.tsx
const AdminPanel = () => {

  return (
    <div className="flex w-full flex-col items-center justify-center bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>
      <p className="mt-2 text-gray-400">Bienvenido, administrador.</p>

      {/* Contenedor de botones con diseño responsivo */}
      <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          className="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium transition hover:bg-blue-700"
          onClick={() => alert("Gestión de usuarios en desarrollo")}
        >
          Gestionar Usuarios
        </button>
        <button
          className="rounded-lg bg-green-600 px-6 py-3 text-center font-medium transition hover:bg-green-700"
          onClick={() => alert("Revisión de pedidos en desarrollo")}
        >
          Revisar Pedidos
        </button>
        <button
          className="rounded-lg bg-yellow-600 px-6 py-3 text-center font-medium transition hover:bg-yellow-700"
          onClick={() => alert("Agregar productos en desarrollo")}
        >
          Agregar Producto
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
