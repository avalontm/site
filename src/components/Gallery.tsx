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
    <div className="grid auto-rows-[20vw] grid-cols-3 gap-2 p-4">
      {images.map((image) => (
        <div
          key={image.id}
          className={`overflow-hidden rounded-lg ${
            image.size === "square"
              ? "col-span-1 row-span-1"
              : image.size === "horizontal"
              ? "col-span-2 row-span-1"
              : "col-span-1 row-span-2"
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="size-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
