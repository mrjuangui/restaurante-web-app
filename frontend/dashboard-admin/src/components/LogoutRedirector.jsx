import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutRedirector = ({ cerrarSesion }) => {
  const navigate = useNavigate();

  useEffect(() => {
    cerrarSesion();
    navigate("/");
  }, []);

  return null;
};

export default LogoutRedirector;
