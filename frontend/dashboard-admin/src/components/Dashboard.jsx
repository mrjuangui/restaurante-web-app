import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Dashboard = ({ onLogout }) => {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const respuesta = await axios.get("https://restaurante-web-app-production.up.railway.app/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDatos(respuesta.data);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);

      // Si es error 401 o 403 (token inválido o no autorizado)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("token");
        onLogout(); // vuelve al login
      }
    }
  };

  fetchData();
  }, []);


  if (!datos) {
    return <p className="text-center mt-5">Cargando datos del dashboard...</p>;
  }

  const dataBarras = {
    labels: datos.topProductos.map((p) => p.producto),
    datasets: [
      {
        label: "Cantidad vendida",
        data: datos.topProductos.map((p) => p.cantidadVendida),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderRadius: 5,
      },
    ],
  };

  const dataPastel = {
    labels: datos.pedidosPorEstado.map((e) => e.estado),
    datasets: [
      {
        label: "Pedidos",
        data: datos.pedidosPorEstado.map((e) => e.cantidad),
        backgroundColor: ["#4e73df", "#1cc88a", "#f6c23e", "#e74a3b", "#36b9cc"],
      },
    ],
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center align-items-center mb-4 font-weight-bold">
        <h1 className="h1_dbd">Dashboard del Administrador</h1>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Total pedidos</h5>
              <p>{datos.totalPedidos}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Total ventas</h5>
              <p>${datos.totalVentas}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5>Total clientes</h5>
              <p>{datos.totalClientes}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-5">
        <h3 className="text-center mt-5">Top productos más vendidos</h3>
        <Bar data={dataBarras} />
      </div>

      <div className="my-5">
        <h3 className="text-center mt-5">Pedidos por estado</h3>
        <div style={{ width: '400px', margin: '0 auto' }}>
          <Pie data={dataPastel} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
