import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Star } from "lucide-react";
import { Review } from "../interfaces/Review";

const reviews: Review[] = [
  { id: 1, name: "Juan Pérez", comment: "¡Excelente servicio y productos de calidad! Recomendado al 100%.", avatar: "https://randomuser.me/api/portraits/men/1.jpg", rating: 5 },
  { id: 2, name: "María Gómez", comment: "Me encantó mi compra, llegó rápido y en perfecto estado.", avatar: "https://randomuser.me/api/portraits/women/2.jpg", rating: 4 },
  { id: 3, name: "Carlos López", comment: "Muy satisfecho con la atención al cliente. Volveré a comprar.", avatar: "https://randomuser.me/api/portraits/men/3.jpg", rating: 5 },
  { id: 4, name: "Ana Martínez", comment: "Gran calidad en los productos. Seguro compraré otra vez.", avatar: "https://randomuser.me/api/portraits/women/4.jpg", rating: 5 },
  { id: 5, name: "Pedro Ramírez", comment: "Servicio rápido y eficiente. Todo perfecto.", avatar: "https://randomuser.me/api/portraits/men/5.jpg", rating: 4 },
  { id: 6, name: "Laura Torres", comment: "El empaque fue impecable. Muy recomendado.", avatar: "https://randomuser.me/api/portraits/women/6.jpg", rating: 5 }
];

const CustomerReviews = () => {
  return (
    <div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center overflow-hidden p-6 sm:max-w-screen-sm lg:max-w-screen-2xl">
      <h2 className="mb-4 text-center text-2xl font-bold dark:text-white">Opiniones de Clientes</h2>

      <div className="relative w-full max-w-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="w-full max-w-full"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="flex justify-center">
              <div className="w-[90%] max-w-[460px] rounded-lg bg-white p-4 text-center shadow-md sm:max-w-screen-sm lg:max-w-screen-2xl">
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
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Flechas de navegación (se ocultan en móviles) */}
        <button className="swiper-button-prev absolute left-0 top-1/2 hidden -translate-y-1/2 text-gray-700 sm:flex" />
        <button className="swiper-button-next absolute right-0 top-1/2 hidden -translate-y-1/2 text-gray-700 sm:flex" />
      </div>
    </div>
  );
};


export default CustomerReviews;
