import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import appFirebase from "../../credenciales";

const auth = getAuth(appFirebase);

const HomeScreen = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Manejo del cambio de pestañas en el BottomNavigationBar
  const handleNavigation = (index) => {
    setSelectedIndex(index);

    // Redirigir al perfil si se selecciona la pestaña de perfil
    if (index === 3) {
      navigate("/profile"); // Ajusta la ruta según la configuración
    }
  };

  // Funciones responsivas
  const responsiveFont = (value) => Math.min(Math.max(value, 16), 32);
  const responsiveHeight = (value) => Math.min(Math.max(value, 150), 300);

  return (
    <div style={{ backgroundColor: "#1E1E2C", minHeight: "100vh", color: "white" }}>
      {/* Encabezado */}
      <div
        style={{
          height: "35vh",
          background: "linear-gradient(to bottom, #1E1E2C, #FBC02D)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ fontSize: `${responsiveFont(28)}px`, fontWeight: "bold" }}>Bienvenido a</h1>
        <h2
          style={{
            fontSize: `${responsiveFont(36)}px`,
            fontWeight: "bold",
            color: "#FBC02D",
            letterSpacing: "2px",
          }}
        >
          AUTOSISTE BOLIVIA
        </h2>
      </div>

      {/* Contenido */}
      <div style={{ padding: "20px" }}>
        {/* Ubicación y opciones */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: "8px" }}></i>
            <span style={{ fontWeight: "bold" }}>Taller Central</span>
            <i className="fas fa-chevron-down" style={{ marginLeft: "8px" }}></i>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <i className="fas fa-bell"></i>
            <i className="fas fa-shopping-cart"></i>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Buscar servicios, repuestos, mecánicos..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
          />
        </div>

        {/* Oferta destacada */}
        <div
          style={{
            backgroundColor: "#283593",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >
          <h3 style={{ fontWeight: "bold" }}>Servicio Mecánico hasta 20% OFF</h3>
          <p>Aprovecha las ofertas en mantenimiento de tu vehículo.</p>
          <button
            onClick={() => alert("Ver Servicios")}
            style={{
              backgroundColor: "white",
              color: "#283593",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Ver Servicios
          </button>
        </div>
      </div>

      {/* BottomNavigationBar */}
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
        <button
          onClick={() => handleNavigation(0)}
          style={{
            background: "none",
            border: "none",
            color: selectedIndex === 0 ? "#FBC02D" : "white",
            fontSize: "18px",
          }}
        >
          <i className="fas fa-home"></i>
          <p style={{ margin: 0 }}>Inicio</p>
        </button>
        <button
          onClick={() => handleNavigation(1)}
          style={{
            background: "none",
            border: "none",
            color: selectedIndex === 1 ? "#FBC02D" : "white",
            fontSize: "18px",
          }}
        >
          <i className="fas fa-tools"></i>
          <p style={{ margin: 0 }}>Servicios</p>
        </button>
        <button
          onClick={() => handleNavigation(2)}
          style={{
            background: "none",
            border: "none",
            color: selectedIndex === 2 ? "#FBC02D" : "white",
            fontSize: "18px",
          }}
        >
          <i className="fas fa-receipt"></i>
          <p style={{ margin: 0 }}>Historial</p>
        </button>
        <button
          onClick={() => handleNavigation(3)}
          style={{
            background: "none",
            border: "none",
            color: selectedIndex === 3 ? "#FBC02D" : "white",
            fontSize: "18px",
          }}
        >
          <i className="fas fa-user"></i>
          <p style={{ margin: 0 }}>Perfil</p>
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
