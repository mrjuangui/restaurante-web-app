import React, { useEffect, useState } from "react";
import axios from "axios";

const estados = ["Pendiente", "Preparando", "Enviado", "Entregado"];

const GestionarPedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cambiosEstado, setCambiosEstado] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await axios.get("https://restaurante-web-app-production.up.railway.app/api/pedidos/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPedidos(res.data.pedidos);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

  const handleEstadoChange = (pedidoId, nuevoEstado) => {
    setCambiosEstado({ ...cambiosEstado, [pedidoId]: nuevoEstado });
  };

  const guardarEstado = async (pedidoId) => {
    const nuevoEstado = cambiosEstado[pedidoId];
    try {
      await axios.put(
        `https://restaurante-web-app-production.up.railway.app/api/pedidos/${pedidoId}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPedidos((prev) =>
        prev.map((p) =>
          p.pedido_id === pedidoId ? { ...p, estado: nuevoEstado } : p
        )
      );
      const copia = { ...cambiosEstado };
      delete copia[pedidoId];
      setCambiosEstado(copia);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const eliminarPedido = async (pedidoId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      await axios.delete(`https://restaurante-web-app-production.up.railway.app/api/pedidos/${pedidoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos((prev) => prev.filter((p) => p.pedido_id !== pedidoId));
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Gestión de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.pedido_id} className="card mb-3 shadow-sm compact-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <strong>Pedido #{pedido.pedido_id}</strong> | {new Date(pedido.creado_en).toLocaleDateString()}
                  <br />
                  <small>Cliente: {pedido.nombre_cliente} - {pedido.correo}</small>
                </div>

                <div className="d-flex align-items-center">
                  <select
                    className="form-select form-select-sm me-2"
                    style={{ minWidth: "120px" }}
                    value={cambiosEstado[pedido.pedido_id] || pedido.estado}
                    onChange={(e) => handleEstadoChange(pedido.pedido_id, e.target.value)}
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                  {cambiosEstado[pedido.pedido_id] && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => guardarEstado(pedido.pedido_id)}
                    >
                      Guardar
                    </button>
                  )}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => eliminarPedido(pedido.pedido_id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <table className="table table-sm mt-3 mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.productos.map((prod, i) => (
                    <tr key={i}>
                      <td>{prod.producto_id}</td>
                      <td>{prod.nombre || "-"}</td>
                      <td>{prod.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GestionarPedidosAdmin;
