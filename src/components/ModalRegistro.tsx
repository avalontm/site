import React, { useState, useEffect, useRef } from 'react';
import config from '../config'; // Asegúrate de importar el archivo de configuración
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir

interface ModalRegistroProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalRegistro: React.FC<ModalRegistroProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); 
  const [last_name, setLastName] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar si el formulario está siendo enviado
  
  // Ref para el input de correo electrónico
  const emailInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate(); // Para redirigir después del registro exitoso

   // Limpiar los campos del formulario cuando el modal se cierra
    useEffect(() => {
      if (!isOpen) {
        setName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        setSuccessMessage('');
      }
    }, [isOpen]);

    useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
        const timer = setTimeout(() => {
            // Establecer el foco en el input de correo electrónico cuando el modal se abre
            if (emailInputRef.current) {
            emailInputRef.current.focus();
            }
        }, 10);
      return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setErrorMessage('');
          setSuccessMessage('');
        }, 250); // Tiempo de la animación de salida
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    if (!email || !password || !name) { // Validar que todos los campos estén completos
      setErrorMessage('Por favor ingresa todos los campos');
      return;
    }

    setIsSubmitting(true); // Iniciar el estado de espera al enviar

    const userData = {
      email,
      password,
      name, 
      last_name
    };

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${config.apiUrl}/usuario/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json(); 

      if (response.ok && data.status) {
        console.log('Usuario registrado exitosamente:', data);

        // Guardar el token
        localStorage.setItem('authToken', data.token);

        setSuccessMessage('Te has registrado correctamente.');
        setErrorMessage(''); // Limpiar mensaje de error
        setTimeout(() => {
          onClose(); // Cerrar el modal
          navigate('/'); // Redirigir al inicio
          setEmail('');
          setName('');
          setLastName('');
          setPassword('');
          setConfirmPassword('');
          setSuccessMessage('');
        }, 2000);
      } else {
        setErrorMessage(data.message || 'Error desconocido');
        setSuccessMessage(''); 
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMessage('Hubo un problema de conexión');
      setSuccessMessage('');
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
      {isVisible && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
          <div
            className={`w-96 rounded-lg bg-white p-6 shadow-lg transition-transform transform ${isOpen ? 'scale-100' : 'scale-95'}`}
          >
            <h2 className="mb-4 text-xl font-semibold">Registrarme</h2>
            <form onSubmit={handleSubmit}>
              {successMessage && (
                <div className="mb-4 text-green-500">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="mb-4 text-red-500">{errorMessage}</div>
              )}
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  ref={emailInputRef} // Asignar la referencia al input
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  id="last_name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2 text-white"
                disabled={isSubmitting}
              >
                 {isSubmitting ? renderSpinner() : 'Registrarme'}
              </button>
            </form>
            <button
              className="absolute right-2 top-2 text-gray-500"
              onClick={onClose}
              disabled={isSubmitting}
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalRegistro;
