import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../credenciales"; // Conexión a Firebase
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./EstadoPeticiones.css";

const EstadoPeticiones = () => {
  const [peticionesPendientes, setPeticionesPendientes] = useState([]); // Lista de peticiones pendientes
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null); // Usuario autenticado
  const navigate = useNavigate();

  // Obtener usuario autenticado
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioAutenticado(user.email); // Establece el correo del usuario autenticado
      } else {
        console.log("Usuario no autenticado. Redirigiendo...");
        navigate("/login"); // Redirigir al login si no hay usuario autenticado
      }
    });

    return () => unsubscribeAuth(); // Limpiar la suscripción de autenticación
  }, [navigate]);

  // Cargar peticiones pendientes desde Firestore
  useEffect(() => {
    if (!usuarioAutenticado) return; // No cargues si no hay usuario autenticado

    const peticionesRef = collection(db, "Peticion");
    const q = query(peticionesRef, where("usuario", "==", usuarioAutenticado)); // Filtrar por usuario autenticado

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedPeticiones = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filtrar solo peticiones pendientes
        const pendientes = fetchedPeticiones.filter((peticion) => peticion.estado === "Pendiente");
        setPeticionesPendientes(pendientes);

        // Si no hay peticiones pendientes, redirigir a la página de pagos
        if (pendientes.length === 0) {
          console.log("No hay peticiones pendientes. Redirigiendo a PagoServicio.");
          navigate(`/pagoServicio`);
        }
      },
      (error) => {
        console.error("Error al obtener las peticiones:", error);
      }
    );

    return () => unsubscribe(); // Limpiar la suscripción
  }, [usuarioAutenticado, navigate]);

  // Cancelar una petición
  const cancelarPeticion = async (id) => {
    try {
      const peticionRef = doc(db, "Peticion", id); // Referencia a la petición en Firestore
      await updateDoc(peticionRef, { estado: "Cancelada" }); // Cambiar el estado a "Cancelada"
      alert("Petición cancelada exitosamente.");
    } catch (error) {
      console.error("Error al cancelar la petición:", error);
      alert("Hubo un problema al cancelar la petición.");
    }
  };

  return (
    <div className="estado-container">
      <h1>Mis Peticiones</h1>
      {peticionesPendientes.length > 0 ? (
        peticionesPendientes.map((peticion) => (
          <div key={peticion.id} className="estado-card">
            <h3>{peticion.servicio}</h3>
            <p>
              <strong>Estado:</strong> {peticion.estado}
            </p>
            <p>
              <strong>Proveedor:</strong> {peticion.proveedor}
            </p>
            <p>
              <strong>Precio:</strong> Bs{peticion.precio}
            </p>
            <button
              className="cancel-button"
              onClick={() => cancelarPeticion(peticion.id)} // Manejar cancelación
            >
              Cancelar
            </button>
          </div>
        ))
      ) : (
        <p>No tienes peticiones pendientes.</p>
      )}
    </div>
  );
};

export default EstadoPeticiones;
