import React from "react";

type Image = {
  id: number;
  src: string;
  alt: string;
  size: "square" | "vertical" | "horizontal";
};

const images: Image[] = [
  { id: 1, src: "/assets/images/img1.jpg", alt: "Imagen 1", size: "square" },
  { id: 2, src: "/assets/images/img2.jpg", alt: "Imagen 2", size: "horizontal" },
  { id: 3, src: "/assets/images/img3.jpg", alt: "Imagen 3", size: "vertical" },
  { id: 4, src: "/assets/images/img4.jpg", alt: "Imagen 4", size: "square" },
  { id: 5, src: "/assets/images/img5.jpg", alt: "Imagen 5", size: "square" },
  { id: 6, src: "/assets/images/img6.jpg", alt: "Imagen 6", size: "horizontal" },
];

const Gallery: React.FC = () => {
  return (
    <section id="galeria" className="bg-gray-100 py-20">
      <div className="container mx-auto text-center">
        <h2 className="mb-12 text-4xl font-bold text-gray-800">Galería de Productos</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:scale-105${
                image.size === "square"
                  ? "col-span-1"
                  : image.size === "horizontal"
                  ? "col-span-2"
                  : "col-span-1 row-span-2"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="size-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
