// src/pages/Home.tsx
import Carousel from "../components/Carousel";
import Skeleton from "../components/Skeleton";
import SkeletonImage from "../components/SkeletonImage";
import VideoPlayer from "../components/Video";

import CustomerReviews from "../components/CustomerReviews";
import SplitText from "../components/SplitText";
import RotatingText from "../components/RotatingText";
import { Helmet } from "react-helmet-async";
import Gallery from "../components/Gallery";

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
       
        {/* Título */}
        <RotatingText
          texts={['COMPRA', 'LOS', 'MEJORES', 'PRODUCTOS', 'DE', 'ENSENADA']}
          mainClassName="w-96 mt-6 mb-4 bg-cyan-300 overflow-hidden py-2 justify-center rounded-lg text-black text-3xl font-bold text-center"
          staggerFrom="last"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />

      {/*
        <div className="mt-6 flex flex-col items-center justify-center">
          <Skeleton width="w-64" height="h-3" className="mb-4" />
          <Skeleton width="w-52" height="h-2" />
        </div>
        <SkeletonImage className="mt-6 w-full" />
        <VideoPlayer videoUrl="https://www.youtube.com/watch?v=zTgQ_VnrP_s" className="mt-6 w-80" />

        */}

        {/* Galeria */}
        <Gallery/>

        {/* Otros elementos de la página */}
        <CustomerReviews />
    </div>
  );
};

export default Home;
