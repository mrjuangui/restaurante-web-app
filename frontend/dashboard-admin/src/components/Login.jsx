import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Componente de inicio de sesión
// que permite a los usuarios ingresar su correo electrónico y contraseña
const Login = ({ onLogin, setMensaje, setTipo }) => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  // que se ejecuta al hacer clic en el botón "Entrar"
  const handleSubmit = async (e) => {
    
    // Prevenimos el comportamiento por defecto del formulario
    // para evitar que se recargue la página
    e.preventDefault();

    // Limpiamos el mensaje de error antes de enviar
    try {
      const res = await fetch("https://restaurante-web-app-production.up.railway.app/api/auth/iniciar-sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
      });

      const data = await res.json();

      // Si la respuesta es exitosa, guardamos el token y los datos del usuario
      if (res.ok) {
        const usuario = { token: data.token, nombre: data.nombre, id: data.id, rol: data.rol };
        localStorage.setItem("usuario", JSON.stringify(usuario));
        localStorage.setItem("token", data.token);
        
        // Llamamos a la función onLogin con el objeto completo
        onLogin(usuario);
        setMensaje("¡Bienvenido/a, " + data.nombre + "!");
        setTipo("success");
        navigate("/");
      } else {
        setError(data.mensaje || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error(err);
      setError("Error de red o del servidor");
    }
  };

  // Renderizamos el formulario de inicio de sesión
  // y mostramos el mensaje de error si existe
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Correo electrónico</label>
          <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)}required />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" className="form-control" value={clave} onChange={(e) => setClave(e.target.value)} required />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">
          Entrar
        </button>

      </form>
    </div>
  );
};

export default Login;
