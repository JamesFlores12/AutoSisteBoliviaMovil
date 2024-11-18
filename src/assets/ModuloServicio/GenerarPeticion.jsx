import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../credenciales"; // Conexión a Firebase
import "./GenerarPeticion.css";

const GenerarPeticion = () => {
  const { state } = useLocation(); // Recibir datos del proveedor y servicio
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ubicacion, setUbicacion] = useState({ lat: null, lng: null }); // Ubicación actual

  const { provider, selectedService } = state;

  // Obtener ubicación actual
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUbicacion({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          alert("No se pudo obtener la ubicación actual. Verifica los permisos.");
        }
      );
    } else {
      alert("La geolocalización no está soportada por este navegador.");
    }
  }, []);

  // Guardar la petición en Firestore
  const handleSubmit = async () => {
    if (!ubicacion.lat || !ubicacion.lng) {
      alert("No se pudo obtener la ubicación. Intenta nuevamente.");
      return;
    }

    setLoading(true);
    try {
      const peticion = {
        proveedor: provider.nombreProveedor,
        servicio: selectedService,
        estado: "Pendiente",
        precio: 90,
        ubicacion: {
          latitud: ubicacion.lat, // Almacenar como número
          longitud: ubicacion.lng, // Almacenar como número
        },
        usuario: "usuarioEjemplo@gmail.com", // Simula un usuario autenticado
        fecha: new Date().toISOString().split("T")[0], // Fecha actual
      };

      await addDoc(collection(db, "Peticion"), peticion);
      alert("¡Petición generada exitosamente!");
      navigate("/estado-peticiones"); // Redirigir a la página de estado de peticiones
    } catch (err) {
      console.error("Error al generar la petición:", err);
      alert("Hubo un error al generar la petición.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="peticion-container">
      <header className="peticion-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <h1>Generar Petición</h1>
      </header>
      <div className="peticion-card">
        <h2>{provider.nombreEmpresa}</h2>
        <p>
          <strong>Servicio:</strong> {selectedService}
        </p>
        <p>
          <strong>Precio:</strong> Bs90
        </p>
        {ubicacion.lat && ubicacion.lng ? (
          <p>
            <strong>Ubicación detectada:</strong> {ubicacion.lat.toFixed(6)}, {ubicacion.lng.toFixed(6)}
          </p>
        ) : (
          <p>Obteniendo ubicación...</p>
        )}
        <button
          className="confirm-button"
          onClick={handleSubmit}
          disabled={loading || !ubicacion.lat}
        >
          {loading ? "Generando..." : "Confirmar Petición"}
        </button>
      </div>
    </div>
  );
};

export default GenerarPeticion;
