import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import ProductDetail from "./pages/ProductDetail";
import Loading from "./components/Loading";

import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useAuth } from "./AuthContext";
import CarritoButton from "./components/CarritoButton";
import { CartProvider } from "./CartContext";
import { ToastContainer } from "react-toastify";  // Importar el ToastContainer

// Carga diferida (lazy loading)
const Perfil = lazy(() => import("./pages/Perfil"));
const Cart = lazy(() => import("./pages/Carrito"));
const AdminPanel = lazy(() => import("./admins/AdminPanel"));

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const AdminRoute = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <Loading />;
  return isAuthenticated && role === "admin" ? <Outlet /> : <Navigate to="/" />;
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter basename="">
        <div className="flex min-h-screen flex-col dark:bg-gray-800">
          <Navbar />
          <main className="flex flex-col items-center justify-center gap-6 p-4 sm:p-8 lg:p-16">
            <Routes>
              {/* Rutas de la aplicación */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              {/* Rutas protegidas para usuarios autenticados */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/perfil"
                  element={
                    <Suspense fallback={<Loading />}>
                      <Perfil />
                    </Suspense>
                  }
                />
                <Route
                  path="/carrito"
                  element={
                    <Suspense fallback={<Loading />}>
                      <Cart />
                    </Suspense>
                  }
                />
              </Route>

              {/* Rutas protegidas solo para administradores */}
              <Route element={<AdminRoute />}>
                <Route
                  path="/admin"
                  element={
                    <Suspense fallback={<Loading />}>
                      <AdminPanel />
                    </Suspense>
                  }
                />
              </Route>

              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Botón flotante del carrito */}
          <CarritoButton />

          {/* Contenedor de Toasts */}
          <ToastContainer 
            position="top-right"       // Posición de los toasts
            autoClose={3000}           // Tiempo que permanece visible (en milisegundos)
            hideProgressBar={false}    // Mostrar barra de progreso
            newestOnTop={true}         // Los toasts más recientes aparecen arriba
            closeOnClick={true}        // Cerrar al hacer clic en el toast
            pauseOnHover={true}        // Pausar el toast cuando se pasa el cursor sobre él
          />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
