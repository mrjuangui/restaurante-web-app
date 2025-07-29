import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutRedirector = ({ cerrarSesion }) => {
  const navigate = useNavigate();

  useEffect(() => {
    cerrarSesion();           // Borra el localStorage y actualiza estado
    navigate("/");            // Redirige al inicio
  }, []);

  return null; // No muestra nada en pantalla
};

export default LogoutRedirector;
