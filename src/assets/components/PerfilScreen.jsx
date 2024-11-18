import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import appFirebase from "../../credenciales";
import ImagenPerfil from "../images/user.jpg"; // Asegúrate de que la imagen esté en este directorio
import { FaHome, FaTools, FaReceipt, FaUser } from "react-icons/fa";

const auth = getAuth(appFirebase);

const PerfilScreen = () => {
  const navigate = useNavigate();
  const user = auth.currentUser; // Obtener el usuario autenticado

  const buildListTile = (iconClass, title, hasNotification = false) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <i className={iconClass} style={{ color: "white", marginRight: "16px" }}></i>
        <span style={{ color: "white", fontSize: "16px" }}>{title}</span>
      </div>
      {hasNotification ? (
        <div
          style={{
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            padding: "6px 10px",
            fontSize: "12px",
          }}
        >
          2
        </div>
      ) : (
        <i className="fas fa-chevron-right" style={{ color: "white", fontSize: "16px" }}></i>
      )}
    </div>
  );

  // Función para manejar navegación desde la barra inferior
  const handleNavigation = (index) => {
    if (index === 0) {
      navigate("/"); // Redirigir a Inicio
    } else if (index === 1) {
      navigate("/services"); // Redirigir a Servicios
    } else if (index === 2) {
      navigate("/historial"); // Redirigir a Historial
    } else if (index === 3) {
      navigate("/profile"); // Redirigir a Perfil
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#1E1E2C",
        minHeight: "100vh",
        color: "white",
        padding: "16px",
        position: "relative",
      }}
    >
      {/* Barra de navegación superior */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate(-1)} // Volver atrás
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Perfil</h1>
        <button
          onClick={() => navigate("/login")} // Ir al login
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </header>

      {/* Información del perfil del usuario */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={ImagenPerfil}
          alt="Imagen de perfil"
          style={{
            height: "80px",
            width: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "10px",
          }}
        />
        <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
          {user?.displayName || user?.email || "Usuario"}
        </h2>
        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "16px" }}>Senior Designer</p>
      </div>

      {/* Opciones del perfil */}
      <div>
        {buildListTile("fas fa-user", "Información Personal")}
        {buildListTile("fas fa-wallet", "Preferencias de Pago")}
        {buildListTile("fas fa-credit-card", "Bancos y Tarjetas")}
        {buildListTile("fas fa-bell", "Notificaciones", true)}
        {buildListTile("fas fa-envelope", "Centro de Mensajes")}
        {buildListTile("fas fa-map-marker-alt", "Dirección")}
        {buildListTile("fas fa-cog", "Configuración")}
      </div>

      {/* Barra de navegación inferior */}
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
              color: index === 3 ? "#FBC02D" : "white", // Resalta Perfil (índice 3)
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

export default PerfilScreen;
