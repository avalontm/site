import React, { useState } from 'react';
import config from '../config'; // Asegúrate de importar el archivo de configuración

const Perfil: React.FC = () => {
  const [nombre, setNombre] = useState('Juan Pérez');
  const [email] = useState('juan.perez@email.com'); // No editable
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefono, setTelefono] = useState('123-456-7890');
  const [genero, setGenero] = useState('Masculino');
  const [foto, setFoto] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar si el formulario está siendo enviado
  
  const fotoPorDefecto = '/assets/perfil_default.png';

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) setFoto(e.target.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleActualizar = async () => {
    if (password && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError('');

    const datosUsuario = {
      nombre,
      telefono,
      genero,
      password: password || undefined, // No enviar si está vacío
      foto: foto || undefined, // Enviar solo si hay una imagen
    };

    setIsSubmitting(true); // Iniciar el estado de espera al enviar

    try {
      const response = await fetch(`${config.apiUrl}/user/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosUsuario),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los datos');
      }
      alert('Datos actualizados correctamente');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false); // Finalizar el estado de espera
    }
  };

  // Spinner de carga ajustado
const renderSpinner = () => (
  <div role="status" className="flex items-center justify-center">
    <svg
      aria-hidden="true"
      className="size-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);

  return (
    <>
    <div className="mx-auto max-w-screen-sm p-4">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Mi perfil</h1>
      <div className="mt-4 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
        <h2 className="text-lg text-gray-700 dark:text-gray-300">Información del usuario</h2>
        <div className="mt-2 space-y-4">
          <div className="flex items-center space-x-4">
            <img src={foto || fotoPorDefecto} alt="Foto de perfil" className="size-20 rounded-full object-cover" />
            <input type="file" accept="image/*" onChange={handleFotoChange} className="text-gray-600 dark:text-gray-400" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" value={email} disabled className="w-full rounded-md border bg-gray-200 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Confirmar Contraseña</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Teléfono</label>
            <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Género</label>
            <select value={genero} onChange={(e) => setGenero(e.target.value)} className="w-full rounded-md border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        <button onClick={handleActualizar} disabled={isSubmitting} className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          {isSubmitting ? renderSpinner() : 'Actualizar datos'}
        </button>
      </div>
    </div>
    </>
  );
};

export default Perfil;
