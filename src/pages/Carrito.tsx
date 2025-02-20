import React from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Importa el ícono de papelera
import { useCart } from '../CartContext'; // Importa el hook personalizado

const defaultImage = "/assets/default-product.png"; // Imagen por defecto

const Carrito: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart(); // Accede a las funciones y carrito

  // Calcular el precio total con una verificación para evitar NaN
  const total = cart.reduce((sum, producto) => {
    const cantidad = Number(producto.cantidad); // Convertir a número
    const precio = Number(producto.precio); // Convertir a número
    if (!isNaN(cantidad) && !isNaN(precio)) {
      return sum + cantidad * precio;
    }
    return sum; // Si hay un valor no numérico, no lo sumamos
  }, 0);

  return (
    <div className="mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi carrito</h1>
      <div className="mt-8 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-300">Productos en el carrito</h2>
        {cart.length === 0 ? (
          <p className="mt-4 text-gray-600 dark:text-gray-400">No hay productos en tu carrito.</p>
        ) : (
          <ul className="mt-4 space-y-6">
            {cart.map((producto) => (
              <li key={producto.uuid} className="flex items-center justify-between border-b pb-6">
                {/* Contenedor para el nombre y la imagen alineados a la izquierda */}
                <div className="flex flex-1 items-center space-x-8">
                  <img
                    src={producto.imagen || defaultImage}
                    alt={producto.nombre}
                    className="size-16 rounded-md object-cover"
                  />
                  <span className="max-w-xs truncate p-2 text-lg font-medium text-gray-700 dark:text-gray-300 sm:max-w-md md:max-w-lg">
                    {producto.nombre}
                  </span>
                </div>

                {/* Contenedor de botones de cantidad, precio y eliminar alineados a la derecha */}
                <div className="ml-auto flex items-center space-x-4">
                  {/* Contenedor de botones de cantidad con bordes redondeados */}
                  <div className="flex items-center space-x-2 rounded-full bg-gray-200 p-2 dark:bg-gray-700">
                    <button
                      className="rounded-full p-1 text-gray-600 hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-600"
                      onClick={() => updateQuantity(producto.uuid, Math.max(1, producto.cantidad - 1))}
                    >
                      -
                    </button>
                    
                    <span className="text-gray-700 dark:text-gray-300">{producto.cantidad}</span>

                    <button
                      className="rounded-full p-1 text-gray-600 hover:bg-gray-300 dark:text-gray-400 dark:hover:bg-gray-600"
                      onClick={() => updateQuantity(producto.uuid, Math.max(1, producto.cantidad + 1))}
                    >
                      +
                    </button>
                  </div>

                  {/* Precio */}
                  <span className="p-2 font-semibold text-gray-800 dark:text-white">
                    ${Number(producto.cantidad * producto.precio).toFixed(2)}
                  </span>

                  {/* Botón de eliminar */}
                  <button
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                    onClick={() => removeFromCart(producto.uuid)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-xl font-semibold">
        <span className="text-gray-900 dark:text-white">Total:</span>
        <span className="text-gray-800 dark:text-white">${total.toFixed(2)}</span>
      </div>

      <button
        className="bg-cart mt-6 w-full rounded-md py-2 focus:outline-none focus:ring-4 "
        onClick={() => alert('Procediendo al pago')}
      >
        Proceder con la compra
      </button>
    </div>
  );
};

export default Carrito;
