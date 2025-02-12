import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from './AuthContext';  // Asegúrate de importar el AuthProvider
import "./index.css";
import 'flowbite';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider> {/* Envuelve el componente App con AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
