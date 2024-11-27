import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firebase Firestore
import { onAuthStateChanged } from "firebase/auth"; // Para manejar la autenticación
import { db, auth } from "../../credenciales"; // Conexión a Firebase
import "./MapView.css";

const MapView = ({ serviceType, goBack }) => {
  const [providers, setProviders] = useState([]);
  const [userEmail, setUserEmail] = useState(null); // Estado para almacenar el correo del usuario autenticado
  const [error, setError] = useState(null);

  // Obtenemos el correo del usuario autenticado
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Guardar el correo del usuario autenticado
      } else {
        console.log("Usuario no autenticado.");
        setError("Usuario no autenticado. Por favor, inicia sesión.");
      }
    });

    return () => unsubscribeAuth(); // Limpiar la suscripción
  }, []);

  // Cargar los proveedores desde Firebase
  useEffect(() => {
    if (!userEmail) return; // No ejecutamos la consulta si no tenemos un usuario autenticado

    const fetchProviders = async () => {
      try {
        const providersRef = collection(db, "proveedores");
        const q = query(providersRef, where("tipoServicio", "==", serviceType));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("No se encontraron proveedores para este servicio.");
        } else {
          const providersData = querySnapshot.docs.map((doc) => doc.data());
          setProviders(providersData);
        }
      } catch (err) {
        console.error("Error al cargar los proveedores:", err);
        setError("Hubo un problema al cargar los proveedores.");
      }
    };

    fetchProviders();
  }, [serviceType, userEmail]);

  // Renderizar el mapa cuando los proveedores estén disponibles
  useEffect(() => {
    if (providers.length > 0) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: -16.5, lng: -68.15 }, // Latitud y longitud inicial
        zoom: 12,
      });

      // Agregar marcadores al mapa
      providers.forEach((provider) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(provider.latitud),
            lng: parseFloat(provider.longitud),
          },
          map: map,
          title: provider.nombreEmpresa,
        });

        // Información adicional en cada marcador
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<h4>${provider.nombreEmpresa}</h4><p>${provider.descripcionServicio}</p><p>${provider.direccion}</p>`,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, [providers]);

  return (
    <div className="map-container">
      <button className="back-button" onClick={goBack}>
        ← Volver
      </button>
      {error && <p className="error">{error}</p>}
      <div id="map" className="map"></div>
    </div>
  );
};

export default MapView;
