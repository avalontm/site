import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import MiniLoading from "./MiniLoading";

// Configuración de Socket.IO
const socket = io(config.socketUrl, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

const Notificaciones = () => {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [cargando, setCargando] = useState(false);
  const notificacionesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Función para reproducir sonido
  const reproducirSonido = () => {
    const audio = new Audio("/assets/sounds/notificacion.mp3"); // Archivo en public/notificacion.mp3
    audio.play().catch((error) => console.error("Error al reproducir el sonido:", error));
  };

  const fetchNotificaciones = async () => {
    setCargando(true);
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No se encontró el token de autenticación.");
      setCargando(false);
      return;
    }
  
    try {
      const respuesta = await fetch(`${config.apiUrl}/orden/panel/lista?estado=0`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!respuesta.ok) throw new Error("Error al cargar notificaciones.");
  
      const data = await respuesta.json();
      if (data.status && Array.isArray(data.ordenes)) {
        setOrdenes(data.ordenes);
      } else {
        setOrdenes([]);
        console.warn("Respuesta inesperada del servidor:", data);
      }
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    } finally {
      setCargando(false);
    }
  };
  
  useEffect(() => {
    fetchNotificaciones();
  
    // Conectar a Socket.IO
    socket.connect();
  
    socket.on("connect", () => console.log(`Conectado a socket.io: ${socket.id}`));
    socket.on("disconnect", () => console.warn("Socket desconectado"));
    socket.on("connect_error", (err) => console.error("Error de conexión:", err));
  
    // Escuchar evento "nueva_orden"
    socket.on("nueva_orden", (orden) => {
      toast.info(`🛒 Nueva orden creada: #${orden.uuid}`);
      setOrdenes((prevOrdenes) => [orden, ...prevOrdenes]);
      reproducirSonido(); // 🔊 Reproducir sonido al recibir una nueva orden
    });
  
    return () => {
      socket.off("nueva_orden");
      socket.disconnect();
    };
  }, []);  

  // Cerrar la lista al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificacionesRef.current && !notificacionesRef.current.contains(event.target as Node)) {
        setMostrarLista(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirigir al usuario y eliminar la orden de la lista
  const manejarClickOrden = (uuid: string) => {
    setOrdenes((prevOrdenes) => prevOrdenes.filter((orden) => orden.uuid !== uuid));
    navigate(`/dashboard/orden/${uuid}`);
    setMostrarLista(false);
  };

  return (
    <div className="relative" ref={notificacionesRef}>
      {/* Botón de la campana */}
      <button
        className="relative rounded-full bg-gray-200 p-2 hover:bg-gray-300"
        onClick={() => setMostrarLista(!mostrarLista)}
      >
        <Bell className="size-6 text-gray-800" />
        {ordenes.length > 0 && (
          <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {ordenes.length}
          </span>
        )}
      </button>

      {/* Lista desplegable de órdenes */}
      {mostrarLista && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="border-b p-2 font-bold text-gray-800">Órdenes Nuevas</div>
          {cargando ? (
            <div className="flex justify-center p-3"><MiniLoading /></div>
          ) : ordenes.length === 0 ? (
            <div className="p-3 text-gray-500">No hay órdenes nuevas</div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {ordenes.map((orden) => (
                <li
                  key={orden.uuid}
                  className="cursor-pointer border-b p-2 hover:bg-gray-100"
                  onClick={() => manejarClickOrden(orden.uuid)}
                >
                  Orden #{orden.numero_orden}
                </li>
              ))}
            </ul>
          )}
          <button
            className="w-full p-2 text-center text-blue-500 hover:bg-gray-100"
            onClick={fetchNotificaciones}
          >
            Recargar
          </button>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;