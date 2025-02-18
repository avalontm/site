import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import { Helmet } from "react-helmet-async";
import ProductCarousel3D from "../components/ProductCarousel3D";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config";
import { Product } from "../interfaces/Product";
import Loading from "../components/Loading";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/product/${productId}`);
        if (!response.ok) {
          throw new Error("Producto no encontrado");
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError("No se pudo cargar el producto.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      uuid: product.uuid,
      fecha_creacion: product.fecha_creacion,
      nombre: product.nombre,
      descripcion: product.descripcion,
      imagen: product.imagen,
      precio: product.precio,
      cantidad: 1,
      no_disponible: product.no_disponible,
    });

    toast.success(`${product.nombre} ha sido agregado al carrito`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            ¡Vaya! El producto no se ha encontrado
          </h2>
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            Lamentablemente, no pudimos encontrar el artículo que buscas. Por favor, verifica el enlace o vuelve a la página principal.
          </p>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Volver a la página principal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Helmet>
        <title>{product?.nombre} | Partybara</title>
        <meta name="description" content={product?.descripcion} />
        <meta property="og:title" content={product?.nombre} />
        <meta property="og:image" content={product?.imagen} />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      {/* Contenedor del producto */}
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-8 rounded-lg bg-white shadow-lg dark:bg-gray-800 md:flex-row md:p-8">
        {/* 🌀 Carrusel 3D */}
        <div className="mb-8 flex justify-center md:w-1/2">
          <ProductCarousel3D
            images={Array.isArray(product.imagen) ? product.imagen : [product?.imagen]}
          />
        </div>

        {/* Información del Producto */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{product?.nombre}</h2>
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">{product?.descripcion}</p>

          <div className="mt-4 flex items-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${product?.precio.toFixed(2)}</span>
          </div>

          {/* Valoraciones del producto */}
          <div className="mt-4 text-yellow-500">
            ★★★★★ (5 de 5 estrellas)
          </div>

          {/* Cantidad en existencia */}
          <div className="mt-6 text-lg text-gray-700 dark:text-gray-300">
            {product.cantidad > 0 ? (
              <span>{`En existencia: ${product?.cantidad} unidades`}</span>
            ) : (
              <span className="text-red-600">¡Agotado!</span>
            )}
          </div>

          <div className="mt-6">
            <button
              className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleAddToCart}
              disabled={product.cantidad <= 0}
            >
              {product.cantidad > 0 ? "Agregar al carrito" : "Agotado"}
            </button>
          </div>

          {/* Opciones de envío */}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>Envío gratis en compras superiores a $1000</p>
          </div>

          {/* Información adicional */}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>Entregado en 2-3 días hábiles.</p>
            <p>Más de 1000 unidades vendidas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
