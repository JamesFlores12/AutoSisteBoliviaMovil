import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import appFirebase from "../../credenciales";
import { FaHome, FaTools, FaReceipt, FaUser } from "react-icons/fa";

const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase);

const HistorialScreen = () => {
  const [peticiones, setPeticiones] = useState([]);
  const [filter, setFilter] = useState("All"); // Filtro para "All", "Pendiente", etc.
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(2); // Selecciona "Historial" por defecto.

  // Obtener usuario autenticado
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchPeticiones(user.email);
    }
  }, [user]);

  // Consultar peticiones en Firestore
  const fetchPeticiones = async (userEmail) => {
    setLoading(true);
    const peticionRef = collection(db, "Peticion");
    const q = query(peticionRef, where("usuario", "==", userEmail));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPeticiones(data);
    setLoading(false);
  };

  // Filtrar peticiones por estado
  const filteredPeticiones =
    filter === "All"
      ? peticiones
      : peticiones.filter((peticion) => peticion.estado === filter);

  const handleNavigation = (index) => {
    setSelectedIndex(index);
    // Redirigir según el índice seleccionado.
    if (index === 0) {
      window.location.href = "/"; // Redirigir a "Inicio".
    } else if (index === 1) {
      window.location.href = "/services"; // Redirigir a "Servicios".
    } else if (index === 3) {
      window.location.href = "/profile"; // Redirigir a "Perfil".
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Historial de Peticiones
      </h1>

      {/* Resumen de usuario */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "15px",
          borderRadius: "10px",
          margin: "20px 0",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div>
          <p style={{ margin: "0", fontWeight: "bold" }}>Usuario:</p>
          <p style={{ margin: "0", color: "#666" }}>{user?.email}</p>
        </div>
        <div>
          <p style={{ margin: "0", fontWeight: "bold" }}>Total Peticiones:</p>
          <p style={{ margin: "0", color: "#666" }}>{peticiones.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        {["All", "Pendiente", "Completado", "Rechazado"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: "10px 20px",
              margin: "0 5px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: filter === status ? "#283593" : "#fff",
              color: filter === status ? "#fff" : "#000",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Tabla de peticiones */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando...</p>
      ) : (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            padding: "15px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Fecha</th>
                <th style={tableHeaderStyle}>Hora</th>
                <th style={tableHeaderStyle}>Servicio</th>
                <th style={tableHeaderStyle}>Estado</th>
                <th style={tableHeaderStyle}>Precio</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeticiones.length > 0 ? (
                filteredPeticiones.map((peticion) => (
                  <tr key={peticion.id} style={tableRowStyle}>
                    <td style={tableCellStyle}>{peticion.fecha}</td>
                    <td style={tableCellStyle}>{peticion.hora}</td>
                    <td style={tableCellStyle}>{peticion.servicio}</td>
                    <td
                      style={{
                        ...tableCellStyle,
                        color: getEstadoColor(peticion.estado),
                      }}
                    >
                      {peticion.estado}
                    </td>
                    <td style={tableCellStyle}>${peticion.precio}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                    No se encontraron peticiones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Navegación */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#1E1E2C",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        {[
          { icon: <FaHome />, label: "Inicio" },
          { icon: <FaTools />, label: "Servicios" },
          { icon: <FaReceipt />, label: "Historial" },
          { icon: <FaUser />, label: "Perfil" },
        ].map((tab, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(index)}
            style={{
              background: "none",
              border: "none",
              color: selectedIndex === index ? "#FBC02D" : "white",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            <p style={{ margin: "0", fontSize: "12px" }}>{tab.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// Estilos para la tabla
const tableHeaderStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  backgroundColor: "#283593",
  color: "white",
};

const tableCellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

const tableRowStyle = {
  backgroundColor: "#f9f9f9",
  textAlign: "left",
};

// Colores de estado
const getEstadoColor = (estado) => {
  switch (estado) {
    case "Pendiente":
      return "orange";
    case "Completado":
      return "green";
    case "Rechazado":
      return "red";
    default:
      return "black";
  }
};

export default HistorialScreen;
