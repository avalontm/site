import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Product } from "../interfaces/Product";
import config from "../config";
import Loading from "../components/Loading";
import { Category } from "../interfaces/Category";
import { Investor } from "../interfaces/Investor";
import EditorHtml from "../components/EditorHtml";

const ProductoForm = () => {
  const { uuid } = useParams<string>(); // Obtener el uuid de los parámetros de la URL (si existe)
  const navigate = useNavigate(); // Para redirigir después de guardar el producto
  const [producto, setProducto] = useState<Product>(new Product());
  
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [inversionistas, setInversionista] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded]  = useState(false);
  
  // Función para hacer una pausa (sleep) de X milisegundos
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Función para cargar las categorías
  const cargarCategorias = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No se encontró el token de autenticación.");
      return;
    }
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
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

    // Función para cargar los inversionistas
    const cargarInversionistas = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No se encontró el token de autenticación.");
        return;
      }
      try {
        const response = await fetch(`${config.apiUrl}/inversionista/listar`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setInversionista(data);
      } catch (error) {
        console.error("Error al cargar inversinistas:", error);
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
      const response = await fetch(`${config.apiUrl}/producto/panel/${uuid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProducto(data); 
      
    } catch (error) {
      setError("Error al cargar el producto.");
    }finally
    {
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
    ? `${config.apiUrl}/producto/panel/${uuid}` // Si existe un uuid no vacío ni undefined, estamos editando
    : `${config.apiUrl}/producto/panel/crear`; // Si no existe un uuid o está vacío, estamos creando

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
  const loadData = async () => {
    if (!loaded) {
      setLoaded(true);
      setLoading(true); // Inicia el loading

      try {
        // Cargar categorías e inversionistas de manera secuencial
        if (categorias.length === 0) {
          await cargarCategorias();
        }

        if (inversionistas.length === 0) {
          await cargarInversionistas();
        }

        // Si hay un uuid, cargar el producto
        if (uuid) {
          await cargarProducto();
        }

      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false); // Termina el loading
      }

    }
  };

  loadData();
}, [uuid, categorias, inversionistas, loaded]);  // Asegúrate de incluir 'loaded' para evitar llamadas innecesarias


  useEffect(() => {
    console.log("categorias: " + categorias.length);
    // Cuando el producto cambia, aseguramos que la categoría también lo haga
    if (categorias.length > 0) {
      setProducto((prevProducto) => ({
        ...prevProducto,
        categoria_uuid: producto.categoria_uuid,
      }));
    }
  }, [producto.categoria_uuid, categorias]);

  useEffect(() => {
    console.log("inversionistas: " + inversionistas.length);
    // Cuando el producto cambia, aseguramos que el inversionista también lo haga
    if ( inversionistas.length > 0) {
      setProducto({
        ...producto,
        categoria_uuid: categorias[0].uuid,
        inversionista_uuid: inversionistas[0].uuid,
        cantidad: 1,
      });
    }

  }, [producto.inversionista_uuid, inversionistas]);

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
          
           {/* SKU */}
           <div>
            <label className="block text-sm font-semibold">SKU</label>
            <input
              type="text"
              name="sku"
              value={producto.sku}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white"
              required
            />
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
            <EditorHtml name="descripcion" value={producto.descripcion} onChange={handleInputChange} />
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


          {/* Inversionistas */}
          <div>
            <label className="block text-sm font-semibold">Inversionista</label>
            <select
              name="inversionista_uuid"
              value={producto.inversionista_uuid}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-gray-700 px-4 py-3 text-white transition duration-300 ease-in-out hover:scale-105"
              required
            >
              {inversionistas.map((inversionista) => (
                <option key={inversionista.uuid} value={inversionista.uuid}>
                  {inversionista.nombre}
                </option>
              ))}
            </select>
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
