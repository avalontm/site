import React, { useEffect, useState } from "react";
import config from "../config";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import MiniLoading from '../components/MiniLoading';

type CarouselImage = {
  uuid: string;
  imagen: string;
};

const CarouselForm = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [iswaiting, setIsWaiting] = useState(false);
  const token = localStorage.getItem("authToken");

  const fetchImages = async () => {
    if (!token) return toast.error("Token no encontrado");
    console.log(token);
    setLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/imagen/panel/carousel/listar`, {
       headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      });

      const data = await res.json();

      if (!res.ok || !data.status || !Array.isArray(data.data)) {
        throw new Error(data.message || "Error al obtener las imágenes.");
      }

      setImages(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar el carrusel");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.warn("Selecciona una imagen");
    if (!token) return toast.error("Token no encontrado");

    const formData = new FormData();
    formData.append("imagen", selectedFile);
    setIsWaiting(true);
    try {
      const res = await fetch(`${config.apiUrl}/imagen/panel/carousel/agregar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if(!data.status)
      {
        toast.error(data.message || "Error al subir imagen");
        return;
      }

      toast.success("Imagen agregada correctamente");
      setSelectedFile(null);
      fetchImages();
    } catch (err) {
      console.error(err);
      toast.error("Error al subir la imagen");
    }finally
    {
      setIsWaiting(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!token) return toast.error("Token no encontrado");
    if (!confirm("¿Estás seguro de que deseas eliminar esta imagen?")) return;

    try {
      const res = await fetch(`${config.apiUrl}/imagen/panel/carousel/eliminar/${uuid}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
      });

      const data = await res.json();

      if(!data.status)
      {
        toast.error(data.message || "Error al subir imagen");
        return;
      }
      
      toast.success("Imagen eliminada");
      setImages((prev) => prev.filter((img) => img.uuid !== uuid));
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar la imagen");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center rounded-lg bg-gray-50 p-6">
      <Helmet>
        <title>Administrar Carrusel</title>
      </Helmet>

      <h1 className="mb-4 text-2xl font-bold">Administrar Carrusel</h1>

      <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 p-6">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
             {iswaiting ? <MiniLoading /> : 'Subir Imagen'} 
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando imágenes...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.uuid}
              className="relative overflow-hidden rounded border shadow-md"
            >
              <img
                src={img.imagen}
                alt="Imagen del carrusel"
                className="h-48 w-full object-cover"
              />
              <button
                onClick={() => handleDelete(img.uuid)}
                className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselForm;
