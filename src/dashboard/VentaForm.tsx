import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import config from "../config";
import Loading from "../components/Loading";
import { XCircle, CheckCircle, PlusCircle } from 'lucide-react';
import Modal from '../components/Modal'; // Modal para confirmación de eliminación

const estadosVenta = [
  { nombre: "Pendiente", color: "text-yellow-500 bg-yellow-100" },
  { nombre: "Completada", color: "text-green-500 bg-green-100" },
  { nombre: "Cancelada", color: "text-red-500 bg-red-100" },
];

const VentaForm = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [venta, setVenta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [abono, setAbono] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Para mostrar el modal de confirmación
  const [abonoIndex, setAbonoIndex] = useState<number | null>(null); // Índice del abono a eliminar
  const [totalAbonos, setTotalAbonos] = useState<number>(0);
  const [restante, setRestante] = useState<number>(0);
  const [showCancelModal, setShowCancelModal] = useState(false); // Estado para mostrar el modal de cancelación

  const [ventaTotal, setVentaTotal] = useState(0);

  useEffect(() => {
      if (!venta) return; // Evita errores si venta es null o undefined
  
      // Guardar el total de la venta solo una vez cuando se carga
      if (venta.total && ventaTotal === 0) {
          setVentaTotal(venta.total);
      }
  
      let abonos = [];
  
      try {
          // Intentamos parsear la cadena JSON de metodos_pago si es una string
          abonos = typeof venta.metodos_pago === "string" 
              ? JSON.parse(venta.metodos_pago) 
              : venta.metodos_pago;
      } catch (error) {
          console.error("Error al parsear metodos_pago:", error);
      }
  
      // Verificar que es un array válido
      if (!Array.isArray(abonos)) {
          abonos = [];
      }
  
      // Extraer y sumar los montos de los abonos
      const totalAbonosCalculado = abonos
          .map((abono) => (abono.monto ? parseFloat(abono.monto) : 0)) // Convertir a número
          .reduce((total, monto) => total + monto, 0); // Sumar montos
  
      // Calcular restante sin modificar ventaTotal original
      const restanteCalculado = ventaTotal - totalAbonosCalculado;
  
      // Actualizar estados
      setTotalAbonos(totalAbonosCalculado);
      setRestante(restanteCalculado);

  }, [venta]); // Se ejecuta cuando venta cambia
  

  useEffect(() => {
    const fetchVenta = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        const respuesta = await fetch(`${config.apiUrl}/venta/panel/${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!respuesta.ok) {
          toast.error("Error al obtener los detalles de la venta.");
          return;
        }

        const data = await respuesta.json();

        if (!data.status) {
          throw new Error(data.message || "Error desconocido.");
        }

        setVenta(data.venta);

      } catch (error) {
        toast.error(error.message || "No se pudo cargar la venta.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenta();
  }, [uuid]);

  const agregarAbono = async () => {
    if (!abono || !metodoPago) {
      toast.error("Debe ingresar un monto y un método de pago.");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const respuesta = await fetch(`${config.apiUrl}/venta/panel/abonar/${uuid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          monto: parseFloat(abono),
          metodo_pago: metodoPago
        })
      });

      const data = await respuesta.json();

      if (!data.status) {
        toast.error(data.message || "Error al agregar abono.");
        return;
      }

      toast.success("Abono agregado correctamente.");
      // Actualizar el estado de la venta
      setVenta(data.venta);
      setAbono('');
      setMetodoPago('');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const eliminarAbono = async () => {
    if (abonoIndex === null) return;

    const token = localStorage.getItem("authToken");
    try {
      const respuesta = await fetch(`${config.apiUrl}/venta/panel/eliminar-pago/${uuid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ index_pago: abonoIndex })
      });

      const data = await respuesta.json();

      if (!data.status) {
        toast.error(data.message || "Error al eliminar el abono.");
        return;
      }

      toast.success("Abono eliminado correctamente.");
      setVenta(data.venta);
      
    } catch (error) {
      toast.error(error.message);
    }finally
    {
        setShowDeleteModal(false);
    }
  };

  const cancelarVenta = async () => {
    const token = localStorage.getItem("authToken");
    try {
    const respuesta = await fetch(`${config.apiUrl}/venta/panel/cancelar-venta/${uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ventaId: venta.uuid }),
      });

      const data = await respuesta.json();

      if (!data.status) {
        toast.error(data.message || "Error al cancelar la venta.");
        return;
      }

      toast.success(data.message);
      setVenta(data.venta);
      
    } catch (error) {
      toast.error(error.message);
    }finally
    {
        setShowCancelModal(false)
    }
 
  };

  if (loading) return (<div className="container mx-auto min-h-screen bg-gray-50 p-4"><Loading /></div>);
  if (!venta) return (<div className="container mx-auto min-h-screen bg-gray-50 p-4"><h2 className="mb-4 text-center text-lg font-semibold">Venta no encontrada</h2></div>);


  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-4">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Detalle de Venta #{venta.folio}</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Información de la Venta</h2>
          <p><strong>Fecha:</strong> {new Date(venta.fecha_creacion).toLocaleString()}</p>
          <p><strong>Cliente:</strong> {venta.cliente_nombre} {venta.cliente_apellido}</p>
          <p>
            <strong>Estado:</strong>
            <span className={`ml-2 rounded px-2 py-1 text-sm font-medium ${estadosVenta[venta.estado]?.color}`}>
              {estadosVenta[venta.estado]?.nombre}
            </span>
          </p>
        </div>

        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow-xl">
            <p className="mb-2 text-4xl font-bold text-red-600">Total: ${venta.total.toFixed(2)}</p>
            <p className="mb-2 text-lg font-medium text-green-600">Total Abonos: ${totalAbonos.toFixed(2)}</p>
            <p className="text-lg font-medium text-blue-600">Restante: ${restante.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Productos</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-right">Cantidad</th>
              <th className="p-2 text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            {JSON.parse(venta.productos).map((producto: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="p-2">{producto.nombre}</td>
                <td className="p-2 text-right">{producto.cantidad}</td>
                <td className="p-2 text-right">${producto.precio.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {venta.estado === 0 && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Agregar Abono</h2>
          <div className="flex space-x-4">
            <input
              type="number"
              value={abono}
              onChange={(e) => setAbono(e.target.value)}
              placeholder="Monto del abono"
              className="grow rounded border p-2"
            />
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="rounded border p-2"
            >
              <option value="">Método de Pago</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
            <button 
              onClick={agregarAbono}
              className="flex items-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <PlusCircle className="mr-2" /> Agregar Abono
            </button>
          </div>
        </div>
      )}

      {/* Métodos de Pago */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">Métodos de pago</h2>
        {venta?.metodos_pago ? (
          (() => {
            let metodosPago = [];
            try {
              metodosPago = JSON.parse(venta.metodos_pago);
              if (!Array.isArray(metodosPago)) throw new Error("Formato inválido");
            } catch (error) {
              console.error("Error al parsear metodos_pago:", error);
              return <p className="text-red-500">Error al cargar los métodos de pago.</p>;
            }
            return metodosPago.length > 0 ? (
              <ul className="space-y-2">
                {metodosPago.map((pago: any, index: number) => (
                  <li key={index} className="flex items-center justify-between border-b py-2">
                    <span className="text-gray-600">
                      {new Date(pago.fecha).toLocaleString("es-MX", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Formato de 12 horas con AM/PM
                      })}
                    </span>
                    <span className="capitalize">{pago.metodo_pago}</span>
                    <span className="font-semibold text-green-600">${pago.monto.toFixed(2)}</span>
                    {venta.estado === 0 && (
                      <button
                        className="ml-2 text-red-600 hover:text-red-700"
                        onClick={() => {
                          setAbonoIndex(index);
                          setShowDeleteModal(true);
                        }}
                      >
                        <XCircle />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay abonos registrados.</p>
            );
          })()
        ) : (
          <p className="text-gray-500">Cargando métodos de pago...</p>
        )}
      </div>

        {/* Botón de Cancelar Venta */}
        {venta.estado === 0 && (
                <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                <button
                    onClick={()=> setShowCancelModal(true)}
                    className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                    Cancelar Venta
                </button>
                </div>
            )}
            
      {/* Modal de confirmación de eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={eliminarAbono}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este abono?"
      />

      {/* Modal de confirmación de cancelación */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={cancelarVenta}
        title="Confirmar Cancelación"
        message="¿Estás seguro de que deseas cancelar esta venta?"
      />
    </div>
  );
};

export default VentaForm;
