import React, { useState, useEffect, useRef } from 'react';
import config from "../config";
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const OrdenesPanel = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrdenes, setTotalOrdenes] = useState(0);
  const [ordenesPorPagina] = useState(20);
  const [search, setSearch] = useState('');
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOrdenes = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("No se encontró el token de autenticación.");
    
    try {
      const response = await fetch(`${config.apiUrl}/orden/panel/listar?page=${currentPage}&per_page=${ordenesPorPagina}&search=${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        toast.error('Error al obtener las órdenes');
        return;
      }
      const data = await response.json();
      setOrdenes(data.ordenes);
      setCurrentPage(1);
      setTotalOrdenes(data.total);
    } catch (error) {
      toast.error('Hubo un problema al cargar las órdenes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchTimeoutRef.current = setTimeout(() => {
      fetchOrdenes();
     
    }, 500);
  }, [currentPage, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();
      // Update search state
     setSearch(searchValue);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= Math.ceil(totalOrdenes / ordenesPorPagina)) {
      setCurrentPage(nuevaPagina);
    }
  };

  const verDetallesOrden = (uuid: string) => {
    window.location.href = `/dashboard/orden/${uuid}`;
  };

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-4">
      <h1 className="mb-4 text-3xl font-semibold text-gray-800">Gestión de Órdenes</h1>
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar órdenes..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {loading ? (
        <p className="text-center text-gray-600"><Loading/></p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
          <table className="min-w-full table-auto bg-white">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-4 py-2 text-left">Número de Orden</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Usuario</th>
                <th className="px-4 py-2 text-left">Tipo de Entrega</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.uuid} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-2">{orden.numero_orden}</td>
                  <td className="px-4 py-2">{new Date(orden.fecha_orden).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{orden.usuario_id}</td>
                  <td className="px-4 py-2">{orden.tipo_entrega}</td>
                  <td className="px-4 py-2">${orden.total.toFixed(2)}</td>
                  <td className="px-4 py-2">{orden.estado === 0 ? 'Pendiente' : 'Completado'}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => verDetallesOrden(orden.uuid)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <button
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-300 disabled:opacity-50"
          onClick={() => cambiarPagina(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Anterior
        </button>
        <span className="text-lg text-gray-700">
          Página {currentPage} de {Math.ceil(totalOrdenes / ordenesPorPagina)}
        </span>
        <button
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-300 disabled:opacity-50"
          onClick={() => cambiarPagina(currentPage + 1)}
          disabled={currentPage >= Math.ceil(totalOrdenes / ordenesPorPagina)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default OrdenesPanel;