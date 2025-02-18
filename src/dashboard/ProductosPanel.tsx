import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "../interfaces/Product";
import { Category } from "../interfaces/Category";
import config from "../config";
import Loading from "../components/Loading";

const ProductosPanel = () => {
  // Estados para los productos, categorías, paginación y filtros
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [pagina, setPagina] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [categoriasCargadas, setCategoriasCargadas] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos con paginación
  const cargarProductos = async () => {
    const token = localStorage.getItem("authToken"); // Obtener el token del localStorage 
    if (!token) {
        console.error("No se encontró el token de autenticación.");
        return;
    }
    try {
      const response = await fetch(
        `${config.apiUrl}/product/pagina?page=${pagina}&categoria=${categoriaSeleccionada}`,
        {
            method: "GET", // Tipo de solicitud (GET, POST, etc.)
            headers: {
              "Content-Type": "application/json", // Tipo de contenido de la solicitud
              Authorization: `Bearer ${token}`, // Agregar el Bearer token en el encabezado
            },
        }
      );
      const data = await response.json();
      setProductos(data.productos);
      setTotalPaginas(data.totalPaginas); // Asumimos que la respuesta incluye el total de páginas
     } catch (err) {
        setError((err as Error).message);
    }finally
    {
        setLoading(false);
    }
  };

  // Cargar categorías para el filtro
  const cargarCategorias = async () => {
    const token = localStorage.getItem("authToken"); // Obtener el token del localStorage
    if (!token) {
        console.error("No se encontró el token de autenticación.");
        return;
    }
    try {
      const response = await fetch(`${config.apiUrl}/category/listar`, {
            method: "GET", // Tipo de solicitud (GET, POST, etc.)
            headers: {
              "Content-Type": "application/json", // Tipo de contenido de la solicitud
              Authorization: `Bearer ${token}`, // Agregar el Bearer token en el encabezado
            },
        });
      const data = await response.json();
      setCategorias(data);
      setCategoriasCargadas(true); // Marcar que las categorías están cargadas

      // Seleccionar automáticamente la primera categoría
      if (data.length > 0) {
        setCategoriaSeleccionada(data[0].uuid);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  // Llamar a cargar categorías cuando el componente se monta
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Llamar a cargar productos después de que las categorías estén cargadas
  useEffect(() => {
    if (categoriasCargadas && categoriaSeleccionada) {
      cargarProductos();
    }
  }, [pagina, categoriaSeleccionada, categoriasCargadas]);

  // Función para cambiar la página
  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPagina(pagina);
    }
  };

  // Función para manejar el cambio de categoría
  const manejarCategoria = (evento: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaSeleccionada(evento.target.value);
    setPagina(1); // Resetear a la primera página cuando se cambia la categoría
  };

  return (
    <div className="flex w-full flex-col items-center  bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold">Panel de Productos</h1>

      {loading ? (
        // Sección de carga con "skeletons"
        <div className="flex w-full flex-col items-center justify-center p-10">
          {<Loading/>}
        </div>
      ) : error ? (
        <p className="text-center text-lg font-semibold text-red-500">
          Error: {error}
        </p>
      ) : (

      /* Filtro por categoría */
      <>
                          {/* Filtro por categoría */}
                          <div className="mt-6 w-full max-w-lg">
                              <select
                                  className="w-full rounded-lg bg-gray-700 px-6 py-3 text-white"
                                  value={categoriaSeleccionada}
                                  onChange={manejarCategoria}
                              >
                                  {categorias.map((categoria) => (
                                      <option key={categoria.uuid} value={categoria.uuid}>
                                          {categoria.nombre}
                                      </option>
                                  ))}
                              </select>
                          </div>
                          {/* Botón para agregar producto */}
                          <div className="mt-6 max-w-lg">
                              <Link
                                  to="/dashboard/producto"
                                  className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-medium transition hover:bg-blue-700"
                              >
                                  Agregar Producto
                              </Link>
                          </div>
                          {/* Tabla con los productos */}
                          <div className="mt-6 w-full overflow-x-auto rounded-lg bg-gray-800">
                              <table className="min-w-full text-left text-sm text-gray-400">
                                  <thead className="bg-gray-700">
                                      <tr>
                                          <th className="px-6 py-3">Nombre</th>
                                          <th className="px-6 py-3">Descripción</th>
                                          <th className="px-6 py-3">Precio</th>
                                          <th className="px-6 py-3">Cantidad</th>
                                          <th className="px-6 py-3">Acciones</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {productos.map((producto) => (
                                          <tr key={producto.uuid} className="border-b border-gray-700">
                                              <td className="px-6 py-4">{producto.nombre}</td>
                                              <td className="px-6 py-4">{producto.descripcion}</td>
                                              <td className="px-6 py-4">${producto.precio}</td>
                                              <td className="px-6 py-4">{producto.cantidad}</td>
                                              <td className="px-6 py-4">
                                                  <Link
                                                      to={`/dashboard/producto/${producto.uuid}`}
                                                      className="text-yellow-500 hover:text-yellow-300"
                                                  >
                                                      Editar
                                                  </Link>{" "}
                                                  |{" "}
                                                  <button
                                                      onClick={() => alert(`Eliminar producto ${producto.uuid}`)}
                                                      className="text-red-500 hover:text-red-300"
                                                  >
                                                      Eliminar
                                                  </button>
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                          {/* Paginación */}
                          <div className="mt-6 flex justify-center">
                              <button
                                  className="rounded-lg bg-gray-700 px-4 py-2 text-white"
                                  onClick={() => cambiarPagina(pagina - 1)}
                                  disabled={pagina <= 1}
                              >
                                  Anterior
                              </button>
                              <span className="px-4 py-2 text-white">
                                  Página {pagina} de {totalPaginas}
                              </span>
                              <button
                                  className="rounded-lg bg-gray-700 px-4 py-2 text-white"
                                  onClick={() => cambiarPagina(pagina + 1)}
                                  disabled={pagina >= totalPaginas}
                              >
                                  Siguiente
                              </button>
                          </div>
                        </>
       )}
    </div>
  );
};

export default ProductosPanel;
