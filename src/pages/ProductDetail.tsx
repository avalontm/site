import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import { Helmet } from "react-helmet-async";
import ProductCarousel3D from "../components/ProductCarousel3D";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import config from "../config";
import { Product } from "../interfaces/Product";
import Loading from "../components/Loading";
import { FaShareAlt, FaEdit } from "react-icons/fa";

const flagConfig: { [key: number]: { text: string; bgColor: string } } = {
  1: { text: "NUEVO", bgColor: "bg-green-500" },
  2: { text: "OFERTA", bgColor: "bg-red-500" },
  3: { text: "EXCLUSIVO", bgColor: "bg-purple-600" },
};

const ProductDetail = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const { addToCart } = useCart();
  const { role } = useAuth();

  const [product, setProduct] = useState<Product>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/producto/${uuid}`);
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
  }, [uuid]);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      uuid: product.uuid,
      fecha_creacion: product.fecha_creacion,
      categoria_uuid: product.categoria_uuid,
      inversionista_uuid: product.inversionista_uuid,
      sku: product.sku,
      nombre: product.nombre,
      descripcion: product.descripcion,
      imagen: product.imagen,
      precio_unitario: product.precio_unitario,
      precio: product.precio,
      cantidad: 1,
      bandera: product.bandera,
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/compartir/${product?.uuid}`);
      toast.success("Enlace copiado al portapapeles");
    } catch (error) {
      toast.error("No se pudo copiar el enlace");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            ¡Vaya! El producto no se ha encontrado
          </h2>
          <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
            Lamentablemente, no pudimos encontrar el artículo que buscas. Verifica el enlace o vuelve a la página principal.
          </p>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Volver a la página principal
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="flex w-full items-center justify-center">
          <Helmet>
            <title>{product?.nombre}</title>
            <meta name="description" content={product?.descripcion} />
          </Helmet>

          <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-8 rounded-lg bg-white p-5 shadow-lg md:flex-row md:p-8">
            {/* Carrusel 3D */}
            <div className="mb-8 flex justify-center md:w-1/2">
              <ProductCarousel3D images={Array.isArray(product?.imagen) ? product?.imagen : [product.imagen]} />
            </div>

            {/* Información del Producto */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">{product?.nombre}</h2>

              {/* Contenedor del precio y la bandera */}
              <div className="mt-4 flex items-center gap-3">
                {product.bandera > 0 && (
                  <div className="relative flex items-center">
                    <div
                      className={`relative px-3 py-1 text-sm font-bold uppercase tracking-wide text-white ${flagConfig[product.bandera].bgColor}`}
                    >
                      {flagConfig[product.bandera].text}
                    </div>
                    <div
                      className={`${flagConfig[product.bandera].bgColor} border-r-[12px]`}
                      style={{
                        borderTop: "14px solid transparent",
                        borderBottom: "14px solid transparent",
                        width: "0",
                        height: "0",
                      }}
                    ></div>
                  </div>
                )}

                <span className="text-2xl font-bold text-gray-900 dark:text-white">${product?.precio?.toFixed(2)}</span>
              </div>

              {/* Mensaje de disponibilidad */}
              {product.cantidad === 0 ? (
                <div className="mt-2  font-semibold text-red-500">
                  <p>Producto agotado</p>
                </div>
              ) : product.cantidad < 5 ? (
                <div className="mt-2 font-semibold text-red-500">
                  <p>¡Quedan pocas unidades disponibles!</p>
                  <span className="block text-sm">({product.cantidad} en stock)</span>
                </div>
              ) : (
                <div className="mt-2 font-semibold text-green-600">
                  <p>Disponibles:</p>
                  <span className="block text-sm">{product.cantidad} unidades</span>
                </div>
              )}

              <p className="mt-2 text-lg text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: String(product?.descripcion || "") }}
              >
              </p>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  <FaShareAlt /> Compartir
                </button>

                {/* Botón Editar si es Admin */}
                {role === "admin" && (
                  <button
                    onClick={() => window.open(`/dashboard/producto/${product?.uuid}`, "_blank")}
                    className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    <FaEdit /> Editar
                  </button>
                )}
              </div>

              <div className="mt-6">
                <button
                  className="w-full rounded-full border-2 bg-black py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:border-2 hover:border-black hover:bg-transparent hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleAddToCart}
                  disabled={product.cantidad <= 0}
                  >
                  {product.cantidad > 0 ? "Agregar al carrito" : "Agotado"}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
