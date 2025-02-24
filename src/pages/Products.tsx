import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import SkeletonImage from "../components/SkeletonImage";
import Loading from "../components/Loading"; // Importamos el componente Loading
import { Product } from "../interfaces/Product";
import config from "../config";
import { Helmet } from "react-helmet-async";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Nuevo estado para saber si hay más productos

  const fetchProducts = async (pageNumber: number) => {
    if (!hasMore) return; // Evitar llamadas innecesarias si ya no hay más productos

    try {
      setIsFetching(true);
      const response = await fetch(`${config.apiUrl}/producto/listar?page=${pageNumber}&limit=20`);
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();

      setTimeout(() => {
        if (Array.isArray(data.productos)) {
          setProducts((prev) => [...prev, ...data.productos]); // Agregar productos sin borrar los anteriores
          setPage(pageNumber + 1);
          setHasMore(data.has_more); // Actualizar si hay más productos por cargar
        }
        setIsFetching(false);
      }, 1000); // Simulación de carga para que el Loading sea visible
    } catch (err) {
      setError((err as Error).message);
      setIsFetching(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !isFetching) {
        fetchProducts(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, isFetching, hasMore]);

  return (
    <div className="container mx-auto min-h-screen p-4">
      <Helmet>
        <title>Catálogo</title>
      </Helmet>

      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
        Nuestros Productos
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonImage key={index} />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-lg font-semibold text-red-500">
          Error: {error}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <motion.div
              key={product.uuid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Mostrar el componente Loading cuando está cargando más productos */}
      {isFetching && (
        <div className="my-6 flex justify-center">
          <Loading />
        </div>
      )}

      {/* Mensaje de que no hay más productos */}
      {!hasMore && !isFetching && (
        <p className="mt-4 text-center text-gray-500">No hay más productos disponibles.</p>
      )}
    </div>
  );
};

export default Products;
