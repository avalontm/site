import React from 'react';
import { FaTrashAlt, FaShareAlt } from 'react-icons/fa';
import { useCart } from '../CartContext';
import { Helmet } from 'react-helmet-async';

const defaultImage = "/assets/default-product.png";

const Carrito: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const total = cart.reduce((sum, producto) => {
    const cantidad = Number(producto.cantidad);
    const precio = Number(producto.precio);
    return !isNaN(cantidad) && !isNaN(precio) ? sum + cantidad * precio : sum;
  }, 0);

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
          {cart.length === 0 ? (
            <p className="mt-4 text-gray-600">No hay productos en tu carrito.</p>
          ) : (
            <ul className="mt-4 space-y-6">
              {cart.map((producto) => (
                <li key={producto.uuid} className="border-b pb-6">
                  <div className="flex items-center space-x-4">
                    <img src={producto.imagen || defaultImage} alt={producto.nombre} className="size-16 rounded-md object-cover" />
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
          <select className="mt-2 w-full rounded border p-2">
            <option>Recoger en sucursal</option>
            <option>Envío a domicilio</option>
          </select>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <label className="block font-semibold">Factura</label>
          <select className="mt-2 w-full rounded border p-2">
            <option>No</option>
            <option>Sí</option>
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
            <input type="checkbox" /> <p className=' text-sm font-semibold'>Acepto los términos y condiciones</p> 
          </label>
        </div>
        <button className="w-full rounded bg-red-600 py-3 font-bold text-white">
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Carrito;