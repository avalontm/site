import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { useCart } from "../CartContext";
import { Helmet } from "react-helmet-async";
import ProductCarousel3D from "../components/ProductCarousel3D";
import { toast } from "react-toastify"; // Importa el toast y el contenedor
import "react-toastify/dist/ReactToastify.css"; // Importa el CSS de toastify

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string  }>();
  const { addToCart } = useCart();
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Simulación de producto con cantidad disponible
  const product = {
    identifier : productId ?? "",
    name: "Apple Watch Series 7 GPS, Aluminium Case, Starlight Sport",
    images: [
      "https://flowbite.com/docs/images/products/apple-watch.png",
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/FKN63_AV1?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1647901207804",
      "https://images-na.ssl-images-amazon.com/images/I/71rimxfInpL._AC_UL495_SR435,495_.jpg",
    ],
    price: 599,
    description: "Este reloj es ideal para el día a día. Cuenta con monitoreo de salud y funciones avanzadas.",
    quantityInStock: 10, // Cantidad en existencia
    url: window.location.href,
  };

  const handleAddToCart = () => {
    if (buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
    addToCart({
      identifier : product.identifier,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
    });

    // Mostrar un mensaje de toast cuando el producto se agregue al carrito
    toast.success(`${product.name} ha sido agregado al carrito`, {
      position: "top-right", // Posición del toast
      autoClose: 3000, // Tiempo que permanece visible (en milisegundos)
      hideProgressBar: false, // Mostrar barra de progreso
      closeOnClick: true, // Cerrar el toast al hacer clic
      pauseOnHover: true, // Pausar al hacer hover
    });
  };

  return (
    <div className="container mx-auto p-8">
      <Helmet>
        <title>{product.name} | Partybara</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:image" content={product.images[0]} />
        <meta property="og:url" content={product.url} />
      </Helmet>

      <div className="flex flex-col items-center md:flex-row md:items-start">
        {/* 🌀 Carrusel 3D con SwiperJS */}
        <div className="mb-8">
          <ProductCarousel3D images={product.images} />
        </div>

        {/* Información del Producto */}
        <div className="w-full md:w-1/2 md:pl-8">
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">{product.name}</h2>
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">{product.description}</p>

          {/* Cantidad en existencia */}
          <div className="mt-4 text-lg text-gray-600">
            {product.quantityInStock > 0 ? (
              <span>{`En existencia: ${product.quantityInStock} unidades`}</span>
            ) : (
              <span className="text-red-600">¡Agotado!</span>
            )}
          </div>

          <div className="mt-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
          </div>

          {/* Botón de Agregar al carrito */}
          <div className="mt-6">
            <button
              ref={buttonRef}
              className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 md:w-auto"
              onClick={handleAddToCart}
              disabled={product.quantityInStock <= 0} // Deshabilitar si está agotado
            >
              {product.quantityInStock > 0 ? "Agregar al carrito" : "Agotado"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
