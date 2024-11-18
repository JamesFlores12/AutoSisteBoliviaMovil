import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore
import { useNavigate } from "react-router-dom"; // Para la navegación
import { db } from "../../credenciales"; // Conexión a Firebase
import "./ModuloServicio.css";
import Location from "./Location"; // Componente Location

const ModuloServicio = () => {
  const [selectedService, setSelectedService] = useState(null); // Servicio seleccionado
  const [providers, setProviders] = useState([]); // Lista de proveedores
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const navigate = useNavigate(); // Hook para navegación

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
    navigate("/generar-peticion", { state: { provider, selectedService } });
  };

  return (
    <div className="app-container">
      {/* Barra de navegación */}
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
              <p>Cargando proveedores...</p>
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
    </div>
  );
};

export default ModuloServicio;
