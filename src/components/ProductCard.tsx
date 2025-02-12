import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '../CartContext'; // Importa el hook useCart
import { Product } from '../interfaces/Product';  // Importar la interfaz Product

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart(); // Usamos el contexto del carrito
  const [showAnimation, setShowAnimation] = useState(false);  // Agregar estado para mostrar la animación de "+1"
  const [bubbles, setBubbles] = useState<number[]>([]); // Estado para manejar las burbujas de cantidad

  const handleAddToCart = () => {
    // Crear una burbuja para la animación
    setBubbles([...bubbles, Date.now()]); // Usamos Date.now() para generar una clave única por animación

    setShowAnimation(true);  // Mostrar la animación de "+1"
    setTimeout(() => {
      setShowAnimation(false);  // Ocultar la animación después de un tiempo
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      }); // Agregamos el producto al carrito
    }, 1000);  // La animación durará 1 segundo
  };

  return (
    <div className="relative flex size-full max-w-sm flex-col justify-between rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <Link to={`/product/${product.id}`}>
        <img
          className="h-[320px] w-full rounded-t-lg object-contain object-center p-8"
          src={product.image}
          alt={product.name}
        />
      </Link>
      <div className="flex h-full flex-col justify-between px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
        <div className="mt-3 flex grow flex-col items-center justify-between md:flex-row">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
          {/* Botón con animación */}
          <button
            className="relative mt-3 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mt-0"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Animación de las burbujas */}
      {bubbles.map((timestamp) => (
        <motion.div
          key={timestamp}
          className="absolute flex items-center justify-center rounded-full bg-blue-500 text-3xl text-white shadow-md"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5, y: -30 }}  // Animar el "+1" hacia arriba
          transition={{ duration: 1 }}
          style={{ top: '20px', right: '20px' }}
        >
          +1
        </motion.div>
      ))}
    </div>
  );
};

export default ProductCard;
