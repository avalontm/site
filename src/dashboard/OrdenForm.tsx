import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import config from "../config";
import Loading from "../components/Loading";
import OrderStepper from "../components/OrderStepper"; // Create this component

const OrdenForm = () => {
  const { uuid } = useParams();
  const [orden, setOrden] = useState<any>(null);
  const [estado, setEstado] = useState(0);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const defaultImage = "/assets/default-product.png";

  useEffect(() => {
    const fetchOrden = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        setCargando(false);
        return;
      }

      try {
        const respuesta = await fetch(`${config.apiUrl}/orden/panel/${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!respuesta.ok) {
          throw new Error("Error al obtener la orden.");
        }

        const data = await respuesta.json();
        if (!data.status) {
          throw new Error(data.message || "Error desconocido.");
        }

        setOrden(data.orden);
        setEstado(Number(data.orden.estado));
      } catch (error) {
        toast.error(error.message || "No se pudo cargar la orden.");
      } finally {
        setCargando(false);
      }
    };

    fetchOrden();
  }, [uuid]);

  const actualizarEstado = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("No se encontró el token de autenticación.");
      return;
    }

    try {
      const respuesta = await fetch(`${config.apiUrl}/orden/panel/${uuid}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: Number(estado) }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) throw new Error(data.message || "Error al actualizar la orden.");

      toast.success("Estado actualizado correctamente.");
      setOrden((prevOrden) => ({ ...prevOrden, estado: Number(estado) }));
    } catch (error) {
      toast.error(error.message || "No se pudo actualizar el estado.");
    }
  };

  const completarVenta = async () => {
    if (estado !== 4) return; // Solo permitir completar si está en "Entregada"

    navigate(`/dashboard/pos/${uuid}`); // Redirige a la página /dashboard/pos/{uuid}
  }

  // Custom Loading Component
  if (cargando) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Loading/>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <XCircle className="size-16 text-red-500" />
        <p className="mt-4 text-lg font-semibold text-gray-700">Orden no encontrada.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto min-h-min p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Orden #{orden.numero_orden}</h1>

      {/* Order Status Stepper */}
      <div className="mb-6">
        <OrderStepper 
          currentStep={estado} 
          onStepChange={(newStep) => setEstado(newStep)} 
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Información de la Orden</h2>
          <p><strong>Cliente:</strong> {orden.cliente_nombre}</p>
          <p><strong>Fecha:</strong> {new Date(orden.fecha_orden).toLocaleString()}</p>
          <p><strong>Tipo de Entrega:</strong> {orden.tipo_entrega || "No aplica"}</p>
        </div>

        <div className="flex items-center justify-center rounded-lg bg-white p-6 shadow-md">
          <p className="text-4xl font-bold text-red-600">
            Total: ${orden.total}
          </p>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Productos en la Orden</h2>
        {orden.productos.length > 0 ? (
          <ul>
            {orden.productos.map((producto: any) => (
              <li key={producto.uuid} className="mt-4 flex items-center space-x-4 border-b pb-4 last:border-b-0">
                <img 
                  src={producto.imagen || defaultImage} 
                  alt={producto.nombre} 
                  className="size-24 rounded-lg object-cover"
                  onError={(e) => (e.currentTarget.src = defaultImage)}
                />
                <div>
                  <p className="font-semibold">{producto.nombre}</p>
                  <p>Cantidad: {producto.cantidad || 1}</p>
                  <p>Precio: ${producto.precio}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay productos en esta orden.</p>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={actualizarEstado}
          className="flex w-full max-w-sm items-center justify-center rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
        >
          <CheckCircle className="mr-2 size-5" />
          Guardar cambios
        </button>
      </div>

      {/* Botón Completar Venta */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={completarVenta}
          className={`w-full max-w-sm rounded-lg py-2 text-white ${
            estado === 4 ? "bg-green-500 hover:bg-green-600" : "cursor-not-allowed bg-gray-400"
          }`}
          disabled={estado !== 4}
        >
          Completar Venta
        </button>
      </div>
    </div>
  );
};

export default OrdenForm;
