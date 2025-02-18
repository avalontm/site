import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "../interfaces/Product";
import { Category } from "../interfaces/Category";
import config from "../config";
import Loading from "../components/Loading";
import MiniLoading from "../components/MiniLoading";

const ProductosPanel = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [pagina, setPagina] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [categoriasCargadas, setCategoriasCargadas] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productoAEliminar, setProductoAEliminar] = useState<Product | null>(null);
  const [eliminando, setEliminando] = useState<boolean>(false);  // Estado para seguimiento de eliminación

  const cargarProductos = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No se encontró el token de autenticación.");
    
    try {
      const response = await fetch(
        `${config.apiUrl}/product/dashboard/pagina?page=${pagina}&categoria=${categoriaSeleccionada}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setProductos(data.productos);
      setTotalPaginas(data.totalPaginas);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No se encontró el token de autenticación.");
    
    try {
      const response = await fetch(`${config.apiUrl}/category/listar`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCategorias(data);
      setCategoriasCargadas(true);
      if (data.length > 0) setCategoriaSeleccionada(data[0].uuid);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (categoriasCargadas && categoriaSeleccionada) {
      cargarProductos();
    }
  }, [pagina, categoriaSeleccionada, categoriasCargadas]);

  const cambiarPagina = (pagina: number) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPagina(pagina);
    }
  };

  const manejarCategoria = (evento: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaSeleccionada(evento.target.value);
    setPagina(1);
  };

  // Función para eliminar un producto
  const eliminarProducto = async (uuid: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return console.error("No se encontró el token de autenticación.");

    setEliminando(true);  // Iniciar spinner de eliminación

    try {
      const response = await fetch(`${config.apiUrl}/product/dashboard/${uuid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      // Filtrar la lista de productos después de eliminar
      setProductos(productos.filter((producto) => producto.uuid !== uuid));
      setProductoAEliminar(null); // Cerrar el diálogo después de eliminar
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    } finally {
      setEliminando(false);  // Finalizar spinner de eliminación
    }
  };

  return (
    <div className="flex w-full flex-col items-center bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold">Panel de Productos</h1>

      {loading ? (
        <div className="flex w-full flex-col items-center justify-center p-10">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-center text-lg font-semibold text-red-500">
          Error: {error}
        </p>
      ) : (
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
                        onClick={() => setProductoAEliminar(producto)}
                        className="text-red-500 hover:text-red-300"
                        disabled={eliminando} // Deshabilitar si está eliminando
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

      {/* Diálogo de confirmación */}
      {productoAEliminar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-gray-800 p-6 text-white">
            <p>¿Estás seguro de que quieres eliminar "{productoAEliminar.nombre}"?</p>
            <div className="mt-4 flex justify-end">
              <button className="mr-4 text-gray-400" onClick={() => setProductoAEliminar(null)}>Cancelar</button>
              <button
                className="rounded-lg bg-red-500 px-4 py-2"
                onClick={() => eliminarProducto(productoAEliminar.uuid)}
                disabled={eliminando} // Deshabilitar si está eliminando
              >
                {eliminando ? <MiniLoading /> : "Eliminar"} {/* Mostrar spinner mientras elimina */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosPanel;
