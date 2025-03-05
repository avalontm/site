import { useState, useEffect, useRef } from "react";
import { Product } from "../interfaces/Product";
import { Category } from "../interfaces/Category";
import { User } from "../interfaces/User";
import config from "../config";
import { toast } from "react-toastify";

interface CartItem extends Product {
  cantidad: number;
}

export default function POSPanel() {
  const [categories, setCategories] = useState<Category[]>([]); // Estado para las categorías
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [hasMore, setHasMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [clientSearch, setClientSearch] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [filteredClients, setFilteredClients] = useState<User[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("efectivo");
  const [amountPaid, setAmountPaid] = useState<number | string>("");
  const [pointsUsed, setPointsUsed] = useState<number>(0);

  let debounceTimer: NodeJS.Timeout;

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
        const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        return;
      }

      try {
        const response = await fetch(`${config.apiUrl}/categoria/listar`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setCategories(data.map((cat: Category) => cat));
      } catch (error) {
        toast.error("Error al cargar las categorías.");
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

 // Cargar productos desde la API cuando cambie la categoría seleccionada
 useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        return;
      }
  
      try {
        // Llamada a la API con parámetros de página y categoría
        const response = await fetch(`${config.apiUrl}/producto/panel/pagina?page=${page}&categoria=${selectedCategory}&buscar=${productSearch}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          
        // Comprobar si la respuesta fue exitosa
        if (!response.ok) {
          toast.error("No se pudieron cargar los productos.");
          return;
        }
  
        const data = await response.json();
        console.log(data);
  
        // Si hay productos, actualiza el estado
        if (data.productos) {
          setProducts(data.productos);  // Actualiza los productos
          setPage(data.paginaActual);   // Actualiza la página actual
          setTotalPages(data.totalPaginas);  // Establece el total de páginas
        } else {
          toast.error("No se pudieron cargar los productos.");
        }
      } catch (error) {
        toast.error("Error al cargar los productos.");
      }
    };
  
    fetchProducts();
  }, [selectedCategory, productSearch, page]);  // Se ejecutará cuando cambie categoría, búsqueda o página
  
    // Función para manejar la paginación (cargar más productos)
    const loadMoreProducts = () => {
        if (hasMore) {
          setPage((prevPage) => prevPage + 1); // Aumentar la página
        }
      };
    

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.uuid === product.uuid);
      if (existingItem) {
        return prevCart.map((item) =>
          item.uuid === product.uuid
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, cantidad: 1 }];
    });
  };

  const removeFromCart = (uuid: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.uuid !== uuid));
  };

  const handleSell = () => {
    if (cart.length === 0 || !amountPaid) {
      toast.info("Por favor, seleccione un cliente, añada productos al carrito y especifique el pago.");
      return;
    }

    const totalWithPoints = total - pointsUsed;

    if (paymentMethod === "efectivo" && Number(amountPaid) + pointsUsed < total) {
      toast.error("La cantidad pagada no es suficiente.");
      return;
    }

    toast.info(`Venta realizada para ${selectedClient ? `${selectedClient.nombre} ${selectedClient.apellido}` : "Público en General"}`);
    setCart([]); // Limpiar carrito
    setSelectedClient(null); // Reset cliente
    setAmountPaid(""); // Reset pago
    setPointsUsed(0); // Reset puntos usados
  };

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleClientSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setClientSearch(searchTerm);

    clearTimeout(debounceTimer);

    if (searchTerm.length > 2) {
      setIsLoadingClients(true);

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        return;
      }

      debounceTimer = setTimeout(async () => {
        try {
          const response = await fetch(`${config.apiUrl}/usuario/buscar?search=${searchTerm}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          if (data.status) {
            setFilteredClients(data.usuarios);
          } else {
            setFilteredClients([]);
          }
        } catch (error) {
          console.error("Error al obtener clientes:", error);
          setFilteredClients([]);
        } finally {
          setIsLoadingClients(false);
        }
      }, 500);
    } else {
      setFilteredClients([]);
    }
  };

  const selectClient = (client: User) => {
    setClientSearch("");
    setSelectedClient(client);
    setFilteredClients([]); // Cerrar la lista de sugerencias
  };

  const removeClient = () => {
    setSelectedClient(null); // Esto lo dejará en "Público en General"
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-full flex-col rounded-lg bg-gray-50 p-6 shadow-lg md:flex-row">
      <div className="mb-4 w-full rounded-lg border bg-white p-4 shadow-md md:mb-0 md:w-2/3">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Punto de Venta</h1>

        {/* Carrusel de categorías */}
        <div className="mb-4 flex space-x-4 overflow-x-auto p-2">
          {categories.map((category) => (
            <button
              key={category.uuid}
              className={`min-w-[150px] rounded-lg px-6 py-3 text-lg font-semibold transition-colors ${
                selectedCategory === category.uuid
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedCategory(category.uuid)}
            >
              {category.nombre}
            </button>
          ))}
        </div>

        {/* Barra de búsqueda de productos */}
        <div className="mb-6 flex">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="w-full rounded-lg border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Cuadrícula de productos */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.uuid} className="w-full rounded-lg border bg-white p-4 shadow-md transition-transform hover:scale-105">
              <h2 className="text-lg font-semibold text-gray-800">{product.nombre}</h2>
              <p className="text-lg text-gray-600">${product.precio}</p>
              <button
                className="mt-4 w-full rounded-lg bg-green-500 py-2 font-semibold text-white transition-colors hover:bg-green-600"
                onClick={() => addToCart(product)}
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>

      {/* Cargar más productos */}
      {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={loadMoreProducts}
              className="rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-600"
            >
              Cargar más productos
            </button>
          </div>
        )}
      </div>

      <div className="my-4 border-t border-gray-300 md:hidden"></div>

      {/* Carrito a la derecha */}
      <div className="w-full rounded-lg border bg-white p-4 shadow-md md:w-1/3">
        <h2 className="mb-3 text-xl font-bold text-gray-800">Carrito</h2>
        <div className="mb-4 rounded-lg bg-gray-100 p-4 shadow-md">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.uuid} className="flex justify-between border-b p-3">
                <span className="font-medium text-gray-700">{item.nombre} x{item.cantidad}</span>
                <span className="font-medium text-red-500">${item.precio * item.cantidad}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromCart(item.uuid)}
                >
                  Eliminar
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">El carrito está vacío</p>
          )}
        </div>

        {/* Total */}
        <div className="mt-4 flex justify-between">
          <span className="font-bold text-gray-800">Total</span>
          <span className="font-bold text-red-500">${total}</span>
        </div>

        {/* Cliente */}
        <h2 className="mb-3 text-xl font-bold text-gray-800">Cliente</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Escribir nombre del cliente..."
            value={clientSearch}
            onChange={handleClientSearch}
            className="w-full rounded-lg border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {isLoadingClients && <p>Cargando clientes...</p>}
          {filteredClients.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-y-auto rounded-lg border bg-white shadow-lg">
              {filteredClients.map((client) => (
                <li
                  key={client.uuid}
                  onClick={() => selectClient(client)}
                  className="cursor-pointer p-2 hover:bg-blue-100"
                >
                  {client.nombre} {client.apellido}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Cliente Actual:</h3>
          <div className="rounded-lg bg-gray-200 p-3 shadow-md">
            {selectedClient ? (
              <p>{selectedClient.nombre} {selectedClient.apellido}</p>
            ) : (
              <p>Publico en General</p>
            )}
          </div>
        </div>

        {/* Mostrar puntos del cliente */}
        {selectedClient && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Puntos Disponibles</h3>
            <div className="rounded-lg bg-green-100 p-3">
              <p className="text-xl font-bold text-green-600">{selectedClient.puntos} puntos</p>
              <p className="text-sm text-gray-600">Puedes usar estos puntos para reducir el total de la venta.</p>
            </div>
          </div>
        )}

        {/* Método de pago */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Método de pago</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setPaymentMethod("efectivo")}
              className={`rounded-lg px-6 py-2 text-white ${
                paymentMethod === "efectivo" ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              Efectivo
            </button>
            <button
              onClick={() => setPaymentMethod("tarjeta")}
              className={`rounded-lg px-6 py-2 text-white ${
                paymentMethod === "tarjeta" ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              Tarjeta
            </button>
          </div>
        </div>

        {/* Monto pagado */}
        <div className="mb-6">
          <label htmlFor="amountPaid" className="block text-lg font-semibold text-gray-700">Cantidad Pagada</label>
          <input
            id="amountPaid"
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            className="w-full rounded-lg border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Monto pagado"
          />
        </div>

        {/* Finalizar venta */}
        <div className="mb-6">
        <button
            onClick={handleSell}
            className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition-colors hover:bg-red-700"
          >
            Quitar Cliente
          </button>

          <button
            onClick={handleSell}
            className="mt-5 w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            Vender
          </button>
        </div>
      </div>
    </div>
  );
}
