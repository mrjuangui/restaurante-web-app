import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MenuProductos from "./components/MenuProductos";
import Carrito from "./components/Carrito";
import Login from "./components/Login";
import Registro from "./components/Registro";
import ToastNotification from "./components/ToastNotification";
import Perfil from "./components/Perfil";
import MisPedidos from "./components/MisPedidos";
import LogoutRedirector from "./components/LogoutRedirector";
import AgregarProducto from "./components/AgregarProducto";
import Dashboard from "./components/Dashboard";
import AdminRecomendados from "./components/AdminRecomendados";
import GestionarPedidosAdmin from "./components/GestionarPedidosAdmin";
import "./index.css";

const App = () => {
  // Obtener el usuario lo antes posible
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const [autenticado, setAutenticado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

  // Verifica si el usuario ya está autenticado al cargar la aplicación
  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioGuardado?.token) {
      setAutenticado(true);
    }
  }, []);

  // Maneja el inicio de sesión exitoso
  const handleLogin = (usuario) => {
    setAutenticado(true);
  };

  // Maneja el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setAutenticado(false);
    setMensaje("Has cerrado sesión correctamente");
    setTipo("success");
  };

  return (
    <Router>
      <Navbar
        autenticado={autenticado}
        cerrarSesion={handleLogout}
        setMensaje={setMensaje}
        setTipo={setTipo}
      />
      <ToastNotification mensaje={mensaje} tipo={tipo} />
      <div style={{ paddingTop: "80px" }}>
        <Routes>
          <Route path="/" element={<MenuProductos />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route
            path="/login"
            element={
              <Login
                onLogin={handleLogin}
                setMensaje={setMensaje}
                setTipo={setTipo}
              />
            }
          />
          <Route
            path="/registro"
            element={
              <Registro
                onRegistrado={handleLogin}
                setMensaje={setMensaje}
                setTipo={setTipo}
              />
            }
          />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
          <Route
            path="/logout"
            element={<LogoutRedirector cerrarSesion={handleLogout} />}
          />
          <Route path="/admin/agregar-producto" element={<AgregarProducto />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/recomendados" element={<AdminRecomendados />} />
          {usuario?.rol === "admin" && (
            <Route
              path="/admin/gestionar-pedidos"
              element={<GestionarPedidosAdmin />}
            />
          )}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
