import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import appFirebase from "../../credenciales";
import ImagenPerfil from "../images/user.jpg";
import { FaHome, FaTools, FaReceipt, FaUser, FaRobot } from "react-icons/fa";

const auth = getAuth(appFirebase);

const PerfilScreen = () => {
  const navigate = useNavigate();
  const user = auth.currentUser; // Obtener el usuario autenticado

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.displayName || "",
    phone: "",
  });

  const handleInputChange = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavePersonalInfo = async () => {
    try {
      await updateProfile(user, { displayName: personalInfo.name });
      alert("Información actualizada exitosamente");
      setIsEditingPersonalInfo(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Hubo un error al actualizar tu información.");
    }
  };

  const buildListTile = (iconClass, title, onClick, hasNotification = false) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "10px",
        cursor: "pointer",
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

  // Función para abrir el chatbot
  const openChatbot = () => {
    alert("Iniciando soporte técnico...");
    // Aquí se puede implementar la lógica para iniciar el chatbot
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
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
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
          onClick={() => navigate("/login")}
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

      {isEditingPersonalInfo ? (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            name="name"
            value={personalInfo.name}
            onChange={handleInputChange}
            placeholder="Nombre completo"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "none",
            }}
          />
          <input
            type="text"
            name="phone"
            value={personalInfo.phone}
            onChange={handleInputChange}
            placeholder="Número de celular"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "none",
            }}
          />
          <button
            onClick={handleSavePersonalInfo}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Guardar
          </button>
        </div>
      ) : (
        <>
          {buildListTile("fas fa-user", "Información Personal", () =>
            setIsEditingPersonalInfo(true)
          )}
          {buildListTile("fas fa-wallet", "Preferencias de Pago")}
          {buildListTile("fas fa-bell", "Notificaciones", true)}
          {buildListTile("fas fa-envelope", "Centro de Mensajes")}
        </>
      )}

      {/* Chatbot */}
      <div
        onClick={openChatbot}
        style={{
          position: "fixed",
          bottom: "70px",
          right: "16px",
          backgroundColor: "#4CAF50",
          padding: "16px",
          borderRadius: "50%",
          cursor: "pointer",
        }}
      >
        <FaRobot size={24} color="white" />
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
            onClick={() => navigate(tab.label.toLowerCase())}
            style={{
              background: "none",
              border: "none",
              color: index === 3 ? "#FBC02D" : "white",
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
