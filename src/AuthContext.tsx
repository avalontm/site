// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean | null;
  role: string | null;
  loading: boolean;
  user: { avatar: string; name: string };
  login: (token: string, role: string, avatar: string, name: string) => void;
  logout: () => void;
  updateAvatar: (newAvatar: string) => void; // Nueva función para actualizar el avatar
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ avatar: string; name: string }>({
    avatar: '/assets/perfil_default.png',
    name: '',
  });

  // Función para verificar si el token ha expirado
  const isTokenExpired = (token: string): boolean => {
    const decodedToken = decodeJWT(token);
    if (!decodedToken) return true;
    const tokenExpDate = decodedToken.exp * 1000; // Convertir de segundos a milisegundos
    const currentDate = new Date().getTime();
    return currentDate > tokenExpDate;
  };

  // Decodificar el JWT (sin necesidad de librerías externas)
  const decodeJWT = (token: string) => {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = atob(payload);
    return JSON.parse(decoded);
  };

  useEffect(() => {
    setLoading(true);

    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const userAvatar = localStorage.getItem('userAvatar');

    if (token && userRole && !isTokenExpired(token)) {
      setIsAuthenticated(true);
      setUser({
        avatar: userAvatar && userAvatar.trim() !== "" ? userAvatar : '/assets/perfil_default.png',
        name: userName || ''
      });
      setRole(userRole);
    } else {
      setUser({ avatar: '/assets/perfil_default.png', name: '' });
      setIsAuthenticated(false);
      setRole(null);
    }

    setLoading(false);
  }, []);

  const login = (token: string, role: string, avatar: string, name: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
    localStorage.setItem('userAvatar', avatar || '/assets/perfil_default.png');

    setUser({ avatar, name });
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
    setUser({ avatar: '/assets/perfil_default.png', name: '' });
  };

  // Función para actualizar la imagen de perfil
  const updateAvatar = (newAvatar: string) => {
    localStorage.setItem('userAvatar', newAvatar); // Guardar en localStorage
    setUser((prevUser) => ({ ...prevUser, avatar: newAvatar })); // Actualizar el estado
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, user, login, logout, updateAvatar }}>
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
