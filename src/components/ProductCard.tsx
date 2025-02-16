import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useCart } from '../CartContext'; // Importa el hook useCart
import { Product } from '../interfaces/Product';  // Importar la interfaz Product
import { toast } from 'react-toastify'; // Importa el toast

const defaultImage = "/assets/default-product.png"; // Imagen por defecto

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart(); // Usamos el contexto del carrito
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const [isLongName, setIsLongName] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Para saber si la tarjeta está siendo "hovered"

  // Revisa si el nombre del producto es más largo que el contenedor
  useEffect(() => {
    if (nameRef.current) {
      setIsLongName(nameRef.current.scrollWidth > nameRef.current.clientWidth);
    }
  }, [product.nombre]);

  const handleAddToCart = () => {
    addToCart({
      identifier: product.identifier,
      fecha_creacion: product.fecha_creacion,
      nombre: product.nombre,
      descripcion: product.descripcion,
      imagen: product.imagen,
      precio: product.precio,
      cantidad: 1,
      no_disponible: product.no_disponible
    }); // Agregamos el producto al carrito

    // Mostrar mensaje de éxito usando toast
    toast.success(`${product.nombre} ha sido agregado al carrito`, {
      position: "top-right", // Posición del toast
      autoClose: 3000, // Tiempo que permanece visible (en milisegundos)
      hideProgressBar: false, // Mostrar barra de progreso
      closeOnClick: true, // Cerrar el toast al hacer clic
      pauseOnHover: true, // Pausar al hacer hover
    });
  };

  // Controlar animación solo cuando el mouse está encima de la tarjeta
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex max-w-sm flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/producto/${product.identifier}`} className="w-full">
        <img
          className="mt-4 h-64 w-full overflow-hidden rounded-lg object-contain object-center" // Se agregó overflow-hidden
          src={product.imagen || defaultImage} // Imagen del producto o la de respaldo
          alt={product.nombre}
          onError={(e) => (e.currentTarget.src = defaultImage)} // Si hay error, cambia a la imagen por defecto
        />
      </Link>
      <div className="flex flex-col p-4">
        <h5
          ref={nameRef} // Asignamos la referencia al título
          className={`text-xl font-semibold text-gray-900 dark:text-white ${isLongName && isHovered ? 'animate-scrollText' : ''}`}
          style={{
            whiteSpace: 'nowrap', // Impide el salto de línea
            overflow: isHovered && isLongName ? 'visible' : 'hidden', // Si se está animando, el texto se muestra completo
            textOverflow: isHovered && isLongName ? 'unset' : 'ellipsis', // Quita "..." si el texto está siendo animado
            transform: isHovered ? 'translateX(0)' : 'translateX(0)', // Mantiene la posición original
            animationPlayState: isHovered && isLongName ? 'running' : 'paused', // Controla la animación dependiendo del estado del hover
            paddingLeft: isHovered && isLongName ? '10px' : '0px',  // Agregar padding a la izquierda solo cuando se anime
            paddingRight: isHovered && isLongName ? '10px' : '0px', // Agregar padding a la derecha solo cuando se anime
          }}
        >
          {product.nombre}
        </h5>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 dark:text-white">${product.precio.toFixed(2)}</span>

          {/* Botón con animación */}
          <button
            className="mt-3 rounded-lg bg-blue-700 px-6 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
