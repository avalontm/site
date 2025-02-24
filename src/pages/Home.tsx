// src/pages/Home.tsx
import Carousel from "../components/Carousel";
import Skeleton from "../components/Skeleton";
import SkeletonImage from "../components/SkeletonImage";
import VideoPlayer from "../components/Video";

import CustomerReviews from "../components/CustomerReviews";
import SplitText from "../components/SplitText";
import RotatingText from "../components/RotatingText";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const images = [
    "/assets/banners/banner_funkos.jpg",
    "/assets/banners/banner_vinilos.jpg",
    "/assets/banners/banner_coleccionables.jpg",
  ];

  const handleAnimationComplete = () => {

  };
  
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Helmet>
        <title>Inicio</title>
      </Helmet>
       {/* Carrusel de imágenes */}
       <Carousel images={images} />
       
        {/* Título y botón de cambio de tema */}
        <SplitText
          text="Hola, Bienvenido a Moshi moshi Ensenada"
          className="text-center text-2xl font-semibold text-gray-800"
          delay={150}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          threshold={0.2}
          rootMargin="-50px"
          onLetterAnimationComplete={handleAnimationComplete}
        />

      <RotatingText
        texts={['React', 'Bits', 'Is', 'Cool!']}
        mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg text-black"
        staggerFrom={"last"}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-120%" }}
        staggerDuration={0.025}
        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        rotationInterval={2000}
      />

       

        {/* Sección de skeletons */}
        <div className="mt-6 flex flex-col items-center justify-center">
          <Skeleton width="w-64" height="h-3" className="mb-4" />
          <Skeleton width="w-52" height="h-2" />
        </div>

        {/* Imagen de skeleton */}
        <SkeletonImage className="mt-6 w-full" />

        {/* Video de ejemplo */}
        <VideoPlayer videoUrl="https://www.youtube.com/watch?v=zTgQ_VnrP_s" className="mt-6 w-80" />

        {/* Otros elementos de la página */}
        <CustomerReviews />
    </div>
  );
};

export default Home;
