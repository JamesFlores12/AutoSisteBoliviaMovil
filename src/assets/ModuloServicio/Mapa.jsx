import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../credenciales";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


const Mapa = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]); // Almacenar los servicios
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceType } = location.state || {};

  // Obtener la ubicación del usuario
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Error al obtener la ubicación:", err);
          setError("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      setError("La geolocalización no es soportada por este navegador.");
    }
  }, []);

  // Convertir direcciones a coordenadas
  const getCoordinatesFromAddress = async (address) => {
    const apiKey = "AIzaSyDlyKmoYGs3Wxmr3wBLWRJ2JikspQ7sqyk";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address + ", La Paz, Bolivia"
    )}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const results = response.data.results;

      if (results.length > 0) {
        const { lat, lng } = results[0].geometry.location;
        return { lat, lng };
      } else {
        console.warn(`No se encontraron coordenadas para la dirección: ${address}`);
        return null;
      }
    } catch (error) {
      console.error("Error al convertir dirección a coordenadas:", error);
      return null;
    }
  };

  // Obtener los proveedores
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providersRef = collection(db, "proveedores");
        const q = query(providersRef, where("tipoServicio", "==", serviceType));
        const querySnapshot = await getDocs(q);

        const fetchedProviders = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const providerData = doc.data();
            const nombreEmpresa = providerData.nombreEmpresa || "Proveedor desconocido";
            const direccion = providerData.direccion || "Dirección no disponible";
            let ubicacion = providerData.ubicacion || null;

            if (!ubicacion) {
              ubicacion = await getCoordinatesFromAddress(direccion);
            }

            return { id: doc.id, nombreEmpresa, direccion, ubicacion, ...providerData };
          })
        );

        setProviders(fetchedProviders.filter((p) => p.ubicacion !== null));
      } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
        setError("No se pudo obtener los datos de Firestore.");
      }
    };

    if (serviceType) {
      fetchProviders();
    }
  }, [serviceType]);

  // Obtener los servicios de la base de datos
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesSnapshot = await getDocs(collection(db, "Servicios"));
        const fetchedServices = servicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {/* Encabezado */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#f9a825",
          color: "white",
          display: "flex",
          alignItems: "center",
          padding: "10px 15px",
          zIndex: 1,
        }}
      >
        <button
          style={{
            backgroundColor: "white",
            color: "#f9a825",
            border: "none",
            borderRadius: "50%",
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <h2 style={{ margin: 0, fontSize: "18px" }}>Proveedores de {serviceType}</h2>
      </header>

      {/* Mapa */}
      <div style={{ height: "100%", width: "100%" }}>
        {error ? (
          <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{error}</p>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={userLocation || { lat: -16.533, lng: -68.117 }}
            zoom={14}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                label="Tú estás aquí"
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            )}
            {providers.map((provider) => {
              const filteredServices = services.filter(
                (service) => service.email === provider.email
              );

              return (
                <Marker
                  key={provider.id}
                  position={provider.ubicacion}
                  label={provider.nombreEmpresa}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() =>
                    navigate("/map-view", {
                      state: { provider, servicios: filteredServices, userLocation }, // Paso de userLocation
                    })
                  }
                />
              );
            })}
          </GoogleMap>
        )}
      </div>
    </div>
  );
};

export default Mapa;