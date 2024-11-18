import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firebase Firestore
import { db } from "../../credenciales"; // Conexión a Firebase
import "./MapView.css";

const MapView = ({ serviceType, goBack }) => {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);

  // Cargar los proveedores desde Firebase
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providersRef = collection(db, "proveedores");
        const q = query(providersRef, where("tipoServicio", "==", serviceType));
        const querySnapshot = await getDocs(q);

        const providersData = querySnapshot.docs.map((doc) => doc.data());
        setProviders(providersData);
      } catch (err) {
        setError("Error al cargar los proveedores.");
      }
    };

    fetchProviders();
  }, [serviceType]);

  // Renderizar el mapa cuando los proveedores estén disponibles
  useEffect(() => {
    if (providers.length > 0) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: -16.5, lng: -68.15 }, // Latitud y longitud inicial (puedes cambiarlo según tu región)
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
