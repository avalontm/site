import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Product } from '../interfaces/Product';  // Importar la interfaz Product

const defaultImage = "/assets/default-product.png"; // Imagen por defecto

const ProductCard = ({ product }: { product: Product }) => {
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const [isLongName, setIsLongName] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Para saber si la tarjeta está siendo "hovered"

  // Revisa si el nombre del producto es más largo que el contenedor
  useEffect(() => {
    if (nameRef.current) {
      setIsLongName(nameRef.current.scrollWidth > nameRef.current.clientWidth);
    }
  }, [product.nombre]);

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
      <Link to={`/producto/${product.uuid}`} className="w-full">
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
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
