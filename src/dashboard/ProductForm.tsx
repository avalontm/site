import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Product } from "../interfaces/Product";
import config from "../config";
import Loading from "../components/Loading";
import { Category } from "../interfaces/Category";

const ProductoForm = () => {
  const { uuid } = useParams<string>(); // Obtener el uuid de los parámetros de la URL (si existe)
  const navigate = useNavigate(); // Para redirigir después de guardar el producto
  const [producto, setProducto] = useState<Product>({
    uuid: "",
    fecha_creacion: new Date(),
    categoria_uuid: "",
    nombre: "",
    descripcion: "",
    imagen: "",
    precio_unitario: 0,
    precio: 0,
    cantidad: 1,
    no_disponible: false,
  });
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar las categorías
  const cargarCategorias = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No se encontró el token de autenticación.");
      return;
    }
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
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  // Función para cargar el producto (si estamos editando)
  const cargarProducto = async () => {
    if (!uuid) return;
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No se encontró el token de autenticación.");
      return;
    }
  
    try {
      const response = await fetch(`${config.apiUrl}/product/dashboard/${uuid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProducto(data); 
      setLoading(false);
    } catch (error) {
      setError("Error al cargar el producto.");
      setLoading(false);
    }
  };
  

  // Función para guardar el producto (crear o actualizar)
  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No se encontró el token de autenticación.");
      return;
    }
 
    const url = (uuid && uuid.trim()) 
    ? `${config.apiUrl}/product/dashboard/${uuid}` // Si existe un uuid no vacío ni undefined, estamos editando
    : `${config.apiUrl}/product/dashboard/crear`; // Si no existe un uuid o está vacío, estamos creando

    const method = (uuid && uuid.trim()) ? "PUT" : "POST"; // PUT para editar, POST para crear
    console.log(JSON.stringify(producto));
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto), // Enviar el objeto completo incluyendo categoria_uuid
      });
      const data = await response.json();
      console.log(data);
      if (data.status) {
        navigate("/dashboard/productos"); // Redirigir a la lista de productos
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(error);
    }
  };
  
  // Cargar categorías y producto cuando se monta el componente
  useEffect(() => {
    if (categorias.length === 0) { // Solo cargar si no se han cargado antes
      cargarCategorias();
    }
    if (uuid) {
      cargarProducto();
    } else {
      // Verificar si las categorías están cargadas
      if (categorias.length > 0) {
        setProducto({ ...producto, categoria_uuid: categorias[0].uuid, cantidad: 1 });
      }
      setLoading(false);
    }
  }, [uuid, categorias]);


  useEffect(() => {
    // Cuando el producto cambia, aseguramos que la categoría también lo haga
    if (producto.categoria_uuid && categorias.length > 0) {
      setProducto((prevProducto) => ({
        ...prevProducto,
        categoria_uuid: producto.categoria_uuid,
      }));
    }
  }, [producto.categoria_uuid, categorias]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Suponiendo que envíes la imagen como un string base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProducto({ ...producto, imagen: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex w-full flex-col items-center bg-gray-900 p-8 text-white">
      <h1 className="text-3xl font-bold">{uuid ? "Editar Producto" : "Crear Producto"}</h1>

      {loading ? (
        <div className="flex w-full flex-col items-center justify-center p-10">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-center text-lg font-semibold text-red-500">{error}</p>
      ) : (
        <form onSubmit={guardarProducto} className="mt-6 w-full max-w-lg space-y-4">
          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold">Categoría</label>
            <select
              name="categoria_uuid"
              value={producto.categoria_uuid}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white transition duration-300 ease-in-out hover:scale-105"
              required
            >
              {categorias.map((categoria) => (
                <option key={categoria.uuid} value={categoria.uuid}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={producto.nombre}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold">Descripción</label>
            <textarea
              name="descripcion"
              value={producto.descripcion}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white"
              required
            />
          </div>

            {/* Precio */}
            <div>
                <label className="block text-sm font-semibold">Precio Unitario</label>
                <input
                type="number"
                name="precio_unitario"
                value={producto.precio_unitario}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white"
                required
                />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold">Precio</label>
            <input
              type="number"
              name="precio"
              value={producto.precio}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white"
              required
            />
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-sm font-semibold">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={producto.cantidad}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white"
              required
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white"
            />
            {producto.imagen && <img src={producto.imagen} alt="Imagen del producto" className="mt-4 size-32 object-cover" />}
          </div>

          {/* No disponible */}
            <div className="flex items-center space-x-2">
            <label className="inline-flex items-center text-sm font-semibold">
                <span className="mr-2">No disponible</span>
                <div className="relative">
                <input
                    type="checkbox"
                    name="no_disponible"
                    checked={producto.no_disponible}
                    onChange={(e) => setProducto({ ...producto, no_disponible: e.target.checked })}
                    className="sr-only"
                />
                <div
                    className={`h-6 w-12 rounded-full transition-all duration-300 ${producto.no_disponible ? 'bg-red-500' : 'bg-gray-400'}`}
                >
                    <div
                    className={`size-6 rounded-full bg-white transition-transform duration-300 ${producto.no_disponible ? 'translate-x-6' : ''}`}
                    />
                </div>
                </div>
            </label>
            </div>


          {/* Botones */}
          <div className="mt-6 flex justify-between">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              {uuid ? "Guardar Cambios" : "Crear Producto"}
            </button>
            <Link
              to="/dashboard/productos"
              className="rounded-lg bg-gray-600 px-6 py-3 text-white hover:bg-gray-700"
            >
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductoForm;
