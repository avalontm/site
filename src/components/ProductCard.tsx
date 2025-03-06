import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Product } from '../interfaces/Product';
import { flags } from "../interfaces/ProductFlag";

const defaultImage = "/assets/default-product.png"; // Imagen por defecto

const ProductCard = ({ product }: { product: Product }) => {
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const [isLongName, setIsLongName] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (nameRef.current) {
      setIsLongName(nameRef.current.scrollWidth > nameRef.current.clientWidth);
    }
  }, [product.nombre]);

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

    {/* Bandera vertical en el lado izquierdo */}
    {product.bandera > 0 && (
      <div className="absolute left-3 top-0 z-10 flex flex-col items-center">
        {/* Cuerpo del listón */}
        <div
          className={`relative w-6 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white ${flags[product.bandera].bgColor}`}
          style={{
            padding: "5px 5px 5px 0",
            writingMode: "vertical-rl",
            textOrientation: "upright",
            fontWeight:"800"
          }}
        >
          {flags[product.bandera].text}
        </div>

        {/* Puntas */}
        <div
          className={`size-0 border-x-[12px] border-b-8 ${flags[product.bandera].bgColor} border-x-transparent`}
        ></div>

      </div>
    )}

      {/* Imagen del producto */}
      <Link to={`/producto/${product.uuid}`} className="w-full">
        <img
          className="mt-4 h-64 w-full overflow-hidden rounded-lg object-contain object-center"
          src={product.imagen || defaultImage}
          alt={product.nombre}
          onError={(e) => (e.currentTarget.src = defaultImage)}
        />
      </Link>
      <div className="flex flex-col p-4">
        <h5
          ref={nameRef}
          className={`text-xl font-semibold text-gray-900 dark:text-white ${isLongName && isHovered ? 'animate-scrollText' : ''}`}
          style={{
            whiteSpace: 'nowrap',
            overflow: isHovered && isLongName ? 'visible' : 'hidden',
            textOverflow: isHovered && isLongName ? 'unset' : 'ellipsis',
            transform: isHovered ? 'translateX(0)' : 'translateX(0)',
            animationPlayState: isHovered && isLongName ? 'running' : 'paused',
            paddingLeft: isHovered && isLongName ? '10px' : '0px',
            paddingRight: isHovered && isLongName ? '10px' : '0px',
          }}
        >
          {product.nombre}
        </h5>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ${product.precio.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
