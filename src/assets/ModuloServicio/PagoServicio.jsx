import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../credenciales"; // Asegúrate de que la conexión esté correcta
import "./PagoServicio.css";

const PagoServicio = () => {
  const [peticionEnProceso, setPeticionEnProceso] = useState(null); // Petición en proceso
  const [loading, setLoading] = useState(true); // Estado de carga
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null); // Correo del usuario autenticado

  // Obtener el correo del usuario autenticado
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioAutenticado(user.email); // Guardar el correo del usuario autenticado
      } else {
        console.error("Usuario no autenticado. Redirigiendo...");
        setUsuarioAutenticado(null); // Si no está autenticado, limpiar el estado
      }
    });

    return () => unsubscribeAuth(); // Limpiar la suscripción
  }, []);

  // Cargar la petición en progreso desde Firestore
  useEffect(() => {
    const fetchPeticionEnProceso = async () => {
      if (!usuarioAutenticado) return; // No realizar la consulta si no hay usuario autenticado

      setLoading(true);
      try {
        const peticionesRef = collection(db, "Peticion");
        const q = query(
          peticionesRef,
          where("usuario", "==", usuarioAutenticado),
          where("estado", "==", "En progreso")
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const peticion = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))[0]; // Obtener la primera petición en progreso

          setPeticionEnProceso(peticion);
        } else {
          setPeticionEnProceso(null); // No hay datos
        }
      } catch (error) {
        console.error("Error al obtener la petición en progreso:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeticionEnProceso();
  }, [usuarioAutenticado]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando información...</p>
      </div>
    );
  }

  if (!usuarioAutenticado) {
    return (
      <div className="error-container">
        <p>No se detectó un usuario autenticado. Por favor, inicia sesión.</p>
      </div>
    );
  }

  if (!peticionEnProceso) {
    return (
      <div className="error-container">
        <p>No hay peticiones en progreso actualmente.</p>
      </div>
    );
  }

  const { servicio, proveedor, precio } = peticionEnProceso;

  return (
    <div className="pago-container">
      <div className="pago-header">
        <h1>Confirma tu Pago</h1>
      </div>
      <div className="pago-card">
        <h2>Detalle del Servicio</h2>
        <p>
          <strong>Servicio:</strong> {servicio}
        </p>
        <p>
          <strong>Proveedor:</strong> {proveedor}
        </p>
        <p>
          <strong>Total a pagar:</strong> Bs{precio}
        </p>
        <button
          className="confirm-payment-button"
          onClick={() => alert("¡Pago confirmado con éxito!")}
        >
          Confirmar Pago
        </button>
      </div>
    </div>
  );
};

export default PagoServicio;
