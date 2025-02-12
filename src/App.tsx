// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductDetail from './components/ProductDetail';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import Cart from './pages/Carrito';
import AdminPanel from './admins/AdminPanel';
import NotFound from './pages/NotFound';
import { useAuth } from './AuthContext';
import CarritoButton from './components/CarritoButton';
import { CartProvider } from './CartContext'; // Importa el CartProvider

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const AdminRoute = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated && role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

function App() {
  return (
    <CartProvider> {/* Proveemos el contexto aquí */}
      <BrowserRouter basename="">
        <div className="flex min-h-screen flex-col dark:bg-gray-800">
          <Navbar />
          <main className="flex flex-col items-center justify-center gap-6 p-4 sm:p-8 lg:p-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* Rutas protegidas para usuarios autenticados */}
              <Route element={<ProtectedRoute />}>
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/carrito" element={<Cart />} />
              </Route>

              {/* Rutas protegidas solo para administradores */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>

              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Coloca el botón flotante del carrito aquí */}
          <CarritoButton />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
