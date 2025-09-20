import React, { useEffect, useState } from "react";
import axios from "axios";
import ToastNotification from "./ToastNotification";
import { FaShoppingCart } from "react-icons/fa";

// Componente para mostrar el menú de productos
const MenuProductos = () => {
  const [productos, setProductos] = useState([]);
  const [toast, setToast] = useState(null);

// Iconos para las categorías
const iconosCategoria = {
  Pizzas: "🍕",
  Hamburguesas: "🍔",
  Bebidas: "🥤",
  Postres: "🍰",
  Entradas: "🥟",
  Otros: "🧺",
};

  // Cargar productos al montar el componente
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await axios.get("https://restaurante-backend-ilif.onrender.com/api/productos");
        setProductos(data.productos);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProductos();
  }, []);

  // Manejar el evento de actualización del carrito
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Función para agregar al carrito
  const agregarAlCarrito = (producto, e) => {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex((item) => item.id === producto.id);

    if (index !== -1) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("carritoActualizado"));

    const btn = e.target;
    btn.classList.add("pulse");
    setTimeout(() => btn.classList.remove("pulse"), 300);

    setToast(`¡${producto.nombre} agregado al carrito!`);
  };

  // Filtrar productos recomendados y normales
  const productosRecomendados = productos.filter(p => p.recomendado).slice(0, 4);

  // Filtrar productos normales (no recomendados)
  const productosNormales = productos.filter(p => !p.recomendado);

  // Función para renderizar productos
  const renderProductos = (lista, mostrarBadge = false) => (
    <div className="row">
      {lista.map((producto) => (
        <div key={producto.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
          <div className="card h-100 shadow-sm position-relative producto-card">
            <div className="producto-img-wrapper">
              {mostrarBadge && (
                <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                  Recomendado
                </span>
              )}
              <img
                src={producto.url_imagen}
                alt={producto.nombre}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="overlay-descripcion">
                <span>{producto.descripcion}</span>
              </div>
            </div>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-center">{producto.nombre}</h5>
              <p className="card-text text-center fw-bold">${producto.precio}</p>
              <button
                className="btn btn-carrito mt-auto"
                onClick={(e) => agregarAlCarrito(producto, e)}
              >
                Agregar al carrito   
                <FaShoppingCart className="ms-2" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mt-5">
      <ToastNotification mensaje={toast} />

      {productosRecomendados.length > 0 && (
        <>
          <h3 className="mb-4 text-center">
            ★ Favoritos de los Clientes ★
            </h3>
          {renderProductos(productosRecomendados, true)}
        </>
      )}

          
          <h2 className="text-center mt-5 mb-4">Menú Completo</h2>

          {Object.entries(
            productosNormales.reduce((acc, prod) => {
              const categoria = prod.categoria || "Otros";
              if (!acc[categoria]) acc[categoria] = [];
              acc[categoria].push(prod);
              return acc;
            }, {})
          ).map(([categoria, productosCategoria]) => (
            <div key={categoria} className="mb-5">
              <h4 className="mb-3 border-bottom pb-1">
              {iconosCategoria[categoria] || "🧺"} {categoria}
              </h4>
              {renderProductos(productosCategoria)}
            </div>
          ))}

    </div>
  );
};

export default MenuProductos;
