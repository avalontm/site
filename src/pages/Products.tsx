import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import SkeletonImage from "../components/SkeletonImage"; // Importamos el Skeleton
import { Product } from "../interfaces/Product";
import config from "../config";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/product/listar`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">
        Nuestros Productos
      </h1>

      {loading ? (
        // 👇 Sección de carga con "skeletons"
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

        // 👇 Lista real de productos cuando ya están cargados
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
    </div>
  );
};

export default Products;
