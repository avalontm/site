import React, { useState, useEffect, useRef } from 'react';
import { DarkThemeToggle } from "flowbite-react";
import { useAuth } from '../AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { FaCaretDown } from 'react-icons/fa';
import ModalLogin from './ModalLogin';
import ModalRegistro from './ModalRegistro';
import config from "../config";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user, role } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const [tooltipVisible, setTooltipVisible] = useState<{ [key: string]: boolean }>({
    inicio: false,
    catalogo: false,
    nosotros: false,
  });
  const tooltipTimeout = useRef<{ [key: string]: NodeJS.Timeout | null }>({ productos: null, nosotros: null });

  const handleMouseEnter = (tooltip: string) => {
    tooltipTimeout.current[tooltip] = setTimeout(() => {
      setTooltipVisible(prev => ({ ...prev, [tooltip]: true }));
    }, 100);
  };

  const handleMouseLeave = (tooltip: string) => {
    if (tooltipTimeout.current[tooltip]) {
      clearTimeout(tooltipTimeout.current[tooltip]!);
    }
    setTooltipVisible(prev => ({ ...prev, [tooltip]: false }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-nav sticky top-0 z-50 w-full">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between p-4">
          {/* Logo */}
          <div className="mx-auto flex">
            <img src="/assets/logo.jpg" className="h-8" alt={config.title} />
          </div>
          
          {/* Menú de navegación centrado con ancho dinámico */}
          <div className="mx-10 flex grow justify-center space-x-4">
            <Link
              to="/"
              className={`relative flex flex-1 items-center justify-center text-gray-800 dark:text-white 
              ${location.pathname === "/" ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"} 
              py-2 transition-all duration-300 ease-in-out`}
              onMouseEnter={() => handleMouseEnter('inicio')}
              onMouseLeave={() => handleMouseLeave('inicio')}
            >
              <img src='/assets/svg/inicio.svg' alt="Inicio" />
              {tooltipVisible.inicio && (
                <div className="absolute top-full mt-1 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-100 transition-opacity duration-300">
                  Inicio
                </div>
              )}
            </Link>

            <Link
              to="/productos"
              className={`relative flex flex-1 items-center justify-center text-gray-800 dark:text-white 
              ${location.pathname === "/productos" ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"} 
              py-2 transition-all duration-300 ease-in-out`}
              onMouseEnter={() => handleMouseEnter('catalogo')}
              onMouseLeave={() => handleMouseLeave('catalogo')}
            >
              <img src='/assets/svg/catalogo.svg' alt="Catálogo" />
              {tooltipVisible.catalogo && (
                <div className="absolute top-full mt-1 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-100 transition-opacity duration-300">
                  Catalogo
                </div>
              )}
            </Link>

            <Link
              to="/nosotros"
              className={`relative flex flex-1 items-center justify-center text-gray-800 dark:text-white 
              ${location.pathname === "/nosotros" ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"} 
              py-2 transition-all duration-300 ease-in-out`}
              onMouseEnter={() => handleMouseEnter('nosotros')}
              onMouseLeave={() => handleMouseLeave('nosotros')}
            >
              <img src='/assets/svg/nosotros.svg' alt="Nosotros" />
              {tooltipVisible.nosotros && (
                <div className="absolute top-full mt-1 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-100 transition-opacity duration-300">
                  Nosotros
                </div>
              )}
            </Link>
          </div>

          {/* Botones de autenticación y menú de usuario */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button onClick={() => setIsLoginModalOpen(true)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                  Iniciar sesión
                </button>
                <button onClick={() => setIsRegistroModalOpen(true)} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Registrarme
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="bg-login flex items-center justify-center rounded-full p-2 text-sm 
                  font-medium focus:outline-none focus:ring-4"
                >
                  <img src={user?.avatar || '/assets/perfil_default.png'} alt="Avatar" className="size-10 rounded-full object-cover" />
                  <FaCaretDown className="ml-2 text-sm" />
                </button>

                {isMenuOpen && (
                  <div ref={menuRef} className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-800">
                    <ul>
                      <li>
                        <Link to="/perfil" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          Mi perfil
                        </Link>
                      </li>
                      <li>
                        <Link to="/carrito" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          Mi carrito
                        </Link>
                      </li>
                      {role === 'admin' && (
                        <li>
                          <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                            Panel Administración
                          </Link>
                        </li>
                      )}
                      <li>
                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </nav>

      <ModalLogin isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <ModalRegistro isOpen={isRegistroModalOpen} onClose={() => setIsRegistroModalOpen(false)} />
    </>
  );
};

export default Navbar;
