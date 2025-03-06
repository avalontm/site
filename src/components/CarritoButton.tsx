import React from 'react';
import { useAuth } from '../AuthContext'; // Asegúrate de importar el contexto de autenticación
import { useNavigate } from 'react-router-dom'; // Para redirigir a la página del carrito
import { FaShoppingCart } from 'react-icons/fa'; // Importa el ícono de carrito desde react-icons

const CarritoButton: React.FC = () => {
  const { isAuthenticated, role } = useAuth(); // Obtenemos el rol junto con la autenticación
  const navigate = useNavigate(); // Usado para redirigir al carrito

  // Función para redirigir al carrito
  const goToCart = () => {
    navigate('/carrito');
  };

  // Si el usuario no está autenticado o es un administrador, no mostramos el botón
  if (!isAuthenticated || role === 'admin') return null;

  return (
    <button
      onClick={goToCart}
      className="bg-cart fixed bottom-10 right-10 z-50 rounded-full p-4 text-white shadow-lg transition duration-300"
      aria-label="Ir al carrito"
    >
      <FaShoppingCart className="size-6" /> {/* Ícono de carrito de react-icons */}
    </button>
  );
};

export default CarritoButton;
