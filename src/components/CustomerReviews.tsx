import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Review } from "../interfaces/Review";

const reviews: Review[] = [
  { id: 1, name: "Juan Pérez", comment: "¡Excelente servicio y productos de calidad! Recomendado al 100%.", avatar: "https://randomuser.me/api/portraits/men/1.jpg", rating: 5 },
  { id: 2, name: "María Gómez", comment: "Me encantó mi compra, llegó rápido y en perfecto estado.", avatar: "https://randomuser.me/api/portraits/women/2.jpg", rating: 4 },
  { id: 3, name: "Carlos López", comment: "Muy satisfecho con la atención al cliente. Volveré a comprar.", avatar: "https://randomuser.me/api/portraits/men/3.jpg", rating: 5 },
  { id: 4, name: "Ana Martínez", comment: "Gran calidad en los productos. Seguro compraré otra vez.", avatar: "https://randomuser.me/api/portraits/women/4.jpg", rating: 5 },
  { id: 5, name: "Pedro Ramírez", comment: "Servicio rápido y eficiente. Todo perfecto.", avatar: "https://randomuser.me/api/portraits/men/5.jpg", rating: 4 },
  { id: 6, name: "Laura Torres", comment: "El empaque fue impecable. Muy recomendado.", avatar: "https://randomuser.me/api/portraits/women/6.jpg", rating: 5 },
  { id: 7, name: "Fernando Castillo", comment: "Productos de alta calidad. Muy contento.", avatar: "https://randomuser.me/api/portraits/men/7.jpg", rating: 5 },
  { id: 8, name: "Gabriela Ríos", comment: "Superó mis expectativas. Excelente atención.", avatar: "https://randomuser.me/api/portraits/women/8.jpg", rating: 5 },
  { id: 9, name: "Javier Núñez", comment: "Buena relación calidad-precio. Volveré a comprar.", avatar: "https://randomuser.me/api/portraits/men/9.jpg", rating: 4 },
  { id: 10, name: "Silvia Herrera", comment: "Lo mejor que he comprado este año. Increíble.", avatar: "https://randomuser.me/api/portraits/women/10.jpg", rating: 5 }
];

const CustomerReviews = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps"
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative flex flex-col items-center overflow-hidden p-6">
      <h2 className="mb-4 text-center text-2xl font-bold dark:text-white">Opiniones de Clientes</h2>

      {/* Botón Izquierdo */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 shadow-lg dark:bg-gray-700 sm:flex"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Carrusel */}
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="box-border w-full flex-none px-2 sm:w-1/3 md:w-1/3 lg:w-1/4"
            >
              <div className="rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-700">
                <img src={review.avatar} alt={review.name} className="mx-auto mb-3 size-16 rounded-full" />
                <h3 className="font-semibold dark:text-white">{review.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                <div className="mt-2 flex justify-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className={index < review.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón Derecho */}
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-2 shadow-lg dark:bg-gray-700 sm:flex"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default CustomerReviews;
