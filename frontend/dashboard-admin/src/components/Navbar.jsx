import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { obtenerCarrito } from "../utils/carrito";
import {FaSignOutAlt, FaSignInAlt, FaUserPlus, FaUserCircle, FaShoppingCart, FaTachometerAlt, FaPlus,
  FaClipboardList, FaStar} from "react-icons/fa";


const Navbar = ({ autenticado, cerrarSesion, setMensaje, setTipo }) => {
  const [totalItems, setTotalItems] = useState(0);
  const [animar, setAnimar] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navigate = useNavigate();

  const actualizarContador = () => {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    setTotalItems(total);

    // Activar animación del globito
    setAnimar(true);
    setTimeout(() => setAnimar(false), 300);
  };

  useEffect(() => {
    actualizarContador();
    window.addEventListener("carritoActualizado", actualizarContador);
    return () => window.removeEventListener("carritoActualizado", actualizarContador);
  }, []);

  useEffect(() => {
    if (autenticado) {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      setNombreUsuario(usuario?.nombre || "");
    } else {
      setNombreUsuario("");
    }
  }, [autenticado]);


  // Estado para el rol del usuario
  const [rol, setRol] = useState("");

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





  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top py-4">
      <div className="container">
        <Link className="navbar-brand" to="/">🍔 RESTAURANTE</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Menú</Link>
            </li>

            <li className="nav-item position-relative">
              <Link className="nav-link" to="/carrito"><FaShoppingCart size={16} /> Carrito</Link>
              <span
                className={`badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle ${animar ? "badge-animar" : ""}`}
                style={{ fontSize: "0.85rem", minWidth: "22px" }}
              >
                {totalItems}
              </span>
            </li>


            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                <FaUserCircle className="me-2" />{autenticado ? nombreUsuario : "Mi Cuenta"}
              </span>
              <ul className="dropdown-menu dropdown-menu-end">
                
                {autenticado ? (
                  <>
                    <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                    <li><Link className="dropdown-item" to="/mis-pedidos">Mis Pedidos</Link></li>

                    {rol === "admin" && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="/admin/gestionar-pedidos">
                        <FaClipboardList className="me-2" />
                        Gestionar Pedidos</Link></li>
                        <li><Link className="dropdown-item" to="/admin/agregar-producto">
                        <FaPlus className="me-2" />
                        Agregar al Menú</Link></li>
                        <li><Link className="dropdown-item" to="/admin/recomendados">
                        <FaStar className="me-2" />
                        Recomendados</Link></li>
                        <li><Link className="dropdown-item" to="/admin/dashboard">
                        <FaTachometerAlt className="me-2" />
                        Dashboard</Link></li>
                      </>
                    )}

                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <button
                          className="dropdown-item"
                          onClick={() => {
                            cerrarSesion();
                            setMensaje("Has cerrado sesión correctamente");
                            setTipo("success");
                            setTimeout(() => {
                              navigate("/");
                            }, 100);
                          }}
                        >
                        <FaSignOutAlt className="me-2" />
                        Cerrar sesión
                        </button>
                    </li>



                  </>
                ) : (
                  <>
                    <li><Link className="dropdown-item" to="/login">
                    <FaSignInAlt className="me-1" /> 
                     Iniciar sesión</Link></li>
                    <li><Link className="dropdown-item" to="/registro">
                    <FaUserPlus className="me-1" /> 
                     Registrarse</Link></li>
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

export default Navbar;
