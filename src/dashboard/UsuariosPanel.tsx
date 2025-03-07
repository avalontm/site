import React, { useState, useEffect } from 'react';
import config from "../config";
import { toast } from 'react-toastify';

const UsuariosPanel = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(20); // Número de usuarios por página
  const [search, setSearch] = useState('');
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const defaultImage = "/assets/default-product.png"; // Imagen por defecto

  // Función para obtener los usuarios
  const fetchUsuarios = async () => {
    setLoading(true);

    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("No se encontró el token de autenticación.");
    
    try {
      const response = await fetch(`${config.apiUrl}/usuario/panel/listar?page=${currentPage}&per_page=${usuariosPorPagina}&search=${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error('Error al obtener los usuarios');
        return;
      }

      const data = await response.json();
      setUsuarios(data.usuarios);
      setTotalUsuarios(data.total);
    } catch (error) {
      toast.error('Hubo un problema al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios(); // Llamar a fetchUsuarios al montar el componente o cuando cambien las dependencias
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando cambia la búsqueda

    // Si ya existe un temporizador, lo limpiamos
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Establecer un nuevo temporizador
    const newTimeoutId = setTimeout(() => {
        fetchUsuarios(); // Llamar a la función fetchUsuarios después de 500ms
    }, 500);

    // Guardar el nuevo temporizador
    setTimeoutId(newTimeoutId);
  };

  const handleEditUser = (uuid: number) => {
    // Redirigir a la página de edición
    window.location.href = `/dashboard/usuario/${uuid}`;
  };

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= Math.ceil(totalUsuarios / usuariosPorPagina)) {
      setCurrentPage(nuevaPagina);
    }
  };

  const totalPaginas = Math.ceil(totalUsuarios / usuariosPorPagina);

  const onClearSearch = () => {
    setSearch("");
    setCurrentPage(1); 
    fetchUsuarios(); 
  };
  

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-4">
      <h1 className="mb-4 text-3xl font-semibold text-gray-800">Gestión de Usuarios</h1>

      {/* Filtro de búsqueda */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar usuarios..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabla de usuarios */}
      {loading ? (
        <p className="text-center text-gray-600">Cargando usuarios...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
          <table className="min-w-full table-auto bg-white">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-4 py-2 text-left">Avatar</th>
                <th className="px-4 py-2 text-left">Fecha de Creación</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Apellido</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img
                      src={usuario.avatar || '/path/to/default-avatar.jpg'}
                      alt="Avatar"
                      className="size-12 rounded-full"
                      onError={(e) => (e.currentTarget.src = defaultImage)}
                    />
                  </td>
                  <td className="px-4 py-2">{new Date(usuario.fecha_creacion).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{usuario.nombre}</td>
                  <td className="px-4 py-2">{usuario.apellido}</td>
                  <td className="px-4 py-2">{usuario.email}</td>
                  <td className="px-4 py-2">{usuario.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditUser(usuario.uuid)}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <button
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-300 disabled:opacity-50"
          onClick={() => cambiarPagina(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Anterior
        </button>
        <span className="text-lg text-gray-700">
          Página {currentPage} de {totalPaginas}
        </span>
        <button
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-300 disabled:opacity-50"
          onClick={() => cambiarPagina(currentPage + 1)}
          disabled={currentPage >= totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default UsuariosPanel;
