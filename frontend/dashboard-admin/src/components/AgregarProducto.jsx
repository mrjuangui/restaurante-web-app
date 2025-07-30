import React, { useState } from "react";

const AgregarProducto = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [url_imagen, setImagen] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://restaurante-web-app-production.up.railway.app/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, descripcion, precio, url_imagen, categoria }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Producto agregado con éxito");
        setTipo("success");
        setNombre("");
        setDescripcion("");
        setPrecio("");
        setImagen("");
        setCategoria("");
      } else {
        setMensaje(data.mensaje || "Error al agregar producto");
        setTipo("danger");
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setMensaje("Error de red o del servidor");
      setTipo("danger");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Agregar Nuevo Producto</h2>
      
      <form onSubmit={handleSubmit}>
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
          <label>Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Precio</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Imagen (URL)</label>
          <input
            type="text"
            className="form-control"
            value={url_imagen}
            onChange={(e) => setImagen(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Categoría</label>
          <input
            type="text"
            className="form-control"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          />
        </div>

        {mensaje && <div className={`alert alert-${tipo}`}>{mensaje}</div>}

        <button type="submit" className="btn btn-success w-100">
          Agregar Producto
        </button>
      </form>
    </div>
  );
};

export default AgregarProducto;
