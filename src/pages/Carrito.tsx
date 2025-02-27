import React, { useState } from 'react';
import { FaTrashAlt, FaShareAlt } from 'react-icons/fa';
import { useCart } from '../CartContext';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import MiniLoading from '../components/MiniLoading';
import config from "../config";

const defaultImage = "/assets/default-product.png";

const Carrito: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipoEntrega, setTipoEntrega] = useState("Recoger en sucursal");
 // Estado para manejar el modal
 const [modalData, setModalData] = useState<{ message: string, numero_orden: string, uuid: string } | null>(null);

  const total = cart.reduce((sum, producto) => {
    const cantidad = Number(producto.cantidad);
    const precio = Number(producto.precio);
    return !isNaN(cantidad) && !isNaN(precio) ? sum + cantidad * precio : sum;
  }, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No se encontró el token de autenticación');
      return;
    }
  
    if (!acceptedTerms) {
      toast.info("Debes aceptar los términos y condiciones para continuar.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/venta/ordenar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productos: cart.map(producto => ({ uuid: producto.uuid, cantidad: producto.cantidad })),
          total: total.toFixed(2),
          tipoEntrega
        })
      });
  
      const data = await response.json();

      if (response.ok && data.status) {
        toast.success(`Orden creada con éxito. Número: ${data.numero_orden}`);
        clearCart();
        setModalData(data); // Guardar los datos para mostrar en el modal
      } else {
        toast.error(`Error: ${data.message || "No se pudo procesar la orden"}`);
      }
    } catch (error) {
      console.error("Error en la compra:", error);
      toast.error("Hubo un problema al realizar la compra.");
    }
    setLoading(false);
  };
  
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 p-4 md:flex-row">
      <Helmet>
          <title>Mi Carrito</title>
      </Helmet>
      {/* Sección izquierda - Lista de productos */}
      <div className="w-full md:w-2/3">
        <div className="mb-4 flex justify-between">
          <button className="flex items-center gap-2 rounded bg-black px-4 py-2 text-white">
            <FaShareAlt /> Compartir carrito
          </button>
          <button className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white" onClick={clearCart}>
            <FaTrashAlt /> Eliminar todo
          </button>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold">Productos en el carrito</h2>
          <hr className='my-5'/>
          {cart.length === 0 ? (
            <p className="mt-4 text-gray-600">No hay productos en tu carrito.</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {cart.map((producto) => (
                <li key={producto.uuid} className="border-b pb-6">
                  <div className="flex items-center ">
                    <img src={producto.imagen || defaultImage} alt={producto.nombre} className="size-32 rounded-md object-cover" 
                    onError={(e) => (e.currentTarget.src = defaultImage)}/>
                    <div className="flex-1 text-center">
                      <span className="block text-lg font-medium">{producto.nombre}</span>
                      
                      <div className="mt-2 flex w-full max-w-[480px] items-center justify-center p-2 sm:max-w-screen-sm lg:max-w-screen-2xl">
                        <label className='mx-5 py-1'>Cantidad:</label>
                        <button className="rounded-l-lg rounded-r-none border px-3 py-1 text-gray-600" onClick={() => updateQuantity(producto.uuid, Math.max(1, producto.cantidad - 1))}>-</button>
                        <span className="w-full max-w-[80px] border py-1 text-gray-600 sm:max-w-[80px]">{producto.cantidad}</span>
                        <button className="rounded-l-none rounded-r-lg border px-3 py-1 text-gray-600" onClick={() => updateQuantity(producto.uuid, producto.cantidad + 1)}>+</button>
                        <button className="mx-5 rounded border px-3 py-1 text-red-600" onClick={() => removeFromCart(producto.uuid)}>
                          <FaTrashAlt />
                        </button>
                      </div>

                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Sección derecha - Resumen */}
      <div className="w-full space-y-4 md:w-1/3">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <label className="block font-semibold">Tipo de entrega</label>
          <select className="mt-2 w-full rounded border p-2" value={tipoEntrega} onChange={(e) => setTipoEntrega(e.target.value)}>
            <option>Recoger en sucursal</option>
          </select>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold">Resumen del pedido</h2>
          <div className="mt-4 flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold text-red-600">${total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>Envío:</span>
            <span className="font-semibold text-red-600">$0.00</span>
          </div>
          <hr className="my-4 border-t border-gray-300" />

          <div className="mt-4 flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-red-600">${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold">Términos y condiciones</h2>
          <p className="text-sm">
            Antes de realizar tu compra, te invitamos a revisar nuestros{' '}
            <a href="/terminos" className="text-red-600 underline">términos y condiciones</a> de nuestra tienda en línea.
          </p>
          <label className="mt-2 flex items-center gap-2">
          <input type="checkbox" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />
            <p className='text-sm font-semibold'>Acepto los términos y condiciones</p>
          </label>
        </div>
        <button onClick={handleCheckout} className={`w-full rounded bg-red-600 py-3 font-bold text-white ${loading ? 'opacity-50' : ''}`} disabled={loading}>
          {loading ? <MiniLoading/> : "Continuar"}
        </button>
      </div>

      {/* Modal para mostrar los datos de la orden */}
      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold">Orden Recibida</h2>
            <p className="mt-2">Número de orden: <strong>{modalData.numero_orden}</strong></p>
            <p className="mt-2">{modalData.message}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a href={`/pedido/${modalData.numero_orden}`} className="w-full rounded bg-black py-2 text-center font-bold text-white">
                Ver Orden
              </a>
              <button onClick={() => setModalData(null)} className="w-full rounded bg-red-600 py-2 text-white">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Carrito;