import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registro = ({ onRegistrado, setMensaje, setTipo }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo, clave }),
      });

      const data = await res.json();

      // Si la respuesta es exitosa, guardamos el token y los datos del usuario
      if (res.ok) {
        const loginRes = await fetch("http://localhost:3000/api/auth/iniciar-sesion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, clave }),
        });

        const loginData = await loginRes.json();

        // Si el inicio de sesión es exitoso, guardamos el token y los datos del usuario
        if (loginRes.ok) {
          localStorage.setItem("usuario", JSON.stringify({
            token: loginData.token,
            nombre: loginData.nombre,
            id: loginData.id,
            rol: loginData.rol,
          }));

          // Llamamos a la función onRegistrado con el token
          onRegistrado(loginData.token);
          setMensaje("Registro exitoso. Bienvenido(a) " + loginData.nombre);
          setTipo("success");
          navigate("/");
        } else {
          setError("Registro exitoso, pero no se pudo iniciar sesión");
          setMensaje("Registro exitoso, pero fallo el inicio de sesión");
          setTipo("warning");
        }
      } else {
        setError(data.mensaje || "Error al registrar usuario");
        setMensaje(data.mensaje || "Error al registrar usuario");
        setTipo("error");
      }
    } catch (err) {
      console.error(err);
      setError("Error de red o del servidor");
      setMensaje("Error de red o del servidor");
      setTipo("error");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Crear Cuenta</h2>
      <form onSubmit={handleRegistro}>
        
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-success w-100">
          Registrarse
        </button>

      </form>
    </div>
  );
};

export default Registro;
