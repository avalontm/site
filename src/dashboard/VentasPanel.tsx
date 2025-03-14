import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Venta } from "../interfaces/Venta";
import Loading from "../components/Loading";
import config from "../config";

const VentasPanel = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchVentas = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("No se encontró el token de autenticación.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/venta/panel/listar?page=${page}&per_page=10&search=${search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("Error al obtener las ventas");
        return;
      }

      const data = await response.json();
      setVentas(data.ventas);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error('Hubo un problema al cargar las ventas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(fetchVentas, 500);

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [page, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const verDetallesVenta = (uuid: string) => {
    window.location.href = `/dashboard/venta/${uuid}`;
  };

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-4">
      <h1 className="mb-4 text-3xl font-semibold text-gray-800">Ventas</h1>
      <input
        type="search"
        placeholder="Buscar por folio o cliente..."
        value={search}
        onChange={handleSearchChange}
        className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading ? (
        <Loading/>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
          <table className="min-w-full table-auto bg-white">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-4 py-2 text-left">Folio</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Cliente</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-2">{venta.folio}</td>
                  <td className="px-4 py-2">{new Date(venta.fecha_creacion).toLocaleString()}</td>
                  <td className="px-4 py-2">{venta.cliente_nombre}</td>
                  <td className="px-4 py-2 font-bold text-red-600">${venta.total.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span className={`
                      rounded px-2 py-1 text-sm font-medium
                      ${venta.estado === 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : venta.estado === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {venta.estado === 0 
                        ? "Pendiente" 
                        : venta.estado === 1 
                          ? "Completada" 
                          : "Cancelada"}
                    </span>
                    </td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => verDetallesVenta(venta.uuid)}
                      className="rounded bg-blue-500 px-3 py-1 text-white transition-colors hover:bg-blue-600"
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

      {/* Paginación */}
      <div className="mt-6 flex items-center justify-center space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-lg text-gray-700">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default VentasPanel;