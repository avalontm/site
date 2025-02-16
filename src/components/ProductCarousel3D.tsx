import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface ProductCarousel3DProps {
  images: string[];
}

const defaultImage = "/assets/default-product.png"; // Imagen por defecto

const ProductCarousel3D: React.FC<ProductCarousel3DProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null); // Referencia al modal para detectar clics fuera de él

  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedImage(null); // Cerrar modal si el clic es fuera de la imagen
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* 🌀 Swiper Carrusel 3D */}
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        autoplay={{ delay: 2500, disableOnInteraction: true }}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 300,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="size-60">
            <img
              src={image || defaultImage}
              alt={`Product ${index + 1}`}
              className="size-full cursor-pointer rounded-xl object-cover shadow-lg"
              onClick={() => setSelectedImage(image)} // Click para abrir el modal
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔍 Modal de Imagen Completa con Zoom */}
      {selectedImage && (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
        onClick={handleModalClick} // Llamada a la función para manejar el clic fuera del modal
      >
        <div
          ref={modalRef} // Asociamos la referencia al contenedor del modal
          className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out"
        >
          {/* Mostrar imagen con zoom */}
          <div className="relative h-auto w-full max-w-full">
            <TransformWrapper
              initialScale={1}
              initialPositionX={0}
              initialPositionY={0}
              minScale={1}
              maxScale={3} // Ajusta el zoom máximo si lo deseas
            >
              <TransformComponent>
                <img
                  src={selectedImage}
                  alt="Zoomed Product"
                  className="h-auto w-full max-w-full rounded-lg object-cover object-center shadow-xl transition duration-300 ease-in-out"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default ProductCarousel3D;
