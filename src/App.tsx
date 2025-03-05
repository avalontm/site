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
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Share from "./pages/Share";
import Pedidos from "./pages/Pedidos";
import Ubicacion from "./pages/Ubicacion";
import Pedido from "./pages/Pedido";
import Orden from "./dashboard/OrdenForm";
import OrdenForm from "./dashboard/OrdenForm";
import POSPanel from "./dashboard/PosPanel";

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
    <div className="w-full overflow-x-hidden">
    <CartProvider>
      <BrowserRouter basename="">
      {/* Agregamos el ScrollToTop para reiniciar el scroll al cambiar de página */}
      <ScrollToTop />
      <Navbar />
      
         
        <main className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-center gap-6 p-4">

            <Routes>
              {/* Rutas de la aplicación */}
              <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<About />} />

              {/* Ruta para compartir productos */}
              <Route
                path="/compartir/:uuid"
                element={
                  <Suspense fallback={<Loading />}>
                    <Share />
                  </Suspense>
                }
              />

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

              {/* Ruta para la ubicacion */}
              <Route
                path="/ubicacion"
                element={
                  <Suspense fallback={<Loading />}>
                    <Ubicacion />
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

                <Route
                  path="/pedidos"
                  element={
                    <Suspense fallback={<Loading />}>
                      <Pedidos />
                    </Suspense>
                  }
                />
                
            {/* Ruta para detalles dela orden */}
              <Route
                path="/pedido/:id"
                element={
                  <Suspense fallback={<Loading />}>
                    <Pedido />
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
                <Route
                  path="/dashboard/orden/:uuid?"
                  element={
                    <Suspense fallback={<Loading />}>
                      <OrdenForm />
                    </Suspense>
                  }
                />

                <Route
                  path="/dashboard/pos"
                  element={
                    <Suspense fallback={<Loading />}>
                      <POSPanel />
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

         {/* Footer siempre abajo */}
         <Footer/>
       

      </BrowserRouter>
    </CartProvider>
    </div>
  );
}

export default App;
