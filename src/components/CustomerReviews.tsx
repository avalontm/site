import { Star } from "lucide-react";
import { Review } from "../interfaces/Review";

const reviews: Review[] = [
  {
    id: 1,
    name: "Juan Pérez",
    comment: "¡Excelente servicio y productos de calidad! Recomendado al 100%.",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "María Gómez",
    comment: "Me encantó mi compra, llegó rápido y en perfecto estado.",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4,
  },
  {
    id: 3,
    name: "Carlos López",
    comment: "Muy satisfecho con la atención al cliente. Volveré a comprar.",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    rating: 5,
  },
];

const CustomerReviews = () => {
  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="mb-4 text-2xl font-bold dark:text-white">Opiniones de Clientes</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-md dark:bg-gray-700"
          >
            <img
              src={review.avatar}
              alt={review.name}
              className="mb-3 size-16 rounded-full"
            />
            <h3 className="font-semibold dark:text-white">{review.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
            <div className="mt-2 flex">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={18} className={index < review.rating ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;