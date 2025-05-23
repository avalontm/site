import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "../interfaces/Product";
import { Category } from "../interfaces/Category";
import config from "../config";
import Loading from "../components/Loading";
import MiniLoading from "../components/MiniLoading";
import { toast } from "react-toastify";

const ProductosPanel = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>(
    localStorage.getItem("categoriaSeleccionada") || ""
  );
  const [pagina, setPagina] = useState<number>(1);
  const [totalPaginas, setTotalPaginas] = useState<number>(1);
  const [categoriasCargadas, setCategoriasCargadas] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productoAEliminar, setProductoAEliminar] = useState<Product | null>(null);
  const [eliminando, setEliminando] = useState<boolean>(false);  // Estado para seguimiento de eliminación

  const defaultImage = "/assets/default-product.png"; // Imagen por defecto

  const cargarCategorias = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("No se encontró el token de autenticación.");
    
    try {
      const response = await fetch(`${config.apiUrl}/categoria/listar`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCategorias(data);
      setCategoriasCargadas(true);

      if (!categoriaSeleccionada && data.length > 0) {
        setCategoriaSeleccionada(data[0].uuid);
        localStorage.setItem("categoriaSeleccionada", data[0].uuid);
      }
    } catch (error) {
      toast.error("Error al cargar categorías: " + error);
    }
  };

  const cargarProductos = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) 
      return toast.error("No se encontró el token de autenticación.");
    
    setLoading(true);
    
    try {
      const response = await fetch(
        `${config.apiUrl}/producto/panel/pagina?page=${pagina}&categoria=${categoriaSeleccionada}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setProductos(data.productos);
      setTotalPaginas(data.totalPaginas);
    } catch (err) {
      toast.error("Error al cargar productos: " + err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
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
    localStorage.setItem("categoriaSeleccionada", evento.target.value);
    setPagina(1);
  };

  // Función para eliminar un producto
  const eliminarProducto = async (uuid: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return toast.error("No se encontró el token de autenticación.");

    setEliminando(true);  // Iniciar spinner de eliminación

    try {
      const response = await fetch(`${config.apiUrl}/producto/panel/${uuid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        toast.error("Error al eliminar el producto");
        return;
      }

      // Filtrar la lista de productos después de eliminar
      setProductos(productos.filter((producto) => producto.uuid !== uuid));
      setProductoAEliminar(null); // Cerrar el diálogo después de eliminar
    } catch (error) {
      toast.error("Error al eliminar producto: " + error);
    } finally {
      setEliminando(false);  // Finalizar spinner de eliminación
    }
  };

  return (
    <div className="container mx-auto min-h-screen bg-gray-50 p-4">
      <h1 className="mb-4 text-3xl font-semibold text-gray-800">Panel de Productos</h1>

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
          <div className="mb-6 flex items-center space-x-4">
            <select
              className="w-full rounded-lg bg-gray-100 px-6 py-3 text-gray-900"
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
          <div className="my-6 max-w-lg">
            <Link
              to="/dashboard/producto"
              className="w-full max-w-lg rounded-lg bg-black px-6 py-3 text-center font-medium text-white transition hover:bg-gray-950"
            >
              Nuevo Producto
            </Link>
          </div>

          {/* Tabla con los productos */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
            <table className="min-w-full table-auto bg-white">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-3">Imagen</th>
                  <th className="px-6 py-3">Nombre</th>
                  <th className="px-6 py-3">Precio</th>
                  <th className="px-6 py-3">Cantidad</th>
                  <th className="px-6 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.uuid} className="border-b border-gray-200">
                    <td className="px-6 py-4">
                      {/* Verifica si la imagen está presente y muestra la imagen con un tamaño adecuado */}
                      {producto.imagen ? (
                        <a href={`/producto/${producto.uuid}`} target="_blank" rel="noopener noreferrer">
                          <img
                            src={producto.imagen}  // Asegúrate de que el campo 'imagen' tenga la URL correcta
                            alt={producto.nombre}
                            className="size-16 rounded object-cover"
                            onError={(e) => (e.currentTarget.src = defaultImage)}
                          />
                        </a>
                      ) : (
                        <span>No disponible</span>  // Si no hay imagen, muestra un mensaje alternativo
                      )}
                    </td>
                    <td className="px-6 py-4">
                     <a href={`/producto/${producto.uuid}`} target="_blank" rel="noopener noreferrer">
                        {producto.nombre}
                      </a>
                    </td>
                    <td className="px-6 py-4 font-bold text-red-600">${producto.precio.toFixed(2)}</td>
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
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900"
              onClick={() => cambiarPagina(pagina - 1)}
              disabled={pagina <= 1}
            >
              Anterior
            </button>
            <span className="px-4 py-2 text-gray-900">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-900"
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
          <div className="rounded-lg bg-gray-200 p-6 text-gray-900">
            <p>¿Estás seguro de que quieres eliminar "{productoAEliminar.nombre}"?</p>
            <div className="mt-4 flex justify-end">
              <button className="mr-4 text-gray-600" onClick={() => setProductoAEliminar(null)}>Cancelar</button>
              <button
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
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
