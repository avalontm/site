import { useState, useEffect, useRef } from "react";
import { Product } from "../interfaces/Product";
import { Category } from "../interfaces/Category";
import { User } from "../interfaces/User";
import config from "../config";
import { toast } from "react-toastify";
import MiniLoading from "../components/MiniLoading";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { PrinterButton } from '../components/PrinterButton';
import { Any } from "@react-spring/web";

interface CartItem extends Product {
  cantidad: number;
}

export default function POSPanel() {
  const { uuid }: { uuid?: string } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // Estado para las categorías
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [currentPage, setCurrentPage] = useState(1);
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
  const [isSelling, setIsSelling] = useState(false);
  const [scale, setScale] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true); // Estado de carga de productos
  const defaultImage = "/assets/default-product.png";
  const [cargando, setCargando] = useState<boolean>(true);
  const [orden, setOrden] = useState<any>(null);  // Estado para la orden

  let debounceTimer: NodeJS.Timeout;

  useEffect(() => {
    // Agregar una clase para ocultar el layout
    document.body.classList.add("no-layout");

    return () => {
      // Restaurar el layout al salir de la página
      document.body.classList.remove("no-layout");
    };
  }, []);

  useEffect(() => {
    const fetchOrden = async () => {
      if (!uuid) {
        setCargando(false);
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        setCargando(false);
        return;
      }

      setCargando(true);

      try {
        const respuesta = await fetch(`${config.apiUrl}/orden/panel/${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!respuesta.ok) {
          toast.error("Error al obtener la orden.");
        }

        const data = await respuesta.json();
        console.log(JSON.stringify(data));
        if (!data.status) {
          toast.error(data.message || "Error desconocido.");
        }

        //registramos la orden en la venta
        const orden = data.orden;

        if(orden.venta_uuid)
        {
          toast.warning("Esta orden ya ha sido marcada como vendida.");
          return;
        }
        
        setOrden(orden);

        // Actualizar carrito con los productos de la orden
        const productosCarrito = orden.productos.map((producto: any) => ({
          uuid: producto.uuid,
          nombre: producto.nombre,
          cantidad: producto.cantidad,
          precio: producto.precio,
          imagen: producto.imagen || defaultImage,
        }));
        setCart(productosCarrito);

        // Actualizar cliente seleccionado (simulación con ID)
        setSelectedClient({
          uuid: orden.cliente_uuid,
          nombre: orden.cliente_nombre,
          puntos: orden.cliente_puntos,
        });
        
      } catch (error) {
        toast.error(error.message || "Hubo un problema al cargar la orden.");
      } finally {
        setCargando(false);
      }
    };

    fetchOrden();  // Llamar a la función para cargar la orden
  }, [uuid]);  // Dependencia de uuid para volver a llamar cuando cambie

  // Función para confirmar la venta como pendiente
  const confirmSaleAsPending = () => {
    setIsModalOpen(false);
    continueSell();
  };

  // Función para cancelar la venta
  const cancelSale = () => {
    setIsModalOpen(false);
  };

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
        const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No se encontró el token de autenticación.");
        return;
      }
      setCargando(true);
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
      }finally
      {
        setCargando(false);
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

      setCargando(true);

      try {
        setIsLoadingProducts(true);
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
      }finally
      {
        setIsLoadingProducts(false);
        setCargando(false);
      }
    };
  
    fetchProducts();
  }, [selectedCategory, productSearch, page]);  // Se ejecutará cuando cambie categoría, búsqueda o página
  
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.uuid === product.uuid);
  
      if (existingItem) {
        // Si el producto ya está en el carrito, aumentamos la cantidad y descontamos del inventario
        const updatedProducts = products.map((prod) =>
          prod.uuid === product.uuid && prod.cantidad > 0
            ? { ...prod, cantidad: prod.cantidad - 1 } // Descontar del inventario
            : prod
        );
  
        setProducts(updatedProducts); // Actualiza el inventario
  
        return prevCart.map((item) =>
          item.uuid === product.uuid
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si es la primera vez que se agrega, verificamos si hay suficiente inventario
        const productInStock = products.find((prod) => prod.uuid === product.uuid);
  
        if (productInStock && productInStock.cantidad > 0) {
          // Descontamos una unidad del inventario
          const updatedProducts = products.map((prod) =>
            prod.uuid === product.uuid
              ? { ...prod, cantidad: prod.cantidad - 1 }
              : prod
          );
  
          setProducts(updatedProducts); // Actualiza el inventario
  
          // Agrega el producto al carrito con una cantidad de 1
          return [...prevCart, { ...product, cantidad: 1 }];
        } else {
          // Si no hay inventario disponible, no se puede agregar el producto
          console.log('No hay suficiente inventario para este producto');
          return prevCart;
        }
      }
    });
  };
  
  const removeFromCart = (uuid: string) => {
    // Encuentra el producto que se va a eliminar del carrito
    const itemToRemove = cart.find(item => item.uuid === uuid);
  
    if (itemToRemove) {
      // Regresa las unidades al inventario
      const updatedProducts = products.map((product) =>
        product.uuid === uuid
          ? { ...product, cantidad: product.cantidad + itemToRemove.cantidad }
          : product
      );
      
      setProducts(updatedProducts); // Actualiza el inventario
  
      // Elimina el artículo del carrito
      setCart((prevCart) => prevCart.filter((item) => item.uuid !== uuid));
    }
  };
  
  {/* REALIZAR VENTA */}
  const handleSell = async () => {
    if (cart.length === 0) {
      toast.info("Por favor, añada productos al carrito antes de continuar.");
      return;
    }
    
    if (!amountPaid) {
      toast.info("Por favor, especifique el pago antes de continuar.");
      return;
    }


  if (paymentMethod === "efectivo" && Number(amountPaid) + pointsUsed < total) {
    // Mostrar modal de confirmación
    setIsModalOpen(true);
    return;
  }

    continueSell();
};

const continueSell = async() => {
  setIsSelling(true); // Iniciar loading
  const totalWithPoints = total - pointsUsed;

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("No se encontró el token de autenticación.");
      setIsSelling(false);
      return;
    }

    const response = await fetch(`${config.apiUrl}/venta/crear`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente: selectedClient ? selectedClient.uuid : null,
        productos: cart,
        total: totalWithPoints,
        metodo_pago: paymentMethod,
        monto_pagado: amountPaid,
        puntos_usados: pointsUsed,
        orden_uuid: orden ? orden.uuid : null,  // Verificación de si orden no es null
      }),
    });

    console.log(JSON.stringify({
      cliente: selectedClient ? selectedClient.uuid : null,
      productos: cart,
      total: totalWithPoints,
      metodo_pago: paymentMethod,
      monto_pagado: amountPaid,
      puntos_usados: pointsUsed,
      orden_uuid: orden ? orden.uuid : null,  // Verificación de si orden no es null
    }));

    const data = await response.json();

    // Verificar que el status sea True antes de continuar
    if (!response.ok || !data.status) {
      toast.error(data.message || "Error al procesar la venta");
      setIsSelling(false);
      return;
    }

    toast.success(`Venta realizada para ${selectedClient ? `${selectedClient.nombre} ${selectedClient.apellido}` : "Público en General"}`);

    if(!data.print)
    {
      printTicket(data.print);
    }

    // Limpiar el estado después de la venta
    setCart([]);
    setSelectedClient(null);
    setAmountPaid("");
    setPointsUsed(0);
    history.pushState(null, "", "/dashboard/pos");
  } catch (error) {
    toast.error(error.message || "Ocurrió un error inesperado");
  } finally {
    setIsSelling(false); // Finalizar loading
  }
};

const printTicket = async (printData: any)  => {

  const printer = localStorage.getItem("selectedPrinter");
  if (!printer) {
    toast.warning("Selecciona una impresora para imprimir.");
    return;
  }

  const apiBaseUrl = localStorage.getItem("apiPrinter");
  if (!apiBaseUrl) {
    toast.error("Por favor, ingresa la URL base de la API.");
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/print`, {
      method: "POST",
      body: JSON.stringify(printData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();
    if (responseJson.Success) {
      toast.success(responseJson.Message);
    } else {
      toast.error(responseJson.Message);
    }
  } catch (error) {
    toast.error(`Error al imprimir: ${error}`);
  }
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

  const updateQuantity = (uuid: string, newQuantity: number) => {
    if (newQuantity < 1) return; // Evitar cantidades negativas
  
    // Obtener el producto que se está modificando
    const updatedCart = cart.map((item) =>
      item.uuid === uuid ? { ...item, cantidad: newQuantity } : item
    );
    
    setCart(updatedCart); // Actualiza el carrito con la nueva cantidad
  
    // Actualizar el inventario de productos
    const updatedProducts = products.map((product) => {
      const cartItem = cart.find(item => item.uuid === uuid);
      if (cartItem) {
        if (newQuantity > cartItem.cantidad) {
          // Si la cantidad aumentó, descontamos la cantidad de productos disponibles
          return product.uuid === uuid
            ? { ...product, cantidad: product.cantidad - (newQuantity - cartItem.cantidad) }
            : product;
        } else if (newQuantity < cartItem.cantidad) {
          // Si la cantidad disminuyó, sumamos la cantidad de productos disponibles
          return product.uuid === uuid
            ? { ...product, cantidad: product.cantidad + (cartItem.cantidad - newQuantity) }
            : product;
        }
      }
      return product;
    });
  
    setProducts(updatedProducts); // Actualiza el inventario de productos
  };

   // Funciones para cambiar de página
   const goToNextPage = () => {
     if (page < totalPages) {
       setCurrentPage(page + 1);
     }
   };
 
   const goToPreviousPage = () => {
     if (page > 1) {
       setCurrentPage(page - 1);
     }
   };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden"); // Restaurar al salir
    };
  }, []);

  useEffect(() => {
    const actualizarEscala = () => {
      const alturaDisponible = window.innerHeight; // Altura del viewport
      const alturaReal = contentRef.current?.scrollHeight || 1; // Altura del contenido

      // Calculamos la escala solo para la altura
      const nuevaEscala = alturaDisponible / alturaReal;

      // Establecemos la nueva escala solo para el alto
      setScale(nuevaEscala-0.025);
    };

    // Inicializar el ajuste de escala al cargar
    actualizarEscala();

    // Detectar cambios en el tamaño de la ventana
    window.addEventListener("resize", actualizarEscala);

    return () => {
      window.removeEventListener("resize", actualizarEscala);
    };
  }, []); // La dependencia vacía asegura que se ejecute solo una vez al montar

  return (
    <div
      ref={contentRef}
      style={{
        transform: `scaleY(${scale})`,
        transformOrigin: "top",
        height: "100%", // Ajustar altura según la escala
        width: "100%",  // Ajustar ancho según la escala
        overflow: "hidden", // Evitar desbordes no deseados
      }}
    >
    <Helmet>
        <title>Punto de venta</title>
    </Helmet>
    <div className="mx-auto flex flex-col rounded-lg bg-gray-50 p-0 shadow-lg md:flex-row">
      <div className="w-full rounded-lg border bg-white p-2 shadow-md md:mb-0 md:w-2/3">
        <h1 className="mb-5 text-center text-3xl font-bold text-gray-800">Punto de Venta</h1>

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

      {/* Listado de productos */}
        <div className="flex max-h-[835px] min-h-[835px] items-center justify-center rounded-lg bg-white shadow-lg">
          {isLoadingProducts ? (
            <Loading /> // Mostrar componente de carga mientras se obtienen los productos
          ) : products.length === 0 ? (
            // Mostrar mensaje si no hay productos
            <span className="text-xl font-bold text-gray-600">No hay productos</span>
          ) : (
            <ul className="mt-2 max-h-[835px] min-h-[835px] w-full space-y-1 overflow-y-auto">
              {products.map((producto) => (
                <li key={producto.uuid} className="w-full">
                  <button
                    className="flex w-full items-center border-b bg-white p-4 pb-6 text-left transition hover:bg-gray-100"
                    onClick={() => addToCart(producto)}
                  >
                    {/* Imagen del producto */}
                    <img
                      src={producto.imagen || defaultImage}
                      alt={producto.nombre}
                      className="mx-4 size-32 rounded-md object-cover"
                      onError={(e) => (e.currentTarget.src = defaultImage)}
                    />

                    {/* Información del producto */}
                    <div className="flex-1">
                      <span className="block text-lg font-bold">{producto.nombre}</span>

                      {/* Cantidad */}
                      <div className="mt-2 flex w-full max-w-[480px] sm:max-w-screen-sm lg:max-w-screen-2xl">
                        <label className="mr-5 py-1">Unidades:</label>
                        {producto.cantidad <= 0 ? (
                          <span className="w-full max-w-[80px] py-1 text-left font-bold text-red-600">
                            Agotado
                          </span>
                        ) : (
                          <label className="w-full max-w-[28px] py-1 text-left font-bold text-gray-600">
                            {producto.cantidad}
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Precio a la derecha */}
                    <span className="min-w-[80px] text-right text-lg font-bold text-red-600">
                      ${producto.precio.toFixed(2)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Paginación */}
        <div className="mt-4 flex w-full items-center justify-between text-center">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex-1 rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Anterior
          </button>

          <span className="mx-4 text-lg font-semibold">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex-1 rounded-lg bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Siguiente
          </button>
        </div>

      </div>

      <div className="my-2 border-t border-gray-300 md:hidden"></div>

      {/* Carrito a la derecha */}
      <div className="w-full rounded-lg border bg-white p-2 shadow-md md:w-1/3">
        <h2 className="mb-3 text-xl font-bold text-gray-800">Carrito</h2>

        <div className="mb-4 mt-2 max-h-[300px] min-h-[300px] space-y-1 overflow-y-auto rounded-lg bg-gray-100 p-4 shadow-md">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.uuid} className="grid grid-cols-[1fr_32px_40px_auto] items-center gap-4 border-b p-0">
                
                {/* Nombre y cantidad del producto */}
                <span className="truncate font-medium text-gray-700">
                  <span className="font-bold">x{item.cantidad}</span> {item.nombre}
                </span>
                
                {/* Botones de incrementar y decrementar unidades en vertical */}
                <div className="m-0 flex flex-col items-center gap-0 p-0">
                  {/* Botón para incrementar */}
                  <button
                    className="mt-1 flex size-10 items-center justify-center rounded-t-full bg-white p-0 text-gray-600 hover:text-gray-800"
                    onClick={() => updateQuantity(item.uuid, item.cantidad + 1)}
                  >
                    <FaPlus className="size-4" /> {/* Ícono de + */}
                  </button>

                  {/* Botón para decrementar */}
                  <button
                    className="mb-1 flex size-10 items-center justify-center rounded-b-full bg-white p-0 text-gray-600 hover:text-gray-800"
                    onClick={() => updateQuantity(item.uuid, item.cantidad - 1)}
                    disabled={item.cantidad <= 1} // Deshabilitar si la cantidad es 1 o menor
                  >
                    <FaMinus className="size-4" /> {/* Ícono de - */}
                  </button>
                </div>

                {/* Precio alineado a la derecha */}
                <span className="whitespace-nowrap text-right font-medium text-red-500">
                  ${item.precio * item.cantidad}
                </span>

                {/* Botón de eliminar */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeFromCart(item.uuid)}
                >
                  <Trash2 className="size-5" /> {/* Ícono de basurero */}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">El carrito está vacío</p>
          )}
        </div>


        {/* Total */}
        <div className="mt-4 flex justify-between">
          <span className="font-bold text-gray-800">Total</span>
          <span className="text-[24px] font-bold text-red-500">${total}</span>
        </div>

       {/* Cliente */}
        <h2 className="mb-3 text-xl font-bold text-gray-800">Cliente</h2>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Escribir nombre del cliente..."
            value={clientSearch}
            onChange={handleClientSearch}
            className="w-full rounded-lg border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {isLoadingClients && (
            <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center">
              <MiniLoading />
            </div>
          )}

          {filteredClients.length > 0 && (
            <ul className="absolute inset-x-0 z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border bg-white shadow-lg">
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

        <div className="mb-6 min-h-[250px]">
          <h3 className="text-lg font-semibold">Cliente Actual:</h3>
          <div className="rounded-lg bg-gray-200 p-3 shadow-md">
            {selectedClient ? (
              <p>{selectedClient.nombre} {selectedClient.apellido}</p>
            ) : (
              <p>Publico en General</p>
            )}
          </div>
       

          {/* Mostrar puntos del cliente */}
          {selectedClient && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Puntos Disponibles</h3>
              <div className="rounded-lg bg-green-100 p-3">
                <p className="text-xl font-bold text-green-600">{selectedClient.puntos} puntos</p>
                <p className="text-sm text-gray-600">Puedes usar estos puntos para reducir el total de la venta.</p>
              </div>

            {selectedClient.puntos > 0 && (
              <input
              type="number"
              value={pointsUsed}
              onChange={(e) => setPointsUsed(Number(e.target.value))}
              max={selectedClient.puntos}
              className="mt-2 w-full rounded-lg border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Usar puntos para pagar"
              />
            )}
            </div>
          )}
       </div>

        {/* Método de pago */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Método de pago</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setPaymentMethod("efectivo")}
              className={`w-full rounded-lg px-6 py-2 text-white ${
                paymentMethod === "efectivo" ? "bg-black" : "bg-gray-300"
              }`}
            >
              Efectivo
            </button>
            <button
              onClick={() => setPaymentMethod("tarjeta")}
              className={`w-full rounded-lg px-6 py-2  text-white ${
                paymentMethod === "tarjeta" ? "bg-black" : "bg-gray-300"
              }`}
            >
              Tarjeta
            </button>
          </div>
        </div>

        {/* Monto pagado */}
        <div className="mb-5">
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
        <div className="mb-0">
        <button
            onClick={removeClient}
            className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition-colors hover:bg-red-700"
          >
            Quitar Cliente
          </button>

          <button
            onClick={handleSell}
            className="mt-5 min-h-[80px] w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
              {isSelling ? <MiniLoading /> : "Realizar Venta"}
          </button>
        </div>
      </div>
    </div>
    
      {/* Modal de confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-10 transition-opacity duration-300">
          <div className="w-96 scale-100 rounded-lg bg-white p-8 opacity-100 shadow-lg transition-all duration-300 ease-out">
            <h2 className="text-2xl font-semibold text-gray-800">La cantidad no es suficiente</h2>
            <p className="mt-4 text-gray-600">¿Deseas realizar la venta como pendiente?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={confirmSaleAsPending}
                className="rounded-full bg-green-500 px-6 py-2 text-white shadow-md transition-colors hover:bg-green-600"
              >
                Sí, hacer pendiente
              </button>
              <button
                onClick={cancelSale}
                className="rounded-full bg-red-500 px-6 py-2 text-white shadow-md transition-colors hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
