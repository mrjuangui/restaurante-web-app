export const obtenerCarrito = () => {
  const carrito = localStorage.getItem("carrito");
  return carrito ? JSON.parse(carrito) : [];
};

export const agregarAlCarrito = (producto) => {
  let carrito = obtenerCarrito();
  const index = carrito.findIndex((item) => item.id === producto.id);

  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  window.dispatchEvent(new Event("carritoActualizado"));
};

export const vaciarCarrito = () => {
  localStorage.removeItem("carrito");
  window.dispatchEvent(new Event("carritoActualizado"));
};
