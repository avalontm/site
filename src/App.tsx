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
import { ToastContainer } from "react-toastify";

// Carga diferida (lazy loading)
const Perfil = lazy(() => import("./pages/Perfil"));
const Cart = lazy(() => import("./pages/Carrito"));
const AdminPanel = lazy(() => import("./dashboard/AdminPanel"));
const ProductosPanel = lazy(() => import("./dashboard/ProductosPanel"));
const Products = lazy(() => import("./pages/Products"));
const ProductoForm = lazy(() => import("./dashboard/ProductForm"));

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
              <Route path="/nosotros" element={<About />} />

              {/* Ruta para productos */}
              <Route
                path="/productos"
                element={
                  <Suspense fallback={<Loading />}>
                    <Products />
                  </Suspense>
                }
              />

              {/* Ruta para detalles de producto */}
              <Route
                path="/producto/:uuid"
                element={
                  <Suspense fallback={<Loading />}>
                    <ProductDetail />
                  </Suspense>
                }
              />

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
                  path="/dashboard"
                  element={
                    <Suspense fallback={<Loading />}>
                      <AdminPanel />
                    </Suspense>
                  }
                />
                <Route
                  path="/dashboard/productos"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProductosPanel />
                    </Suspense>
                  }
                />
                <Route
                  path="/dashboard/producto/:uuid?"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProductoForm />
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
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={true}
            pauseOnHover={true}
          />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
