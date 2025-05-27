import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para obtener el UUID del usuario desde la URL
import config from '../config';
import { User } from '../interfaces/User';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

const UsuarioForm: React.FC = () => {
  const [usuario, setUsuario] = useState<User>({
    uuid: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    avatar: '',
    puntos: 0,
    role: 0
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { uuid } = useParams<{ uuid: string }>(); // Obtener el UUID del usuario desde la URL

  useEffect(() => {
    // Cargar los datos del usuario al inicio
    const fetchUsuario = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return toast.error('No se encontró el token de autenticación.');

      try {
        const response = await fetch(`${config.apiUrl}/usuario/panel/${uuid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          toast.error('Error al cargar los datos del usuario');
          return;
        }
        const data = await response.json();
        setUsuario(data.usuario);
      } catch (err) {
        toast.error('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [uuid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }
  
    const token = localStorage.getItem('authToken');
    if (!token) return toast.error('No se encontró el token de autenticación.');
  
    let avatarBase64 = null;
  
    if (avatarFile) {
      const reader = new FileReader();
      reader.readAsDataURL(avatarFile);
      await new Promise((resolve) => {
        reader.onload = () => {
          avatarBase64 = reader.result;
          resolve(null);
        };
      });
    }
  
    const body = JSON.stringify({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      telefono: usuario.telefono,
      puntos: usuario.puntos,
      contrasena: password || undefined,
      avatar: avatarBase64 || undefined,
      role: usuario.role, 
    });
  
    try {
      const response = await fetch(`${config.apiUrl}/usuario/panel/editar/${uuid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body,
      });
  
      const data = await response.json();
  
      if (!data.status) {
        toast.error(data.message);
        return;
      }
  
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  
  if (loading) return <div className='min-h-screen'><Loading /></div>;

  return (
    <div className="mx-auto min-h-screen w-full max-w-[600px] rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">Editar Usuario</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="apellido" className="block text-sm font-semibold text-gray-700">
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={usuario.apellido}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            disabled
          />
        </div>

        <div className="mb-4">
          <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700">
            Teléfono
          </label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={usuario.telefono || ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="puntos" className="block text-sm font-semibold text-gray-700">
            Puntos
          </label>
          <input
            type="number"
            id="puntos"
            name="puntos"
            value={usuario.puntos}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            min="0"
            required
          />
        </div>

    <div className="mb-4">
      <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
        Rol de Usuario
      </label>
      <select
        id="role"
        name="role"
        value={usuario.role}
        onChange={(e) =>
          setUsuario((prev) => ({ ...prev, role: parseInt(e.target.value) }))
        }
        className="mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value={0}>Usuario Estándar</option>
        <option value={1}>Generar</option>
        <option value={99}>Administrador</option>
      </select>
    </div>

        {/* Subida de Avatar */}
        <div className="mb-4">
          <label htmlFor="avatar" className="block text-sm font-semibold text-gray-700">
            Avatar
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Cambio de Contraseña */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Nueva Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ingrese nueva contraseña"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="mt-1 w-full rounded-md border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Confirme la contraseña"
          />
        </div>

        <div className="mt-6 flex items-center justify-end">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-6 py-2 text-white shadow-md hover:bg-blue-700 focus:outline-none"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;
