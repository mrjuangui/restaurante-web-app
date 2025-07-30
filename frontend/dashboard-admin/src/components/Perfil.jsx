import React, { useEffect, useState } from "react";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = JSON.parse(localStorage.getItem("usuario"))?.token;
      try {
        const res = await fetch("https://restaurante-web-app-production.up.railway.app/api/usuarios/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
            console.log("Respuesta perfil:", data);
            setUsuario(data.usuario);
        }
      } catch (error) {
        console.error("Error al cargar perfil", error);
      }
    };

    fetchPerfil();
  }, []);

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="container mt-5">
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Correo:</strong> {usuario.correo}</p>
      <p><strong>Rol:</strong> {usuario.rol}</p>
      <p><strong>Registrado desde:</strong> {new Date(usuario.creado_en).toLocaleDateString()}</p>
    </div>
  );
};

export default Perfil;
