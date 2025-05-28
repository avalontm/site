import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import config from "../config";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Star } from "lucide-react";

interface Review {
  id?: number;
  name: string;
  comment: string;
  avatar: string;
  rating: number;
}

const CustomerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${config.apiUrl}/comentario/recientes`);
        const data = await res.json();

        if (data.status && data.comentarios) {
          const mapped = data.comentarios.map((c: any, index: number) => ({
            id: index,
            name: `${c.nombre} ${c.apellido}`,
            comment: c.comentario,
            avatar: c.avatar || "https://via.placeholder.com/150", // fallback
            rating: c.calificacion,
          }));
          setReviews(mapped);
        }
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center overflow-hidden p-6 sm:max-w-screen-sm lg:max-w-screen-2xl">
      <h2 className="mb-4 text-center text-2xl font-bold dark:text-white">Opiniones de Clientes</h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-300">Cargando opiniones...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">Aún no hay opiniones.</p>
      ) : (
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
                <div className="w-[90%] max-w-[460px] rounded-lg bg-white p-4 text-center shadow-md">
                  <img src={review.avatar} alt={review.name} className="mx-auto mb-3 size-16 rounded-full object-cover" />
                  <h3 className="font-semibold text-black dark:text-white">{review.name}</h3>
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

          <button className="swiper-button-prev absolute left-0 top-1/2 hidden -translate-y-1/2 text-gray-700 sm:flex" />
          <button className="swiper-button-next absolute right-0 top-1/2 hidden -translate-y-1/2 text-gray-700 sm:flex" />
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
