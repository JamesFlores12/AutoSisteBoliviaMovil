import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore
import { onAuthStateChanged } from "firebase/auth"; // Para manejar autenticación
import { useNavigate } from "react-router-dom"; // Para la navegación
import { db, auth } from "../../credenciales"; // Conexión a Firebase
import {
  FaHome,
  FaTools,
  FaReceipt,
  FaUser,
} from "react-icons/fa"; // Iconos de la barra de navegación
import "./ModuloServicio.css";
import Location from "./Location"; // Componente Location

const ModuloServicio = () => {
  const [selectedService, setSelectedService] = useState(null); // Servicio seleccionado
  const [providers, setProviders] = useState([]); // Lista de proveedores
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const [userEmail, setUserEmail] = useState(null); // Correo del usuario autenticado
  const [selectedIndex, setSelectedIndex] = useState(1); // Seleccionar Servicios como activo
  const navigate = useNavigate(); // Hook para navegación

  // Obtener el correo del usuario autenticado
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Establecer el correo del usuario autenticado
      } else {
        console.log("Usuario no autenticado. Redirigiendo...");
        navigate("/login"); // Redirigir al login si no hay usuario autenticado
      }
    });

    return () => unsubscribeAuth(); // Limpiar la suscripción
  }, [navigate]);

  // Manejar el clic en los botones de servicio
  const handleServiceClick = async (serviceType) => {
    setSelectedService(serviceType); // Establecer el servicio seleccionado
    setLoading(true); // Mostrar indicador de carga
    setError(null); // Limpiar cualquier error previo

    try {
      const providersRef = collection(db, "proveedores");
      const q = query(providersRef, where("tipoServicio", "==", serviceType));
      const querySnapshot = await getDocs(q);

      const fetchedProviders = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Incluimos el ID del documento
        ...doc.data(),
      }));
      setProviders(fetchedProviders); // Guardar los proveedores en el estado
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
      setError("Hubo un problema al cargar los proveedores. Inténtalo nuevamente.");
    } finally {
      setLoading(false); // Ocultar indicador de carga
    }
  };

  // Manejar clic en una tarjeta de proveedor
  const handleProviderClick = (provider) => {
    // Pasar los datos del proveedor, servicio seleccionado y correo del usuario
    navigate("/generar-peticion", { state: { provider, selectedService, userEmail } });
  };

  // Manejar la navegación entre secciones
  const handleNavigation = (index) => {
    setSelectedIndex(index);
    if (index === 0) navigate("/home");
    if (index === 1) navigate("/services");
    if (index === 2) navigate("/historial");
    if (index === 3) navigate("/profile");
  };

  return (
    <div className="app-container">
      {/* Barra de navegación superior */}
      <header className="app-header">
        {selectedService && (
          <button
            className="nav-button"
            onClick={() => {
              setSelectedService(null); // Volver al menú principal
              setProviders([]); // Limpiar la lista de proveedores
            }}
          >
            ←
          </button>
        )}
        <h1>{selectedService ? "Proveedores" : "Encuéntranos"}</h1>
      </header>

      {/* Contenido */}
      <div className="content-container">
        {!selectedService ? (
          <>
            {/* Mostrar el correo del usuario autenticado */}
            {userEmail && <p className="user-email">Usuario conectado: {userEmail}</p>}

            {/* Ubicación actual */}
            <div className="location-container">
              <h2>Tu ubicación actual:</h2>
              <Location /> {/* Componente Location */}
            </div>

            {/* Botones de servicios */}
            <div className="services-container">
              <button
                className="service-button"
                onClick={() => handleServiceClick("llanteria")}
              >
                Servicio de Llantas
              </button>
              <button
                className="service-button"
                onClick={() => handleServiceClick("electrico")}
              >
                Servicio Eléctrico
              </button>
              <button
                className="service-button"
                onClick={() => handleServiceClick("mecanico")}
              >
                Servicio Mecánico
              </button>
              <button
                className="service-button"
                onClick={() => handleServiceClick("grua")}
              >
                Servicio de Grúa
              </button>
            </div>
          </>
        ) : (
          <div className="providers-container">
            {loading ? (
              <p className="loading">Cargando proveedores...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : providers.length > 0 ? (
              providers.map((provider) => (
                <div
                  className="provider-card"
                  key={provider.id}
                  onClick={() => handleProviderClick(provider)} // Navegación al hacer clic
                >
                  <h3>{provider.nombreEmpresa || "Nombre no disponible"}</h3>
                  <p>
                    <strong>Servicio:</strong> {provider.descripcionServicio || "Sin descripción"}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {provider.direccion || "Dirección no disponible"}
                  </p>
                  <p>
                    <strong>Horario:</strong> {provider.horarioAtencion || "No especificado"}
                  </p>
                  <p>
                    <strong>Contacto:</strong> {provider.celular || "No disponible"}
                  </p>
                </div>
              ))
            ) : (
              <p>No se encontraron proveedores para este servicio.</p>
            )}
          </div>
        )}
      </div>

      {/* Barra de navegación inferior */}
      <div className="navigation-bar">
        {[
          { icon: <FaHome />, label: "Inicio" },
          { icon: <FaTools />, label: "Servicios" },
          { icon: <FaReceipt />, label: "Historial" },
          { icon: <FaUser />, label: "Perfil" },
        ].map((tab, index) => (
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
