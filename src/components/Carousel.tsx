import { useState, useEffect } from "react";

// Definición del tipo CarouselImage
type CarouselImage = {
  uuid: string;
  imagen: string;
};

interface CarouselProps {
  images: CarouselImage[]; // Recibe un array de CarouselImage
}

export default function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex, images.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Carousel wrapper */}
      <div className="flex transition-transform duration-1000" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <img
            key={image.uuid} // Usamos el uuid como clave
            src={image.imagen} // Usamos la propiedad 'imagen'
            className="w-full shrink-0 object-cover md:h-96"
            alt={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`size-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-400"}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Controls */}
      <button
        className="absolute left-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4"
        onClick={prevSlide}
      >
        <span className="inline-flex items-center justify-center rounded-full bg-white/30 p-2">
          <svg className="size-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
          </svg>
        </span>
      </button>

      <button
        className="absolute right-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4"
        onClick={nextSlide}
      >
        <span className="inline-flex items-center justify-center rounded-full bg-white/30 p-2">
          <svg className="size-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
        </span>
      </button>
    </div>
  );
}
