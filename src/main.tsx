import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from './AuthContext';  
import { HelmetProvider } from "react-helmet-async"; // Importa HelmetProvider
import "./index.css";
import 'flowbite';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider> {/* Envuelve la app con HelmetProvider */}
      <AuthProvider> {/* Mantén AuthProvider aquí */}
        <App />
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
