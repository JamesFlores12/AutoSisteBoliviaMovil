import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../credenciales";
import { useNavigate } from "react-router-dom";
import "./EstadoPeticiones.css"; // Agrega estilos si los necesitas

const EstadoPeticiones = () => {
  const [peticionesPendientes, setPeticionesPendientes] = useState([]); // Lista de peticiones pendientes
  const navigate = useNavigate();

  const usuarioAutenticado = "usuarioEjemplo@gmail.com"; // Usuario autenticado

  useEffect(() => {
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
        const pendientes = fetchedPeticiones.filter(
          (peticion) => peticion.estado === "Pendiente"
        );

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
  }, [navigate, usuarioAutenticado]);

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
          </div>
        ))
      ) : (
        <p>No tienes peticiones pendientes.</p>
      )}
    </div>
  );
};

export default EstadoPeticiones;
