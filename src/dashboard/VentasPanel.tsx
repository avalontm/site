import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Venta } from "../interfaces/Venta";
import Loading from "../components/Loading";

const VentasPanel = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchVentas = async () => {
      setLoading(true);

       const token = localStorage.getItem("authToken");
          if (!token) return toast.error("No se encontró el token de autenticación.");

      try {
        const response = await fetch(`/api/ventas?page=${page}&search=${search}`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

        if (!response.ok) toast.error("Error al obtener las ventas");

        const data = await response.json();
        setVentas(data.ventas);
        setTotalPages(data.totalPages);
      } catch (error) {
       toast.error('Hubo un problema al cargar las ventas.');
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, [page, search]);

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-4">
       <h1 className="mb-4 text-3xl font-semibold text-gray-800">Ventas</h1>
      <input
        type="search"
        placeholder="Buscar por folio o cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded border p-2"
      />
      {loading ? (
        <Loading/>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
            <table className="min-w-full table-auto bg-white">
                <thead>
                    <tr className="bg-black text-white">
                    <th className="border p-2">Folio</th>
                    <th className="border p-2">Fecha</th>
                    <th className="border p-2">Cliente</th>
                    <th className="border p-2">Total</th>
                    <th className="border p-2">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                    <tr key={venta.id} className="border">
                        <td className="p-2">{venta.folio}</td>
                        <td className="p-2">{new Date(venta.fecha_creacion).toLocaleString()}</td>
                        <td className="p-2">{venta.cliente_id}</td>
                        <td className="p-2">${venta.total.toFixed(2)}</td>
                        <td className="p-2">{venta.estado === 0 ? "Pendiente" : "Completada"}</td>
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
          className="rounded bg-blue-500 p-2 text-white disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="rounded bg-blue-500 p-2 text-white disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default VentasPanel;
