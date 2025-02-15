// src/pages/Home.tsx
import Carousel from "../components/Carousel";
import Skeleton from "../components/Skeleton";
import SkeletonImage from "../components/SkeletonImage";
import VideoPlayer from "../components/Video";
import ProductCard from "../components/ProductCard";
import CustomerReviews from "../components/CustomerReviews";

const Home = () => {
  const images = [
    "https://flowbite.com/docs/images/carousel/carousel-1.svg",
    "https://flowbite.com/docs/images/carousel/carousel-2.svg",
    "https://flowbite.com/docs/images/carousel/carousel-3.svg",
    "https://flowbite.com/docs/images/carousel/carousel-4.svg",
    "https://flowbite.com/docs/images/carousel/carousel-5.svg",
  ];

  const products = [
    {
      identifier: "MTL-relog1",
      name: "Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport",
      image: "https://flowbite.com/docs/images/products/apple-watch.png",
      rating: 4,
      price: 599,
      quantity: 1
    },
    {
      identifier: "MTL-relog2",
      name: "Samsung Galaxy Watch 4",
      image: "https://images.samsung.com/latin/galaxy-watch4-classic/feature/galaxy-watch4-classic-silver-better-sleep.png",
      rating: 5,
      price: 299,
      quantity: 1
    },
    // Puedes agregar más productos aquí
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 sm:p-8 lg:p-16">
        {/* Título y botón de cambio de tema */}
        <h1 className="mb-6 text-center text-3xl font-bold dark:text-white">Partybara</h1>

        {/* Carrusel de imágenes */}
        <Carousel images={images} />

        {/* Grilla de productos */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
