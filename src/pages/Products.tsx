import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import SkeletonImage from "../components/SkeletonImage";
import Loading from "../components/Loading";
import { Product } from "../interfaces/Product";
import config from "../config";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { Search } from "lucide-react"; // Icono de búsqueda

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState(""); // Estado para la búsqueda
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Búsqueda con delay
  const [order, setOrder] = useState("asc"); // Estado para ordenación
  const [sortBy, setSortBy] = useState("fecha_creacion"); // Estado para ordenar por precio o fecha
  const [isFocused, setIsFocused] = useState(false);

  // Delay de 500ms antes de hacer la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Función para obtener productos
  const fetchProducts = async (pageNumber: number, reset: boolean = false) => {
    if (!hasMore && !reset) return;

    try {
      setIsFetching(true);
      const response = await fetch(
        `${config.apiUrl}/producto/listar?page=${pageNumber}&limit=20&orden=${order}&ordenar_por=${sortBy}&search=${debouncedSearch}`
      );
      if (!response.ok) toast.error("Error al obtener los productos");

      const data = await response.json();

      setTimeout(() => {
        if (Array.isArray(data.productos)) {
          setProducts(reset ? data.productos : (prev) => [...prev, ...data.productos]);
          setPage(pageNumber + 1);
          setHasMore(data.has_more);
        }
        setIsFetching(false);
      }, 1000);
    } catch (err) {
      toast.error((err as Error).message);
      setIsFetching(false);
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar búsqueda y reiniciar productos cuando `debouncedSearch`, `order` o `sortBy` cambien
  useEffect(() => {
    setProducts([]); // Reiniciar productos
    setPage(1);
    fetchProducts(1, true);
  }, [debouncedSearch, order, sortBy]);

  useEffect(() => {
    const handleScroll = () => {
      if (isFetching || !hasMore) return; // Evitar llamadas innecesarias

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (currentScroll >= scrollableHeight - 10) {
        fetchProducts(page); // Llamar solo cuando el usuario llega al final
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

      {/* Barra de búsqueda y orden */}
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="relative flex w-full items-center">
          {/* 🔍 Ícono de búsqueda con animación */}
          <motion.div
            className="absolute left-3 cursor-pointer text-gray-500"
            animate={{ rotate: isFocused ? 90 : 0, color: isFocused ? "#3b82f6" : "#6b7280" }}
            transition={{ duration: 0.3 }}
          >
            <Search size={20} />
          </motion.div>

          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full rounded-lg border border-gray-300 p-2 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Selector de ordenamiento */}
        <div className="flex gap-2 md:gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-500 md:w-auto"
          >
            <option value="fecha_creacion">Ordenar por Fecha</option>
            <option value="precio">Ordenar por Precio</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-blue-500 md:w-auto"
          >
            <option value="asc">{sortBy === "precio" ? "Menor a Mayor" : "Más recientes"}</option>
            <option value="desc">{sortBy === "precio" ? "Mayor a Menor" : "Más antiguos"}</option>
          </select>
        </div>
      </div>

      {/* Mostrar productos */}
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

      {/* Cargando más productos */}
      {isFetching && (
        <div className="my-6 flex justify-center">
          <Loading />
        </div>
      )}

      {/* No hay más productos */}
      {!hasMore && !isFetching && (
        <p className="mt-4 text-center text-gray-500">No hay más productos disponibles.</p>
      )}
    </div>
  );
};

export default Products;
