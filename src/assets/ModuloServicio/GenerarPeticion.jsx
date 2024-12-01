import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../credenciales";

const GenerarPeticion = () => {
  const [peticiones, setPeticiones] = useState([]); // Estado para almacenar las peticiones
  const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null); // Estado para el correo del usuario autenticado
  const [esUsuarioValido, setEsUsuarioValido] = useState(false); // Validar si el usuario pertenece a la colección `Usuario`
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado y pertenece a la colección `Usuario`
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;

        try {
          // Verificar en la colección `Usuario` si el correo existe
          const userRef = collection(db, "Usuario");
          const q = query(userRef, where("email", "==", email));
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            setUsuarioAutenticado(email); // Establece el correo del usuario autenticado
            setEsUsuarioValido(true); // Usuario válido
          } else {
            console.error("El usuario no está registrado en la colección Usuario.");
            alert("El usuario no está registrado en la colección Usuario.");
            setEsUsuarioValido(false);
            navigate("/login"); // Redirige al login si no está registrado
          }
        } catch (error) {
          console.error("Error al verificar en la colección Usuario:", error);
          alert("Hubo un error al verificar el usuario. Intenta nuevamente.");
          navigate("/login");
        }
      } else {
        console.log("Usuario no autenticado. Redirigiendo...");
        navigate("/login"); // Redirige al login si no hay un usuario autenticado
      }
    });

    return () => unsubscribeAuth(); // Limpiar la suscripción de autenticación
  }, [navigate]);

  // Función para cargar las peticiones en tiempo real
  useEffect(() => {
    if (!usuarioAutenticado || !esUsuarioValido) return; // Espera hasta que el correo esté disponible y sea válido

    const fetchPeticiones = () => {
      try {
        const peticionesRef = collection(db, "Peticion");
        const q = query(peticionesRef, where("usuario", "==", usuarioAutenticado));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedPeticiones = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPeticiones(fetchedPeticiones);

          // Verificar si alguna petición cambió a "En proceso"
          const enProceso = fetchedPeticiones.find((peticion) => peticion.estado === "En proceso");
          if (enProceso) {
            console.log("Cambio detectado a 'En proceso'. Redirigiendo a PagoServicio...");
            navigate("/pagoServicio"); // Redirigir automáticamente a PagoServicio
          }

          setLoading(false);
        });

        return unsubscribe; // Cleanup
      } catch (err) {
        console.error("Error al obtener las peticiones:", err);
        setError("Hubo un error al cargar las peticiones. Intenta nuevamente.");
        setLoading(false);
      }
    };

    fetchPeticiones();
  }, [usuarioAutenticado, esUsuarioValido, navigate]);

  // Función para cancelar una petición
  const cancelarPeticion = async (id) => {
    try {
      const peticionRef = doc(db, "Peticion", id);
      await updateDoc(peticionRef, { estado: "Cancelado" });
      alert("Petición cancelada exitosamente.");
    } catch (err) {
      console.error("Error al cancelar la petición:", err);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", color: "#FFD700" }}>Cargando peticiones...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  if (!esUsuarioValido) {
    return <p>Verificando usuario...</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#FFD700" }}>Mis Peticiones</h1>
      {peticiones.length === 0 ? (
        <p style={{ textAlign: "center", color: "#FF6347" }}>No tienes peticiones pendientes.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {peticiones.map((peticion) => (
            <div
              key={peticion.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "20px",
                backgroundColor: "#1E1E2F",
                color: "#FFFFFF",
              }}
            >
              <h3 style={{ color: "#FFD700" }}>{peticion.servicio}</h3>
              <p>
                <strong>Proveedor:</strong> {peticion.proveedor}
              </p>
              <p>
                <strong>Precio:</strong> ${peticion.precio}
              </p>
              <p>
                <strong>Fecha:</strong> {peticion.fecha}
              </p>
              <p>
                <strong>Hora:</strong> {peticion.hora}
              </p>
              <p>
                <strong>Estado:</strong> {peticion.estado}
              </p>
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => cancelarPeticion(peticion.id)}
                  style={{
                    padding: "10px",
                    backgroundColor: "#FF6347",
                    border: "none",
                    borderRadius: "5px",
                    color: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenerarPeticion;
