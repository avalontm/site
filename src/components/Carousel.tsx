import { useState, useEffect, SetStateAction } from "react";

interface CarouselProps {
  images: string[]; // Propiedad para recibir las imágenes
}

export default function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentIndex(index);
  };

  // Set an interval to automatically change the slide
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide(); // Move to the next slide every 3 seconds
    }, 3000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full">
      {/* Carousel wrapper */}
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            className={`absolute block w-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            } left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`}
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
        className="absolute start-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4"
        onClick={prevSlide}
      >
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/30">
          <svg className="size-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
          </svg>
        </span>
      </button>

      <button
        className="absolute end-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4"
        onClick={nextSlide}
      >
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/30">
          <svg className="size-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
        </span>
      </button>
    </div>
  );
}
