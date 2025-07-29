// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [autenticado, setAutenticado] = useState(false);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nombreUsuario = localStorage.getItem("nombre");
    if (token && nombreUsuario) {
      setAutenticado(true);
      setNombre(nombreUsuario);
    }
  }, []);

  const login = (token, nombreUsuario) => {
    localStorage.setItem("token", token);
    localStorage.setItem("nombre", nombreUsuario);
    setAutenticado(true);
    setNombre(nombreUsuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    setAutenticado(false);
    setNombre("");
  };

  return (
    <AuthContext.Provider
      value={{
        autenticado,
        nombre,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
