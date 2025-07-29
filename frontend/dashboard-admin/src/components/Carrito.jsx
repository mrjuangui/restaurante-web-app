import React, { useEffect, useState } from "react";
import { obtenerCarrito } from "../utils/carrito";
import ToastNotification from "./ToastNotification";
import { useNavigate } from "react-router-dom";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [toast, setToast] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCarrito(obtenerCarrito());
  }, []);

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    let nuevoCarrito = carrito
      .map((item) =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
      .filter((item) => item.cantidad > 0);

    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    setCarrito([]);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const calcularTotal = () => {
    return carrito.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  };

  const confirmarPedido = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast("Debes iniciar sesión para hacer un pedido.");
      return;
    }

    const productos = carrito.map((item) => ({
      producto_id: item.id,
      cantidad: item.cantidad,
    }));

    try {
      const res = await fetch("http://localhost:3000/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productos }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast("¡Pedido realizado con éxito!");
        vaciarCarrito();
        setMostrarModal(false);
        setTimeout(() => {
          navigate("/mis-pedidos");
        }, 1500);
      } else {
        setToast(data.mensaje || "Hubo un error al realizar el pedido.");
      }
    } catch (error) {
      console.error("Error al realizar pedido:", error);
      setToast("Ocurrió un error inesperado.");
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <h3>Tu carrito está vacío</h3>
        <ToastNotification mensaje={toast} />
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <h3>Tu carrito</h3>
      <ToastNotification mensaje={toast} />

      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() =>
                    actualizarCantidad(item.id, item.cantidad - 1)
                  }
                >
                  -
                </button>
                {item.cantidad}
                <button
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() =>
                    actualizarCantidad(item.id, item.cantidad + 1)
                  }
                >
                  +
                </button>
              </td>
              <td>${item.precio}</td>
              <td>${item.precio * item.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Total: ${calcularTotal()}</h4>
      <div className="mt-3">
        <button
          className="btn btn-success me-3"
          onClick={() => setMostrarModal(true)}
        >
          Pedir Ahora
        </button>
        <button className="btn btn-danger" onClick={vaciarCarrito}>
          Vaciar Carrito
        </button>
      </div>

      {/* Modal de Confirmación */}
      {mostrarModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ maxWidth: "500px", width: "90%" }}>
            <h5 className="mb-3">Confirmar Pedido</h5>
            <p>
              En una versión completa, aquí iría el módulo de pago. Pero como este es un prototipo, el
              pedido se guardará directamente en la base de datos y luego serás redirigido a tu historial de pedidos.
            </p>
            <p className="fw-bold">¿Deseas continuar y registrar este pedido?</p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-success" onClick={confirmarPedido}>
                Confirmar Pedido
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default Carrito;
