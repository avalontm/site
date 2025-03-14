import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import _config from "../config";
import { toast } from "react-toastify";
import MiniLoading from "../components/MiniLoading";

const Configuracion = () => {
  const [config, setConfig] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    logo: "",
    email: "",
    telefono: "",
    codigo_postal: "",
    ciudad: "",
    puntos: 0,
    total_puntos: 0,
    impuesto: 0,
    mantenimiento: false,
  });
  
  // Estado para mostrar los puntos estimados
  const [puntosEstimados, setPuntosEstimados] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Calcular puntos estimados cuando cambian los valores relevantes
  useEffect(() => {
    // Calcular puntos basado en la configuración actual
    const calcularPuntos = () => {
      // Puntos = (Total de puntos * Puntos por compra) / 100
      const puntos = Math.floor((config.total_puntos * config.puntos) / 100);
      setPuntosEstimados(puntos);
    };
    
    calcularPuntos();
  }, [config.total_puntos, config.puntos]);

  // Obtener el token del localStorage
  const getToken = () => {
    return localStorage.getItem("authToken") || "";
  };

  // Cargar la configuración desde la API
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const token = getToken();
        
        const respuesta = await fetch(`${_config.apiUrl}/site/panel/configuracion`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!respuesta.ok) {
          toast.error("Error al cargar la configuración");
          return;
        }

        const data = await respuesta.json();

        if(!data.status) {
          toast.error(data.message);
          return;
        }

        setConfig(data.config);
      } catch (err) {
        toast.error("No se pudo cargar la configuración. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === "checkbox" ? checked : 
                    type === "number" ? parseFloat(value) : value;
    
    setConfig({
      ...config,
      [name]: newValue,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setConfig({
        ...config,
        logo: e.target.files[0],
      });
    }
  };
  
  // Manejar cambios específicos en el simulador
  const handleTotalPuntosChange = (e) => {
    const valor = parseFloat(e.target.value);
    
    setConfig({
      ...config,
      total_puntos: valor
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const token = getToken();
      
      // Crear un FormData si hay un archivo
      const formData = new FormData();
      
      // Preparar los datos para el envío
      const configData = {
        ...config,
        // Asegurar que los campos numéricos son números
        puntos: parseInt(config.puntos),
        total_puntos: parseInt(config.total_puntos),
        impuesto: parseFloat(config.impuesto),
        // Convertir booleano a valor numérico para el backend
        mantenimiento: config.mantenimiento ? 1 : 0
      };
      
      // Agregar todos los campos al FormData
      Object.keys(configData).forEach(key => {
        if (key === 'logo' && typeof configData.logo === 'object') {
          formData.append('logo', configData.logo);
        } else {
          formData.append(key, configData[key]);
        }
      });

      // Determinar si usar JSON o FormData
      const hasFile = typeof configData.logo === 'object' && configData.logo !== null;
      
      const respuesta = await fetch(`${_config.apiUrl}/site/panel/configuracion/actualizar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(hasFile ? {} : { "Content-Type": "application/json" }),
        },
        body: hasFile ? formData : JSON.stringify(configData),
      });

      if (!respuesta.ok) {
        toast.error("Error al actualizar la configuración");
        return;
      }

      const data = await respuesta.json();

      if(!data.status) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error al actualizar:", err);
      toast.error("No se pudo actualizar la configuración. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && config.nombre === "") {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block size-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-700">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-6">
      <Helmet>
        <title>Configuración del Sitio</title>
      </Helmet>
      <h1 className="text-4xl font-semibold text-blue-900">Configuración del Sitio</h1>

      {error && (
        <div className="mt-4 w-full max-w-xl rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 w-full max-w-xl rounded-lg bg-green-100 p-4 text-green-700">
          Configuración actualizada con éxito
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xl space-y-6">
        {/* Nombre del Sitio */}
        <div>
          <label className="block text-sm font-semibold">Nombre del Sitio</label>
          <input
            type="text"
            name="nombre"
            value={config.nombre}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            required
          />
        </div>
        
        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold">Descripción</label>
          <textarea
            name="descripcion"
            value={config.descripcion}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            rows="3"
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-semibold">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={config.direccion}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            required
          />
        </div>

        {/* Logo */}
        <div>
          <label className="block text-sm font-semibold">Logo</label>
          <input
            type="file"
            accept="image/*"
            name="logo"
            onChange={handleFileChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
          />
          {typeof config.logo === 'string' && config.logo && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Logo actual:</p>
              <img 
                src={config.logo} 
                alt="Logo actual" 
                className="mt-1 h-16 w-auto object-contain"
              />
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={config.email}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            required
          />
        </div>

        {/* Número de Teléfono */}
        <div>
          <label className="block text-sm font-semibold">Número de Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={config.telefono || ''}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            required
          />
        </div>

        {/* Código Postal */}
        <div>
          <label className="block text-sm font-semibold">Código Postal</label>
          <input
            type="text"
            name="codigo_postal"
            value={config.codigo_postal || ''}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            required
          />
        </div>

        {/* Ciudad */}
        <div>
          <label className="block text-sm font-semibold">Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={config.ciudad}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            required
          />
        </div>

        {/* Sección de Puntos y Simulador combinados */}
        <div className="rounded-lg bg-blue-50 p-5 shadow-md">
          <h3 className="mb-3 font-semibold text-blue-900">Configuración de Puntos</h3>
          
          {/* Puntos por compra */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Puntos por compra (por cada 100 unidades)</label>
            <input
              type="number"
              name="puntos"
              value={config.puntos}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
              required
              min="0"
              step="0.01"
            />
          </div>
          
          {/* Total puntos en el sistema */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Cantidad por cada compra</label>
            <input
              type="number"
              name="total_puntos"
              value={config.total_puntos}
              onChange={handleInputChange}
              className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
              required
              min="0"
              step="1"
            />
          </div>
          
          {/* Simulador de puntos */}
          <div className="mt-5 rounded-lg bg-white p-4 shadow-sm">
            <h4 className="mb-2 font-medium text-blue-800">Simulador de Puntos</h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm">Con estos valores configurados:</label>
                <ul className="mt-1 list-inside list-disc text-sm text-gray-600">
                  <li>Puntos por compra: <span className="font-medium">{config.puntos}</span></li>
                  <li>Total de venta: <span className="font-medium">{config.total_puntos}</span></li>
                </ul>
              </div>
              <div>
                <label className="block text-sm">Puntos a generar:</label>
                <div className="mt-2 flex items-center rounded-lg bg-blue-100 px-4 py-3 font-semibold text-blue-700">
                  {puntosEstimados} puntos
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Los puntos se calculan en base a la configuración actual (Puntos = Total de puntos × Puntos por compra ÷ 100).
            </p>
          </div>
        </div>

        {/* Impuesto */}
        <div>
          <label className="block text-sm font-semibold">Impuesto (%)</label>
          <input
            type="number"
            name="impuesto"
            value={config.impuesto}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            required
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        {/* Mantenimiento */}
        <div className="flex items-center space-x-2">
          <label className="inline-flex items-center text-sm font-semibold">
            <span className="mr-2">Modo Mantenimiento</span>
            <input
              type="checkbox"
              name="mantenimiento"
              checked={Boolean(config.mantenimiento)}
              onChange={handleInputChange}
              className="form-checkbox size-5 text-blue-600"
            />
          </label>
        </div>

        {/* Botón de guardar */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? <MiniLoading/> : "Guardar Configuración"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Configuracion;