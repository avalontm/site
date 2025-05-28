import React, { useState, useEffect } from 'react';
import config from '../config';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { Pencil } from 'lucide-react';
import { useAuth } from '../AuthContext';
import MiniLoading from '../components/MiniLoading';
import { Helmet } from 'react-helmet-async';

const Perfil: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [genero, setGenero] = useState('');
  const [puntos, setPuntos] = useState(0);
  const [foto, setFoto] = useState<string | null>(null);
  const [nuevaFoto, setNuevaFoto] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { updateAvatar } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const fotoPorDefecto = '/assets/perfil_default.png';

  const obtenerDatosUsuario = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No se encontró el token de autenticación');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/usuario/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        toast.error('Error al obtener datos del usuario');
        return;
      }

      const data = await response.json();

      setNombre(data.nombre);
      setEmail(data.email);
      setTelefono(data.telefono || '');
      setGenero(data.genero || '');
      setPuntos(data.puntos || 0);
      if (data.avatar) {
        const nuevaRutaFoto = `${config.apiBase}${data.avatar}`;
        setFoto(nuevaRutaFoto);
        updateAvatar(nuevaRutaFoto);
      }

    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNuevaFoto(event.target.files[0]);
      setFoto(URL.createObjectURL(event.target.files[0]));
    }
  };

  const actualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault(); // Evitar recarga de página

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No se encontró el token de autenticación');
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('telefono', telefono);
    formData.append('genero', genero);

    if (nuevaFoto) {
      formData.append('foto', nuevaFoto);
    }

    if (password) {
      formData.append('password', password);
      formData.append('confirm_password', confirmPassword);
      formData.append('current_password', currentPassword);
    }

    try {
      setIsUpdating(true);
      const response = await fetch(`${config.apiUrl}/usuario/actualizar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if(!data.status)
      {
        toast.error(data.message);
        return;
      }
      toast.success('Perfil actualizado correctamente');
      setNuevaFoto(null);
      obtenerDatosUsuario();
      setPassword('');
      setConfirmPassword('');
      setCurrentPassword('');

      if (data.avatar) {
        updateAvatar(data.avatar);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    obtenerDatosUsuario();
  }, []);

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl p-6">
       <Helmet>
          <title>Perfil</title>
       </Helmet>
      <h1 className="text-2xl font-semibold text-gray-900">Mi perfil</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={actualizarPerfil} className="mt-4 rounded-md bg-gray-100 p-4">
          <h2 className="text-lg text-gray-700">Información del usuario</h2>

          <div className="mt-2 space-y-4">
            {/* Imagen de perfil con efecto hover */}
            <div className="relative flex flex-col items-center">
              <label htmlFor="foto-input" className="cursor-pointer">
                <div className="relative size-24 overflow-hidden rounded-full">
                  <img className="size-full object-cover transition-opacity duration-300 hover:opacity-70"
                    src={foto || fotoPorDefecto}
                    alt="Foto de perfil"
                    onError={(e) => (e.currentTarget.src = fotoPorDefecto)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <Pencil className="size-6 rounded-full bg-black/50 p-1 text-white" />
                  </div>
                </div>
              </label>
              <input type="file" id="foto-input" accept="image/*" onChange={handleImagenChange} className="hidden" disabled={isUpdating} />
            </div>

            <div>
              <label className="block text-gray-700">Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-md border p-2" disabled={isUpdating}/>
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input type="email" value={email} disabled className="w-full rounded-md border bg-gray-200 p-2" />
            </div>

            <div>
              <label className="block text-gray-700">Teléfono</label>
              <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full rounded-md border p-2" disabled={isUpdating}/>
            </div>

            <div>
              <label className="block text-gray-700">Género</label>
              <select value={genero} onChange={(e) => setGenero(e.target.value)} className="w-full rounded-md border p-2" disabled={isUpdating}>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* Puntos */}
            <div>
              <label className="block text-gray-700">Puntos</label>
              <input type="text" value={puntos} disabled className="w-full rounded-md border bg-gray-200 p-2" />
            </div>

            <div>
              <label className="block text-gray-700">Contraseña Actual</label>
              <input
                type="password"
                value={currentPassword}
                disabled={isUpdating}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700">Nueva Contraseña</label>
              <input
                type="password"
                value={password}
                disabled={isUpdating}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border p-2"
              />
            </div>

            <div>
              <label className="block text-gray-700">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                disabled={isUpdating}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border p-2"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="mt-4 w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900 disabled:opacity-50"
            >
              {isUpdating ? <MiniLoading /> : 'Guardar cambios'}
            </button>

          </div>
        </form>
      )}
    </div>
  );
};

export default Perfil;
