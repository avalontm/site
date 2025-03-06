import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const Configuracion = () => {
  const [config, setConfig] = useState({
    nombre: "",
    direccion: "",
    logo: "",
    email: "",
    numero: "",
    codigoPostal: "",
    ciudad: "",
    puntos: 0,
    impuesto: 0,
    mantenimiento: false,
  });

  useEffect(() => {
    // Cargar la configuración actual del sitio desde una API o almacenamiento
    const fetchConfig = async () => {
      // Aquí iría la lógica para cargar los datos, por ejemplo desde una API
      const response = await fetch("/api/configuracion");
      const data = await response.json();
      setConfig(data);
    };

    fetchConfig();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Enviar los datos al backend para actualizar la configuración
    const response = await fetch("/api/configuracion", {
      method: "POST",
      body: JSON.stringify(config),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Configuración actualizada con éxito");
    } else {
      alert("Hubo un error al actualizar la configuración");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-6">
      <Helmet>
        <title>Configuración del Sitio</title>
      </Helmet>
      <h1 className="text-4xl font-semibold text-blue-900">Configuración del Sitio</h1>

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
            onChange={(e) => setConfig({ ...config, logo: e.target.files[0] })}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
          />
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
            name="numero"
            value={config.numero}
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
            name="codigoPostal"
            value={config.codigoPostal}
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

        {/* Puntos por compra */}
        <div>
          <label className="block text-sm font-semibold">Puntos por Compra</label>
          <input
            type="number"
            name="puntos"
            value={config.puntos}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            required
          />
        </div>

        {/* Impuesto */}
        <div>
          <label className="block text-sm font-semibold">Impuesto</label>
          <input
            type="number"
            name="impuesto"
            value={config.impuesto}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white px-4 py-3 text-gray-700 shadow-md"
            required
          />
        </div>

        {/* Mantenimiento */}
        <div className="flex items-center space-x-2">
          <label className="inline-flex items-center text-sm font-semibold">
            <span className="mr-2">Mantenimiento</span>
            <input
              type="checkbox"
              name="mantenimiento"
              checked={config.mantenimiento}
              onChange={handleInputChange}
              className="form-checkbox"
            />
          </label>
        </div>

        {/* Botón de guardar */}
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-950"
          >
            Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  );
};

export default Configuracion;
