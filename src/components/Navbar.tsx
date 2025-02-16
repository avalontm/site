import React, { useState, useEffect, useRef } from 'react';
import { DarkThemeToggle } from "flowbite-react";
import { useAuth } from '../AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { FaCaretDown, FaBoxOpen, FaUsers } from 'react-icons/fa';
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

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openRegistroModal = () => setIsRegistroModalOpen(true);
  const closeRegistroModal = () => setIsRegistroModalOpen(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 border-gray-200 bg-gray-100 dark:bg-gray-900">
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/assets/logo.jpg" className="h-8" alt="Flowbite Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">{config.title}</span>
          </Link>

          {/* Menú de navegación centrado */}
          <div className="flex space-x-8">
            <Link
              to="/productos"
              className={`flex items-center space-x-2 text-gray-800 dark:text-white 
              ${location.pathname === "/productos" ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"} 
              py-1 transition-all duration-300 ease-in-out`}
            >
              <FaBoxOpen className="text-lg" />
              <span>Productos</span>
            </Link>
            <Link
              to="/nosotros"
              className={`flex items-center space-x-2 text-gray-800 dark:text-white 
              ${location.pathname === "/nosotros" ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400" : "hover:text-blue-600 dark:hover:text-blue-400"} 
              py-1 transition-all duration-300 ease-in-out`}
            >
              <FaUsers className="text-lg" />
              <span>Nosotros</span>
            </Link>
          </div>

          {/* Botones de autenticación y menú de usuario */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button onClick={openLoginModal} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 md:px-5 md:py-2.5">
                  Iniciar sesión
                </button>
                <button onClick={openRegistroModal} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:px-5 md:py-2.5">
                  Registrarme
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={toggleMenu}
                  className="flex items-center justify-center rounded-full bg-gray-200 p-2 text-sm 
                  font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-400 
                  dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-300"
                >
                  <img src={user?.avatar || '/assets/perfil_default.png'} alt="Avatar" className="size-10 rounded-full object-cover" />
                  <FaCaretDown className="ml-2 text-sm" />
                </button>

                {isMenuOpen && (
                  <div ref={menuRef} className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-800">
                    <ul>
                      <li>
                        <Link to="/perfil" onClick={closeMenu} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          Mi perfil
                        </Link>
                      </li>
                      <li>
                        <Link to="/carrito" onClick={closeMenu} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          Mi carrito
                        </Link>
                      </li>
                      {role === 'admin' && (
                        <li>
                          <Link to="/admin" onClick={closeMenu} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                            Panel Administración
                          </Link>
                        </li>
                      )}
                      <li>
                        <button onClick={() => { logout(); closeMenu(); }} className="block w-full px-4 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                          Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            <DarkThemeToggle />
          </div>
        </div>
      </nav>

      <ModalLogin isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <ModalRegistro isOpen={isRegistroModalOpen} onClose={closeRegistroModal} />
    </>
  );
};

export default Navbar;
