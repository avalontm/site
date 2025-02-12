// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean | null;
  role: string | null;
  loading: boolean;
  user: { avatar: string; name: string };
  login: (token: string, role: string, avatar: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga
  const [user, setUser] = useState<{ avatar: string; name: string }>({
    avatar: '/assets/perfil_default.png', // Avatar predeterminado
    name: '', // Nombre predeterminado
  });

  useEffect(() => {
    setLoading(true);

    // Lógica para verificar el estado de la autenticación
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const userAvatar = localStorage.getItem('userAvatar');

    if (token && userRole) {
      setIsAuthenticated(true);
      setUser({
        avatar: userAvatar && userAvatar.trim() !== "" ? userAvatar : '/assets/perfil_default.png',
        name: userName || ''
      });
      setRole(userRole); // Establecer el rol
    } else {
      setUser({
        avatar: '/perfil_default.png',  // Avatar predeterminado si no hay avatar en localStorage
        name: ''
      });
      setIsAuthenticated(false);
      setRole(null); // Asegúrate de limpiar el rol si no está autenticado
    }

    setLoading(false); // Cambiar el estado de carga a falso después de verificar
  }, []);

  const login = (token: string, role: string, avatar: string, name: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name); // Guardar el nombre del usuario
    localStorage.setItem('userAvatar', avatar || '/assets/perfil_default.png');  // Guardar el avatar del usuario

    setUser({
      avatar: avatar,
      name: name || ''
    });
    setIsAuthenticated(true);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    setIsAuthenticated(false);
    setRole(null);
    setUser({
      avatar: '/assets/perfil_default.png',  // Valor predeterminado
      name: ''
    });
  };

  if (loading) {
    return <div>Cargando...</div>;  // Se muestra "Cargando..." mientras se verifica la autenticación
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
