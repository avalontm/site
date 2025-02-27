import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import config from "../config";
import Loading from "../components/Loading";

interface Pedido {
  numero_orden: string;
  fecha_orden: string;
  tipo_entrega: string;
  total: number;
  estado: number;
}

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getEstadoTexto = (estado: number): string => {
    switch (estado) {
      case 0:
        return "Pendiente";
      case 1:
        return "Confirmada";
      case 2:
        return "En proceso";
      case 3:
        return "Enviada";
      case 4:
        return "Entregada";
      case 5:
        return "Cancelada";
      default:
        return "Desconocido";
    }
  };

  const getEstadoColor = (estado: number): string => {
    switch (estado) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-blue-500";
      case 2:
        return "text-orange-500";
      case 3:
        return "text-purple-500";
      case 4:
        return "text-green-500";
      case 5:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No estás autenticado.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${config.apiUrl}/venta/ordenes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.status) {
          setPedidos(data.ordenes);
        } else {
          toast.error(data.message || "Error al obtener los pedidos");
        }
      } catch (error) {
        toast.error("Hubo un problema al cargar los pedidos.");
      }
      setLoading(false);
    };

    fetchPedidos();
  }, []);

  return (
    <div className="container mx-auto min-h-screen p-6">
      <Helmet>
        <title>Historial de pedidos</title>
      </Helmet>
      <h1 className="mb-4 text-2xl font-bold">Historial de pedidos</h1>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : pedidos.length === 0 ? (
        <p className="text-center text-gray-600">No tienes pedidos recientes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Orden #</th>
                <th className="border border-gray-300 px-4 py-2">Fecha</th>
                <th className="border border-gray-300 px-4 py-2">Destino</th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
                <th className="border border-gray-300 px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.numero_orden} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">{pedido.numero_orden}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {new Date(pedido.fecha_orden).toLocaleDateString("es-MX")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{pedido.tipo_entrega}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">${pedido.total.toFixed(2)} MXN</td>
                  <td className={`border border-gray-300 px-4 py-2 text-center font-semibold ${getEstadoColor(pedido.estado)}`}>
                    {getEstadoTexto(pedido.estado)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      className="rounded bg-black px-4 py-1 text-white transition hover:bg-gray-900"
                      onClick={() => navigate(`/pedido/${pedido.numero_orden}`)}
                    >
                      Ver pedido
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
