import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../credenciales"; // Asegúrate de que la conexión esté correcta
import "./PagoServicio.css";

const PagoServicio = () => {
  const [peticionEnProceso, setPeticionEnProceso] = useState(null); // Petición en proceso
  const [loading, setLoading] = useState(true); // Estado de carga

  const usuarioAutenticado = "usuarioEjemplo@gmail.com"; // Usuario autenticado

  useEffect(() => {
    const fetchPeticionEnProceso = async () => {
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
