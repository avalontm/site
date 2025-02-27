import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import config from "../config";
import Loading from "../components/Loading";

interface Producto {
  uuid: string;
  nombre: string;
  cantidad: number;
  precio: number;
  imagen: string;
}

interface Pedido {
  uuid: string;
  numero_orden: string;
  fecha_orden: string;
  tipo_entrega: string;
  total: number;
  estado: number;
  productos: Producto[];
}

const estadosOrden = ["Pendiente", "Confirmada", "En proceso", "Enviada", "Entregada", "Cancelada"];
const coloresEstado: Record<number, string> = {
  0: "text-yellow-500",  // Pendiente
  1: "text-red-500",     // Confirmada (resaltado en rojo como en la imagen)
  2: "text-blue-500",    // En proceso
  3: "text-purple-500",  // Enviada
  4: "text-green-500",   // Entregada
  5: "text-gray-500",    // Cancelada
};


const Pedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultImage = "/assets/default-product.png";

  useEffect(() => {
    const fetchPedido = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No estás autenticado.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${config.apiUrl}/venta/orden/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.status) {
          setPedido(data.orden);
        } else {
          toast.error(data.message || "Error al obtener el pedido");
        }
      } catch (error) {
        toast.error("Hubo un problema al cargar el pedido.");
      }
      setLoading(false);
    };

    fetchPedido();
  }, [id]);

  return (
    <div className="container mx-auto min-h-screen p-6">
      <Helmet>
        <title>Detalle del Pedido #{id}</title>
      </Helmet>
      <h1 className="mb-4 text-xl font-bold uppercase">Historial de Pedidos</h1>
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : pedido ? (
        <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-md">
          <div className="mb-4 flex justify-between border-b pb-4">
            <div>
              <p className="text-lg font-bold"># PEDIDO: <span className="text-red-600">{pedido.numero_orden}</span></p>
              <p className="text-lg font-bold">ESTADO: <span className={coloresEstado[pedido.estado]}>{estadosOrden[pedido.estado]}</span></p>
            </div>
            <div>
              <p className="text-lg font-bold">TOTAL DEL PEDIDO: <span className="text-red-600">${pedido.total.toFixed(2)}</span></p>
            </div>
          </div>
          <p className="text-lg font-bold">FECHA: <span className="font-normal">{new Date(pedido.fecha_orden).toLocaleDateString("es-MX")}</span></p>
          <h2 className="mt-4 text-xl font-semibold">Productos:</h2>
          <div className="mt-4 space-y-4">
            {pedido.productos.map((producto) => (
              <div key={producto.uuid} className="flex items-center rounded-lg border p-4 shadow-sm">
                <a href={`/producto/${producto.uuid}`} target="_blank" rel="noopener noreferrer">
                <img
                  src={producto.imagen || defaultImage}
                  alt={producto.nombre}
                  className="mr-4 size-24 rounded-md object-cover transition-transform hover:scale-105"
                  onError={(e) => (e.currentTarget.src = defaultImage)}
                />
              </a>
                <div>
                  <p className="text-lg font-semibold">{producto.nombre}</p>
                  <p className="text-gray-700">Cantidad: <span className="text-black">{producto.cantidad}</span></p>
                  <p className="text-gray-700">Precio unitario: <span className="text-red-600">${producto.precio.toFixed(2)}</span></p>
                  <p className="font-bold text-gray-700">Total: <span className="text-red-600">${(producto.cantidad * producto.precio).toFixed(2)}</span></p>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-6 rounded bg-gray-500 px-6 py-2 text-white transition hover:bg-gray-600"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Pedido;