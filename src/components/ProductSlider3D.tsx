import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden">
      <div className="flex items-center justify-center">
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 rounded-full bg-gray-800 p-2 text-white shadow-lg hover:bg-gray-700"
        >
          <FaChevronLeft size={20} />
        </button>

        <div className="relative flex h-80 w-full items-center justify-center">
          {images.map((image, index) => (
            <motion.img
              key={index}
              src={image}
              alt={`Product ${index + 1}`}
              className="absolute h-full w-3/4 rounded-lg object-cover shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: index === currentIndex ? 1 : 0.5,
                scale: index === currentIndex ? 1 : 0.8,
                rotateY: index === currentIndex ? 0 : 30,
              }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-0 z-10 rounded-full bg-gray-800 p-2 text-white shadow-lg hover:bg-gray-700"
        >
          <FaChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
