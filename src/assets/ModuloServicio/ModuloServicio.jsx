import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore"; // Para consultar Firestore
import { auth, db } from "../../credenciales";
import { FaHome, FaTools, FaReceipt, FaUser } from "react-icons/fa";
import "./ModuloServicio.css";
import Location from "./Location";

const ModuloServicio = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [userEmail, setUserEmail] = useState(null); // Estado para el correo del usuario autenticado
  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario
  const [userExists, setUserExists] = useState(false); // Validar si el usuario está en la colección
  const navigate = useNavigate();

  // Mapeo para traducir los nombres de los servicios al formato en Firestore
  const serviceMapping = {
    Llantas: "llantera",
    Mecánica: "mecanico",
    Eléctrico: "electrico",
    Grúa: "grua",
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        setUserEmail(email);

        // Verificar si el usuario pertenece a la colección `Usuario`
        try {
          const userSnapshot = await verificarUsuarioEnColeccion(email);
          if (userSnapshot) {
            setUserExists(true); // Validar que el usuario está registrado
            setUserName(userSnapshot.nombre || "Usuario"); // Extraer el nombre del usuario
          } else {
            alert("El usuario no está registrado en la colección Usuario.");
            navigate("/login");
          }
        } catch (error) {
          console.error("Error al verificar el usuario:", error);
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Función para verificar si el usuario pertenece a la colección `Usuario`
  const verificarUsuarioEnColeccion = async (email) => {
    try {
      const usuariosRef = collection(db, "Usuario");
      const q = query(usuariosRef, where("email", "==", email)); // Buscar por email
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data(); // Retorna los datos del usuario si existe
      }
      return null;
    } catch (error) {
      console.error("Error al verificar en la colección Usuario:", error);
      return null;
    }
  };

  const handleServiceClick = (serviceDisplayName) => {
    if (!userExists) {
      alert("No tienes permisos para solicitar servicios.");
      return;
    }

    // Convertimos el nombre del servicio al formato en Firestore
    const serviceType = serviceMapping[serviceDisplayName];
    navigate("/mapa", { state: { serviceType, userEmail } });
  };

  const handleNavigation = (index) => {
    setSelectedIndex(index);
    if (index === 0) navigate("/home");
    if (index === 1) navigate("/services");
    if (index === 2) navigate("/historial");
    if (index === 3) navigate("/profile");
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Servicios Disponibles</h1>
      </header>

      <div className="content-container">
        {userEmail && userExists && (
          <p className="user-email">Bienvenido: {userName} ({userEmail})</p>
        )}

        <div className="location-container">
          <h2>Tu ubicación actual:</h2>
          <Location />
        </div>

        <div className="services-section">
          <div className="service-category">
            <h3>Llantas</h3>
            <img src="/images/llantas.jpg" alt="Llantas" className="service-image" />
            <ul>
              <li>Parchado</li>
              <li>Aumento de aire</li>
              <li>Venta de llantas</li>
              <li>Balanceo</li>
            </ul>
            <button onClick={() => handleServiceClick("Llantas")}>
              Solicitar Servicio
            </button>
          </div>

          <div className="service-category">
            <h3>Mecánica</h3>
            <img src="/images/mecanica.jpg" alt="Mecánica" className="service-image" />
            <ul>
              <li>Fallas del motor</li>
              <li>Problemas en los frenos</li>
              <li>Fuga de fluidos</li>
              <li>Ruido anormal</li>
            </ul>
            <button onClick={() => handleServiceClick("Mecánica")}>
              Solicitar Servicio
            </button>
          </div>

          <div className="service-category">
            <h3>Eléctrico</h3>
            <img src="/images/electrico.jpg" alt="Eléctrico" className="service-image" />
            <ul>
              <li>Batería descargada</li>
              <li>Problemas con el alternador</li>
              <li>Cambio de fusibles</li>
              <li>Fallas en el sistema eléctrico</li>
            </ul>
            <button onClick={() => handleServiceClick("Eléctrico")}>
              Solicitar Servicio
            </button>
          </div>

          <div className="service-category">
            <h3>Grúa</h3>
            <img src="/images/grua.jpg" alt="Grúa" className="service-image" />
            <ul>
              <li>Accidente vehicular</li>
              <li>Falla mecánica total</li>
              <li>Atascamiento en terrenos difíciles</li>
              <li>Remolque por infracción</li>
            </ul>
            <button onClick={() => handleServiceClick("Grúa")}>
              Solicitar Servicio
            </button>
          </div>
        </div>
      </div>

      <div className="navigation-bar">
        {[{ icon: <FaHome />, label: "Inicio" },
          { icon: <FaTools />, label: "Servicios" },
          { icon: <FaReceipt />, label: "Historial" },
          { icon: <FaUser />, label: "Perfil" }].map((tab, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(index)}
            className={selectedIndex === index ? "active" : ""}
          >
            {tab.icon}
            <p>{tab.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModuloServicio;
