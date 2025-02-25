import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { FaCaretDown, FaBars, FaTimes } from 'react-icons/fa';
import ModalLogin from './ModalLogin';
import ModalRegistro from './ModalRegistro';
import config from "../config";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user, role } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

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
      <nav className="bg-nav sticky top-0 z-50 my-0 w-full shadow-md">
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center">
              <Link to="/">
                <img src="/assets/logo.png" className="h-12" alt={config.title} />
              </Link>
          </div>

          {/* Botón menú hamburguesa en móvil */}
          <button
            className="block text-white focus:outline-none  md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Menú de navegación */}
          <div className={`bg-nav absolute left-0 top-16 w-full text-white shadow-lg transition-all duration-300 md:static md:flex md:w-auto md:space-x-4 md:bg-transparent md:shadow-none ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="flex flex-col space-y-2 text-white md:flex-row md:items-center md:space-x-4 md:space-y-0">
              <Link to="/" className={`px-4 py-2 ${location.pathname === "/" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-orange-600"} transition-all duration-300`}>
                Inicio
              </Link>
              <Link to="/productos" className={`px-4 py-2 ${location.pathname === "/productos" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-orange-600"} transition-all duration-300`}>
                Catálogo
              </Link>
              <Link to="/nosotros" className={`px-4 py-2 ${location.pathname === "/nosotros" ? "border-b-2 border-blue-600 text-blue-600" : "hover:text-orange-600"} transition-all duration-300`}>
                Nosotros
              </Link>

              {/* Botones de autenticación en móvil */}
              {!isAuthenticated ? (
                <div className="bg-nav mt-2 flex flex-col space-y-2 p-5 md:hidden">
                  <button onClick={() => setIsLoginModalOpen(true)} className="w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">
                    Conectarme
                  </button>
                  <button onClick={() => setIsRegistroModalOpen(true)} className="w-full rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
                    Registrarme
                  </button>
                </div>
              ) : (
                <div className="relative mt-2 p-5 md:hidden">
                  <button
                    ref={buttonRef}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-login flex w-full items-center justify-center rounded-full p-2 text-sm font-medium"
                  >
                    <img src={user?.avatar || '/assets/perfil_default.png'} alt="Avatar" className="size-10 rounded-full object-cover" />
                    <FaCaretDown className="ml-2 text-sm" />
                  </button>

                  {isMenuOpen && (
                    <div ref={menuRef} className="absolute left-0 mt-2 w-full rounded-md border border-gray-200 bg-white text-black shadow-lg ">
                      <ul>
                        <li>
                          <Link to="/perfil" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100 ">
                            Mi perfil
                          </Link>
                        </li>
                        <li>
                          <Link to="/carrito" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100 ">
                            Mi carrito
                          </Link>
                        </li>
                        {role === 'admin' && (
                          <li>
                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100 ">
                              Panel Administración
                            </Link>
                          </li>
                        )}
                        <li>
                          <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
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

          {/* Botones de autenticación en escritorio */}
          <div className="hidden items-center space-x-4 text-black md:flex">
            {!isAuthenticated ? (
              <>
                <button onClick={() => setIsLoginModalOpen(true)} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">
                  Conectarme
                </button>
                <button onClick={() => setIsRegistroModalOpen(true)} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
                  Registrarme
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="bg-login flex items-center justify-center rounded-full p-2 text-sm font-medium "
                >
                  <img src={user?.avatar || '/assets/perfil_default.png'} alt="Avatar" className="size-10 rounded-full object-cover" />
                  <FaCaretDown className="ml-2 text-sm" />
                </button>

                {isMenuOpen && (
                  <div ref={menuRef} className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-800">
                    <ul>
                      <li>
                        <Link to="/perfil" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                          Mi perfil
                        </Link>
                      </li>
                      <li>
                          <Link to="/carrito" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100 ">
                            Mi carrito
                          </Link>
                        </li>
                        {role === 'admin' && (
                          <li>
                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100 ">
                              Panel Administración
                            </Link>
                          </li>
                        )}
                      <li>
                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
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
