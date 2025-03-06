import { useEffect, useRef, useState } from "react";
import { Printer, Bluetooth } from "lucide-react";
import { toast } from "react-toastify";

export default function PrinterButton() {
  const [printer, setPrinter] = useState<BluetoothDevice | null>(null);
  const [connected, setConnected] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const printerRef = useRef<HTMLDivElement>(null);
  
  // Buscar impresora Bluetooth
  const searchPrinter = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"], // Cambiar según la impresora
      });

      setPrinter(device);
      toast.info("Impresora seleccionada:", device.name);
    } catch (error) {
      toast.error(`Error al buscar impresora: ${error}`);
    }
  };

  // Conectar a la impresora
  const connectPrinter = async () => {
    if (!printer) {
      alert("Selecciona primero una impresora.");
      return;
    }

    try {
      const server = await printer.gatt?.connect();
      toast.info("Conectado a", printer.name);
      setConnected(true);
    } catch (error) {
      toast.error(`Error al conectar a la impresora: ${error}`);
    }
  };

  // Enviar datos a imprimir
  const printTicket = async () => {
    if (!printer || !connected) {
      toast.warning("Conéctate a una impresora antes de imprimir.");
      return;
    }

    try {
      const server = await printer.gatt?.connect();
      const service = await server?.getPrimaryService("battery_service"); // Cambia esto
      const characteristic = await service?.getCharacteristic("battery_level"); // Cambia esto

      const encoder = new TextEncoder();
      const data = encoder.encode("Hola, esto es una prueba de impresión\n");
      await characteristic?.writeValue(data);

      toast.success("Ticket enviado a la impresora.");
    } catch (error) {
      toast.error(`Error al imprimir: ${error}`);
    }
  };

    // Cerrar la lista al hacer clic fuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (printerRef.current && !printerRef.current.contains(event.target as Node)) {
            setMenuOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
  return (
    <div className="relative" ref={printerRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`relative rounded-full bg-gray-200 p-2 transition hover:bg-gray-300 ${
          connected ? "bg-green-500 hover:bg-green-600" : "border border-gray-300 bg-white hover:bg-gray-100"
        }`}
      >
        <Printer className={`text-2xl ${connected ? "text-white" : "text-gray-800"}`} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-300 bg-white shadow-lg">
          <button
            onClick={searchPrinter}
            className="flex w-full items-center px-4 py-2 hover:bg-gray-100"
          >
            <Bluetooth className="mr-2 size-4" />
            Buscar impresora
          </button>
          <button
            onClick={connectPrinter}
            disabled={!printer}
            className={`flex w-full items-center px-4 py-2 ${
              printer ? "hover:bg-gray-100" : "cursor-not-allowed text-gray-400"
            }`}
          >
            🔌 Conectar
          </button>
          <button
            onClick={printTicket}
            disabled={!connected}
            className={`flex w-full items-center px-4 py-2 ${
              connected ? "hover:bg-gray-100" : "cursor-not-allowed text-gray-400"
            }`}
          >
            🖨️ Imprimir prueba
          </button>
        </div>
      )}
    </div>
  );
}
