import { useEffect, useRef, useState } from "react";
import { Printer } from "lucide-react";
import { toast } from "react-toastify";

export default function PrinterButton() {
  const [printer, setPrinter] = useState<{ name: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(""); // URL base de la API
  const [printersList, setPrintersList] = useState<{ name: string }[]>([]); // Lista de impresoras
  const [dialogOpen, setDialogOpen] = useState(false); // Estado para abrir el modal de selección
  const [defaultPrinter, setDefaultPrinter] = useState<string>(""); // Impresora predeterminada
  const [configApiDialogOpen, setConfigApiDialogOpen] = useState(false); // Estado para abrir el modal de configuración de API
  const printerRef = useRef<HTMLDivElement>(null);

  // Cargar impresora y URL base desde localStorage
  useEffect(() => {
    const savedApiBaseUrl = localStorage.getItem("apiPrinter");
    const defaultApiBaseUrl = savedApiBaseUrl || "http://localhost:8080"; // Valor por defecto
    setApiBaseUrl(defaultApiBaseUrl);

    const savedPrinter = localStorage.getItem("selectedPrinter");
    if (savedPrinter) {
      setPrinter(JSON.parse(savedPrinter));
    } else {
      const defaultPrinter = { name: "POS-80C" };
      setPrinter(defaultPrinter);
      localStorage.setItem("selectedPrinter", JSON.stringify(defaultPrinter));
    }
  }, []);

  // Buscar impresoras desde la API
  const searchPrinter = async () => {
    setMenuOpen(false); // Cerrar el menú al abrir el modal

    if (!apiBaseUrl) {
      toast.error("Por favor, ingresa la URL base de la API.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/printers`);
      const { Printers, Default } = await response.json();

      if (Printers.length > 0) {
        setPrintersList(Printers.map((name: string) => ({ name })));
        setDefaultPrinter(Default); // Guardamos la impresora predeterminada
        setDialogOpen(true); // Abrir el modal con la lista de impresoras
      } else {
        toast.error("No se encontraron impresoras.");
      }
    } catch (error) {
      toast.error(`Error al buscar impresoras: ${error}`);
    }
  };

  // Función para seleccionar una impresora
  const selectPrinter = (printer: { name: string }) => {
    setPrinter(printer);
    localStorage.setItem("selectedPrinter", JSON.stringify(printer)); // Guardar la impresora seleccionada
    setDialogOpen(false); // Cerrar el modal
    toast.info(`Impresora seleccionada: ${printer.name}`);
  };

  // Enviar datos de prueba a la impresora con opciones de formato
  const printTest = async () => {
    setMenuOpen(false); // Cerrar el menú al abrir el modal
    if (!printer) {
      toast.warning("Selecciona una impresora para imprimir.");
      return;
    }

    if (!apiBaseUrl) {
      toast.error("Por favor, ingresa la URL base de la API.");
      return;
    }

    const printData = {
      PrinterName: printer.name,
      data: [
        {
          "image": "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"
        },
        {
          alignment: "center",
          text: "Tecnológico Nacional de México Campus Ensenada",
          bold: true,
          fontsize: "large",
        },
        {
          lines: 3,
        },
        {
          alignment: "left",
          text: "Con la participación de los alumnos de la carrera de Ingeniería en Sistemas Computacionales:",
          fontsize: "normal",
        },
        {
          lines: 3,
        },
        {
          separator: true,
        },
        {
          alignment: "left",
          text: "JAIME RAULMENDEZ LOPEZ",
          fontsize: "normal",
        },
        {
          alignment: "left",
          text: "SCARLETH YOCELETH ARROYO DOMINGUEZ",
          fontsize: "normal",
        },
        {
          alignment: "left",
          text: "SILVIA EUGENIA LEON LOMELI",
          fontsize: "normal",
        },
        {
          alignment: "left",
          text: "ALEJANDRO RENATO LEON LOMELI",
          fontsize: "normal",
        },
        {
          alignment: "left",
          text: "CRISANTO DE JESUS CUEVAS SANCHEZ",
          fontsize: "normal",
        },
        {
          alignment: "left",
          text: "CHRISTOFER ANDRE MIJARES GOMEZ",
          fontsize: "normal",
        },
        {
          separator: true,
        },
        {
          lines: 5,
        },
      ],
    };

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

  // Función para actualizar la URL base de la API
  const updateApiBaseUrl = () => {
    if (!apiBaseUrl) {
      toast.error("La URL base no puede estar vacía.");
      return;
    }

    localStorage.setItem("apiPrinter", apiBaseUrl);
    setConfigApiDialogOpen(false);
    toast.info("URL base de la API actualizada.");
  };

  // Cerrar el menú al hacer clic fuera
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
        onClick={() => setMenuOpen(!menuOpen)} // Toggle del menú
        className="relative rounded-full bg-gray-200 p-2 transition hover:bg-gray-300"
      >
        <Printer className="text-2xl text-gray-800" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-300 bg-white shadow-lg">
          <button
            onClick={searchPrinter}
            className="flex w-full items-center px-4 py-2 hover:bg-gray-100"
          >
            🔍 Buscar impresora
          </button>
          <button
            onClick={printTest}
            disabled={!printer}
            className={`flex w-full items-center px-4 py-2 ${printer ? "hover:bg-gray-100" : "cursor-not-allowed text-gray-400"}`}
          >
            🖨️ Imprimir prueba
          </button>
          <hr/>
          <button
            onClick={() =>  {setMenuOpen(false); setConfigApiDialogOpen(true)}} // Abrir el modal de configuración de API
            className="flex w-full items-center bg-gray-300 px-4 py-2 hover:bg-gray-200"
          >
            ⚙️ Configurar API
          </button>
        </div>
      )}

      {/* Modal de selección de impresoras */}
      {dialogOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-4 shadow-lg">
            <h2 className="mb-4 text-xl">Seleccionar impresora</h2>
            <ul>
              {printersList.map((printer) => (
                <li
                  key={printer.name}
                  onClick={() => selectPrinter(printer)}
                  className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                    printer.name === defaultPrinter ? "font-bold text-blue-600" : ""
                  }`}
                >
                  {printer.name}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setDialogOpen(false)} // Cerrar modal
                className="rounded-lg bg-gray-500 px-4 py-2 text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de configuración de la API */}
      {configApiDialogOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-4 shadow-lg">
            <h2 className="mb-4 text-xl">Configurar servicio de imprecion</h2>
            <input
              type="text"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrl(e.target.value)}
              className="w-full rounded-lg border px-4 py-2"
              placeholder="Ingrese la URL base"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setConfigApiDialogOpen(false)} // Cerrar modal
                className="rounded-lg bg-gray-500 px-4 py-2 text-white"
              >
                Cancelar
              </button>
              <button
                onClick={updateApiBaseUrl}
                className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
