import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../credenciales"; // Conexión a Firebase
import { useNavigate } from "react-router-dom";
import "./PagoServicio.css";

const PagoServicio = () => {
  const [peticionEnProceso, setPeticionEnProceso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tarjeta, setTarjeta] = useState({
    numero: "",
    fechaExpiracion: "",
    tipo: "",
  });
  const [userEmail, setUserEmail] = useState(null); // Estado para almacenar el correo del usuario autenticado
  const [userExists, setUserExists] = useState(false); // Verifica si el usuario pertenece a la colección Usuario

  const navigate = useNavigate();

  // Verificar el usuario autenticado y que esté en la colección Usuario
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        setUserEmail(email);

        // Verificar si el correo pertenece a la colección Usuario
        try {
          const usuarioSnapshot = await verificarUsuarioEnColeccion(email);
          if (usuarioSnapshot) {
            setUserExists(true); // Usuario existe en la colección Usuario
          } else {
            alert("El usuario no está registrado en la colección Usuario.");
            navigate("/login");
          }
        } catch (error) {
          console.error("Error al verificar el usuario:", error);
          navigate("/login");
        }
      } else {
        alert("Usuario no autenticado. Por favor, inicia sesión.");
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const verificarUsuarioEnColeccion = async (email) => {
    try {
      const usuariosRef = collection(db, "Usuario");
      const q = query(usuariosRef, where("email", "==", email)); // Buscar por email
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty; // Retorna true si existe un documento
    } catch (error) {
      console.error("Error al verificar en la colección Usuario:", error);
      return false;
    }
  };

  // Obtener la petición en progreso para el usuario autenticado
  useEffect(() => {
    if (userExists) {
      const fetchPeticionEnProceso = async () => {
        setLoading(true);
        try {
          const peticionesRef = collection(db, "Peticion");
          const q = query(
            peticionesRef,
            where("usuario", "==", userEmail), // Verificar peticiones para el correo del usuario autenticado
            where("estado", "==", "En Progreso")
          );

          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const peticion = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))[0];

            setPeticionEnProceso(peticion);
          } else {
            setPeticionEnProceso(null);
          }
        } catch (error) {
          console.error("Error al obtener la petición en progreso:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPeticionEnProceso();
    }
  }, [userEmail, userExists]);

  const handleConfirmarPago = async () => {
    if (!peticionEnProceso) return;

    try {
      const pagoData = {
        fecha: new Date().toLocaleString(),
        idSolicitud: peticionEnProceso.id,
        monto: peticionEnProceso.precio,
        proveedor: peticionEnProceso.proveedor,
        usuario: userEmail, // Usar el correo del usuario autenticado
      };

      const metodoPagoData = {
        Numero_tarjeta: tarjeta.numero,
        Fecha_expiracion: tarjeta.fechaExpiracion,
        Tipo_Tarjeta: tarjeta.tipo,
      };

      // Guardar en las colecciones "Pago" y "Metodo_Pago"
      await addDoc(collection(db, "Pago"), pagoData);
      await addDoc(collection(db, "Metodo_Pago"), metodoPagoData);

      // Cambiar el estado de la petición a "Pagado"
      const peticionRef = doc(db, "Peticion", peticionEnProceso.id);
      await updateDoc(peticionRef, { estado: "Pagado" });

      alert("¡Pago confirmado con éxito!");

      // Redirigir al componente del mapa después del pago
      navigate("/ruta-mapa", {
        state: {
          userLocation: {
            lat: peticionEnProceso.ubicacion.latitud,
            lng: peticionEnProceso.ubicacion.longitud,
          },
          providerLocation: peticionEnProceso.proveedorUbicacion, // Asegúrate de tener este campo en Firestore
        },
      });
    } catch (error) {
      console.error("Error al confirmar el pago:", error);
      alert("Hubo un error al realizar el pago.");
    }
  };

  const handleNumeroTarjeta = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Permitir solo números
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Formato de 4 dígitos separados por espacios
    setTarjeta({ ...tarjeta, numero: formatted });
  };

  const handleFechaExpiracion = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Permitir solo números
    const formatted = value
      .replace(/(\d{2})(\d{1,2})/, "$1/$2") // Formato MM/AA
      .slice(0, 5); // Limitar a 5 caracteres
    setTarjeta({ ...tarjeta, fechaExpiracion: formatted });
  };

  const isFormularioValido =
    tarjeta.numero.replace(/\s/g, "").length === 16 &&
    tarjeta.fechaExpiracion.length === 5 &&
    tarjeta.tipo !== "";

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

        <h3>Información de la Tarjeta</h3>
        <form className="payment-form">
          <input
            type="text"
            placeholder="Número de tarjeta (16 dígitos)"
            maxLength={19}
            value={tarjeta.numero}
            onChange={handleNumeroTarjeta}
          />
          <input
            type="text"
            placeholder="Fecha de vencimiento (MM/AA)"
            maxLength={5}
            value={tarjeta.fechaExpiracion}
            onChange={handleFechaExpiracion}
          />
          <select
            value={tarjeta.tipo}
            onChange={(e) => setTarjeta({ ...tarjeta, tipo: e.target.value })}
          >
            <option value="">Selecciona el tipo de tarjeta</option>
            <option value="Débito">Tarjeta de Débito</option>
            <option value="Crédito">Tarjeta de Crédito</option>
          </select>
        </form>
        <button
          className={`confirm-payment-button ${
            !isFormularioValido ? "disabled" : ""
          }`}
          onClick={handleConfirmarPago}
          disabled={!isFormularioValido}
        >
          Confirmar Pago
        </button>
      </div>
    </div>
  );
};

export default PagoServicio;
