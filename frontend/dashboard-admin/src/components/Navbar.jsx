import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerCarrito } from "../utils/carrito";
import { FaSignOutAlt, FaSignInAlt, FaUserPlus, FaUserCircle, FaShoppingCart, FaTachometerAlt, FaPlus, FaClipboardList, FaStar } from "react-icons/fa";

// Componente Navbar
const Navbar = ({ autenticado, cerrarSesion, setMensaje, setTipo }) => {
  const [totalItems, setTotalItems] = useState(0);
  const [animar, setAnimar] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [rol, setRol] = useState("");
  const navigate = useNavigate();

  // Función para actualizar el contador del carrito
  const actualizarContador = () => {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    setTotalItems(total);

    setAnimar(true);
    setTimeout(() => setAnimar(false), 300);
  };

  // useEffect para inicializar el contador y escuchar eventos de actualización del carrito
  useEffect(() => {
    actualizarContador();
    window.addEventListener("carritoActualizado", actualizarContador);
    return () => window.removeEventListener("carritoActualizado", actualizarContador);
  }, []);

  // useEffect para obtener el nombre y rol del usuario al autenticarse
  useEffect(() => {
    if (autenticado) {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      setNombreUsuario(usuario?.nombre || "");
      setRol(usuario?.rol || "");
    } else {
      setNombreUsuario("");
      setRol("");
    }
  }, [autenticado]);

  // Renderizado del componente Navbar
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top py-4">
      <div className="container">
        <Link className="navbar-brand" to="/">🍔 RESTAURANTE</Link>

        {/* Botón toggler para collapse */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú colapsable */}
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Menú</Link>
            </li>

            {/* Enlace al carrito con contador */}
            <li className="nav-item position-relative">
              <Link className="nav-link" to="/carrito">
                <FaShoppingCart size={16} /> Carrito
              </Link>
              <span
                className={`badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle ${animar ? "badge-animar" : ""}`}
                style={{ fontSize: "0.85rem", minWidth: "22px" }}
              >
                {totalItems}
              </span>
            </li>

            {/* Menú de usuario */}
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                <FaUserCircle className="me-2" />
                {autenticado ? nombreUsuario : "Mi Cuenta"}
              </span>
              <ul className="dropdown-menu dropdown-menu-end">
                {autenticado ? (
                  <>
                    <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                    <li><Link className="dropdown-item" to="/mis-pedidos">Mis Pedidos</Link></li>

                    {rol === "admin" && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link className="dropdown-item" to="/admin/gestionar-pedidos">
                            <FaClipboardList className="me-2" /> Gestionar Pedidos
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/agregar-producto">
                            <FaPlus className="me-2" /> Agregar al Menú
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/recomendados">
                            <FaStar className="me-2" /> Recomendados
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/dashboard">
                            <FaTachometerAlt className="me-2" /> Dashboard
                          </Link>
                        </li>
                      </>
                    )}

                    {/* Opción para cerrar sesión */}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          cerrarSesion();
                          setMensaje("Has cerrado sesión correctamente");
                          setTipo("success");
                          setTimeout(() => navigate("/"), 100);
                        }}
                      >
                        <FaSignOutAlt className="me-2" /> Cerrar sesión
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    {/* Opciones para iniciar sesión o registrarse */}
                    <li>
                      <Link className="dropdown-item" to="/login">
                        <FaSignInAlt className="me-1" /> Iniciar sesión
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/registro">
                        <FaUserPlus className="me-1" /> Registrarse
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

// Exportación del componente Navbar
export default Navbar;
