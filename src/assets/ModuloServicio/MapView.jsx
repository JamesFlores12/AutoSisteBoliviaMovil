import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importar Firebase Auth
import { db } from "../../credenciales";
import "./MapView.css";

const MapView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { provider, servicios, userLocation } = location.state || {};
  const [usuarioEmail, setUsuarioEmail] = useState(null); // Estado para almacenar el correo del usuario autenticado
  const [esUsuario, setEsUsuario] = useState(false); // Estado para verificar si pertenece a la colección Usuario

  // Obtener el correo del usuario autenticado y verificar si está en la colección Usuario
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        setUsuarioEmail(email); // Obtener el correo del usuario autenticado

        try {
          // Verificar si el correo pertenece a la colección Usuario
          const usuarioSnapshot = await verificarUsuarioEnColeccion(email);
          if (usuarioSnapshot) {
            setEsUsuario(true); // El usuario pertenece a la colección Usuario
          } else {
            alert("El usuario no está registrado como Usuario.");
            navigate("/login"); // Redirigir al login si no está registrado
          }
        } catch (error) {
          console.error("Error al verificar la colección Usuario:", error);
          alert("Hubo un error al verificar tu usuario. Intenta de nuevo.");
        }
      } else {
        alert("Usuario no autenticado. Por favor, inicia sesión.");
        navigate("/login"); // Redirigir al login si no está autenticado
      }
    });

    return () => unsubscribe(); // Cleanup al desmontar
  }, [navigate]);

  const verificarUsuarioEnColeccion = async (email) => {
    try {
      const usuarioRef = collection(db, "Usuario");
      const q = query(usuarioRef, where("email", "==", email));
      const usuarioSnapshot = await getDocs(q);

      return !usuarioSnapshot.empty; // Retorna true si existe un documento con el email
    } catch (error) {
      console.error("Error al verificar en la colección Usuario:", error);
      return false;
    }
  };

  // Validación de proveedor
  if (!provider) {
    return <p style={{ color: "red", textAlign: "center" }}>No hay información del proveedor.</p>;
  }

  const crearPeticion = async (servicio) => {
    try {
      // Validar que userLocation existe
      if (!userLocation || typeof userLocation.lat !== "number" || typeof userLocation.lng !== "number") {
        alert("No se pudo obtener tu ubicación. Intenta de nuevo.");
        return;
      }

      // Validar que el usuario pertenece a la colección Usuario
      if (!esUsuario || !usuarioEmail) {
        alert("No tienes permisos para realizar esta acción.");
        return;
      }

      // Crear la petición
      const nuevaPeticion = {
        servicio: servicio.nombre,
        proveedor: provider.nombreEmpresa,
        correoProveedor: provider.email,
        precio: servicio.precio,
        cantidad: 1,
        estado: "Pendiente",
        fecha: new Date().toISOString().split("T")[0],
        hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        usuario: usuarioEmail, // Usar el correo del usuario autenticado
        ubicacion: {
          latitud: userLocation.lat,
          longitud: userLocation.lng,
        },
      };

      // Guardar en Firestore
      await addDoc(collection(db, "Peticion"), nuevaPeticion);
      alert("¡Petición creada exitosamente!");

      // Redirigir a GenerarPeticion.jsx con la petición creada
      navigate("/generar-peticion", { state: { peticion: nuevaPeticion } });
    } catch (error) {
      console.error("Error al crear la petición:", error);
      alert("Hubo un error al crear la petición. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="contenedor-mapview">
      <header className="header-mapview">
        <button className="header-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="header-title">{provider.nombreEmpresa}</h1>
      </header>

      <div className="provider-details">
        <h2>Información del Proveedor</h2>
        <p>
          <strong>Dirección:</strong> {provider.direccion}
        </p>
        <p>
          <strong>Celular:</strong> {provider.celular}
        </p>
        <p>
          <strong>Descripción del servicio:</strong> {provider.descripcionServicio}
        </p>
        <p>
          <strong>Horario de atención:</strong> {provider.horarioAtencion}
        </p>
      </div>

      <div className="services-header">
        <h2>Servicios Disponibles</h2>
      </div>
      <div className="services-grid">
        {servicios.map((servicio) => (
          <div className="service-card" key={servicio.id}>
            <h3>{servicio.nombre}</h3>
            <p>
              <strong>Precio:</strong> ${servicio.precio}
            </p>
            <p>
              <strong>Descripción:</strong> {servicio.descripcion}
            </p>
            <button className="accept-button" onClick={() => crearPeticion(servicio)}>
              Aceptar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;
