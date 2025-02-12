import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { useCart } from "../CartContext"; // Importar el hook useCart
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart(); // Usamos el contexto del carrito
  const [showAnimation, setShowAnimation] = useState(false); // Agregar estado para mostrar la animación de "+1"
  const [bubbles, setBubbles] = useState<number[]>([]); // Estado para las burbujas de cantidad
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null); // Estado para almacenar las coordenadas del botón
  const buttonRef = useRef<HTMLButtonElement>(null); // Referencia al botón

  // Simula obtener el producto con el id
  // En un escenario real, esto puede ser una llamada API
  const product = {
    id: parseInt(productId || "0"),
    name: "Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport",
    image: "https://flowbite.com/docs/images/products/apple-watch.png",
    rating: 4,
    price: 599,
    description: "This is a great watch for all your daily needs. With fitness tracking, heart monitoring, and more."
  };

  const handleAddToCart = () => {
    // Obtener las coordenadas del botón
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }

    // Crear una burbuja para la animación
    setBubbles([...bubbles, Date.now()]); // Usamos Date.now() para generar una clave única por animación
    setShowAnimation(true); // Mostrar la animación de "+1"

    setTimeout(() => {
      setShowAnimation(false); // Ocultar la animación después de un tiempo
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: 1,
      }); // Agregamos el producto al carrito
    }, 1000); // La animación durará 1 segundo
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col items-center">
        <img className="h-[320px] w-full rounded-t-lg object-contain object-center p-8" src={product.image} alt={product.name} />
        <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">{product.description}</p>
        <div className="mt-4 flex items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
        </div>
        <div className="mt-4">
          <button
            ref={buttonRef} // Asignar la referencia al botón
            className="relative rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
          initial={{ opacity: 1, scale: 1, x: buttonRect ? buttonRect.left : 0, y: buttonRect ? buttonRect.top : 0 }}
          animate={{ opacity: 0, scale: 1.5, y: -30 }}  // Animar el "+1" hacia arriba
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: buttonRect ? `-35px` : "0px", // Usar coordenadas del botón
            left: buttonRect ? `${(buttonRect.width/2)-15}px` : "0px", // Usar coordenadas del botón
          }}
    
        >
          +1
        </motion.div>
      ))}
    </div>
  );
};

export default ProductDetail;
