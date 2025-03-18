// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./css/index.css";
import router from "./routes/Navigation.jsx";
import { AuthProvider } from "./context/AuthContext"; // Importando o contexto de autenticação

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
