import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import Carousel from "../components/Carousel";
import RotatingText from "../components/RotatingText";
import CustomerReviews from "../components/CustomerReviews";
import { Link } from "react-router-dom"; 
import config from "../config";
import SkeletonImage from '../components/SkeletonImage';
import { toast } from 'react-toastify';

type CarouselImage = {
  uuid: string;
  imagen: string;
};

const Home = () => {
  // Estado para almacenar las imágenes del carrusel
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);

  useEffect(() => {
    // Función para obtener las imágenes desde la API
    const fetchImages = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/imagen/carousel`); 
        const data = await response.json();
        setCarouselImages(data); // Almacena los datos en el estado
      } catch (error) {
        toast.error(`Error al cargar las imágenes: ${error}`);
      }
    };

    fetchImages(); // Llamada a la API
  }, []); // El arreglo vacío asegura que solo se ejecute una vez cuando el componente se monte

  return (
    <div className="min-h-screen rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Helmet para el título */}
      <Helmet>
        <title>Inicio</title>
      </Helmet>

      {/* Sección de encabezado */}
      <header className="flex flex-col items-center justify-center pb-24 pt-16 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          ¡Bienvenido a <span className="text-yellow-400">{config.title}</span>!
        </h1>
        <p className="mb-6 text-xl">
          {config.descripcion}
        </p>
        <p className="mb-6 text-lg">
          Somos una tienda ubicada en Ensenada, Baja California, México, ¡donde encontrarás productos únicos y exclusivos! 
          Descubre la calidad y el estilo local que solo nosotros te ofrecemos.
        </p>
        <Link to="/productos">
          <button className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black shadow-md transition-transform hover:scale-105">
            Ver Productos
          </button>
        </Link>
      </header>

      {/* Carrusel de imágenes (si existen imágenes en el estado) */}
      {carouselImages.length > 0 ? (
        <Carousel images={carouselImages} />
      ) : (
        <p className="text-center text-lg text-white">
           <div className="flex items-center justify-center space-x-4">
            <SkeletonImage />
          </div>
        </p>
      )}

      {/* Título animado */}
      <RotatingText
        texts={['COMPRA', 'LOS', 'MEJORES', 'PRODUCTOS', 'DE', 'ENSENADA']}
        mainClassName="w-96 mt-6 mb-4 bg-cyan-300 overflow-hidden py-2 justify-center rounded-lg text-black text-3xl font-bold text-center mx-auto"
        staggerFrom="last"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-120%" }}
        staggerDuration={0.025}
        splitLevelClassName="overflow-hidden pb-1"
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        rotationInterval={2000}
      />

      {/* Sección de características */}
      <section className="px-6 py-20 text-center">
        <h2 className="mb-12 text-3xl font-semibold text-gray-800">¿Por qué elegirnos?</h2>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
            <h3 className="mb-4 text-2xl font-semibold">Interactividad Total</h3>
            <p className="text-gray-600">Disfruta de una experiencia fluida con productos interactivos y fáciles de navegar.</p>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
            <h3 className="mb-4 text-2xl font-semibold">Diseño Responsivo</h3>
            <p className="text-gray-600">Nuestra plataforma se adapta perfectamente a cualquier dispositivo.</p>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-lg transition-transform hover:scale-105">
            <h3 className="mb-4 text-2xl font-semibold">Productos Únicos</h3>
            <p className="text-gray-600">Ofrecemos productos exclusivos que no encontrarás en ningún otro lado.</p>
          </div>
        </div>
      </section>

      {/* Testimonios de clientes */}
      <section className="bg-white px-6 py-20 text-center">
        <h2 className="mb-12 text-3xl font-semibold text-gray-800">Lo que dicen nuestros clientes</h2>
        <CustomerReviews />
      </section>
    </div>
  );
};

export default Home;
