import React, { useEffect, useState } from "react";
import axios from "axios";
import ToastNotification from "./ToastNotification";

const AdminRecomendados = () => {
  const [productos, setProductos] = useState([]);
  const [recomendados, setRecomendados] = useState([null, null, null, null]);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/productos");
        const productosObtenidos = res.data.productos;

        setProductos(productosObtenidos);

        const actuales = productosObtenidos.filter((p) => p.recomendado);
        const iniciales = [null, null, null, null];
        actuales.slice(0, 4).forEach((prod, i) => {
          iniciales[i] = prod.id;
        });

        setRecomendados(iniciales);
      } catch (err) {
        console.error("Error al cargar productos", err);
      }
    };

    fetchProductos();
  }, []);

  const handleChange = (index, value) => {
    const nuevos = [...recomendados];
    nuevos[index] = parseInt(value);
    setRecomendados(nuevos);
  };

  const guardarRecomendados = async () => {
    const token = JSON.parse(localStorage.getItem("usuario"))?.token;

    try {
      const res = await axios.put(
        "http://localhost:3000/api/productos/recomendados",
        { ids: recomendados.filter((id) => id !== null) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensaje(res.data.mensaje || "Recomendados actualizados");
    } catch (err) {
      console.error("Error al actualizar recomendados", err);
      setMensaje("Error al actualizar recomendados");
    }
  };

  const obtenerProductoPorId = (id) => {
    return productos.find((p) => p.id === id);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Configurar Productos Recomendados</h2>
      <ToastNotification mensaje={mensaje} />

      <div className="d-flex flex-column gap-3">
        {[0, 1, 2, 3].map((i) => {
          const prodSeleccionado = obtenerProductoPorId(recomendados[i]);
          return (
            <div
              key={i}
              className="d-flex align-items-center justify-content-between p-3 border rounded shadow-sm"
            >
              <strong className="me-3">Recomendado {i + 1}:</strong>
              <select
                className="form-select me-3"
                style={{ flex: "1" }}
                value={recomendados[i] || ""}
                onChange={(e) => handleChange(i, e.target.value)}
              >
                <option value="">Selecciona un producto</option>
                {productos.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre}
                  </option>
                ))}
              </select>

              {prodSeleccionado && (
                <div className="d-flex align-items-center">
                  <img
                    src={prodSeleccionado.url_imagen}
                    alt={prodSeleccionado.nombre}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-success" onClick={guardarRecomendados}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default AdminRecomendados;
