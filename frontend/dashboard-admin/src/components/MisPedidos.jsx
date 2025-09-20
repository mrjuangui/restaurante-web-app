// src/components/MisPedidos.jsx
import React, { useEffect, useState } from "react";

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://restaurante-backend-ilif.onrender.com/api/pedidos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setPedidos(data.pedidos);
        }
      } catch (error) {
        console.error("Error al cargar pedidos", error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Mis Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        pedidos.map((pedido) => {
          const total = pedido.productos.reduce(
            (acc, prod) => acc + (prod.precio || 0) * (prod.cantidad || 1),
            0
          );

          return (
            <div key={pedido.pedido_id} className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Detalles del Pedido</h5>
                <p className="card-subtitle mb-2 text-muted">
                  Fecha: {new Date(pedido.creado_en).toLocaleDateString()}
                </p>

                <ul className="list-group list-group-flush">
                  {pedido.productos.map((prod, idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex align-items-center"
                    >
                      <img
                        src={prod.url_imagen}
                        alt={prod.nombre}
                        className="me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <div>
                        <strong>{prod.nombre}</strong>
                        <div>
                          {prod.cantidad} x ${Number(prod.precio).toFixed(2)} = $
                          {(prod.precio * prod.cantidad).toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 text-end fw-bold fs-5">
                  Total del pedido: ${total.toFixed(2)}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MisPedidos;
