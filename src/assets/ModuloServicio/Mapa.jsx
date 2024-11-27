import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

const Mapa = () => {
  const [location, setLocation] = useState(null); // Coordenadas del usuario
  const [address, setAddress] = useState("Obteniendo dirección..."); // Dirección del usuario
  const [error, setError] = useState(null); // Manejo de errores

  // Obtiene la ubicación del usuario al cargar el componente
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitud: ${latitude}, Longitud: ${longitude}`);
          setLocation({ lat: latitude, lng: longitude }); // Establece las coordenadas
          await fetchAddress(latitude, longitude); // Obtiene la dirección
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

  // Función para obtener la dirección usando la API de Google Geocoding
  const fetchAddress = async (latitude, longitude) => {
    try {
      const apiKey = "AIzaSyDlyKmoYGs3Wxmr3wBLWRJ2JikspQ7sqyk"; // Tu API Key
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
      console.log(`Consultando Geocoding API con: ${url}`);
      const response = await axios.get(url);

      if (response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setAddress(formattedAddress); // Actualiza la dirección en el estado
      } else {
        setAddress("No se encontró una dirección para esta ubicación.");
      }
    } catch (error) {
      console.error("Error al conectar con la API de Geocoding:", error);
      setAddress("Error al obtener la dirección.");
    }
  };

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>{error}</p> // Muestra un mensaje de error si algo falla
      ) : (
        <>
          <p>
            <strong>Dirección:</strong> {address}
          </p>
          {location ? (
            <LoadScript googleMapsApiKey="AIzaSyDlyKmoYGs3Wxmr3wBLWRJ2JikspQ7sqyk">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={location} // Centra el mapa en las coordenadas del usuario
                zoom={15} // Nivel de zoom del mapa
              >
                {/* Marcador en la ubicación actual */}
                <Marker position={location} />
              </GoogleMap>
            </LoadScript>
          ) : (
            <p>Cargando tu ubicación...</p> // Muestra un mensaje mientras obtenemos la ubicación
          )}
        </>
      )}
    </div>
  );
};

export default Mapa;
