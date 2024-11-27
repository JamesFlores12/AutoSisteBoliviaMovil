import React, { useEffect, useState } from "react";
import axios from "axios";

const Location = () => {
  const [location, setLocation] = useState("Obteniendo ubicación...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async (latitude, longitude) => {
      try {

        const apiKey = "AIzaSyDlyKmoYGs3Wxmr3wBLWRJ2JikspQ7sqyk"; // Reemplaza con tu API Key


        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        const response = await axios.get(url);

        if (response.data.results.length > 0) {
          const formattedAddress = response.data.results[0].formatted_address;
          setLocation(formattedAddress);
        } else {
          setLocation("No se encontró una dirección para estas coordenadas.");
        }
      } catch (err) {
        setError("Error al conectar con la API de Google.");
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocation(latitude, longitude);
        },
        () => {
          setError("No se pudo obtener la ubicación.");
        }
      );
    } else {
      setError("La API de geolocalización no está soportada en este navegador.");
    }
  }, []);

  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>{location}</p>
      )}
    </div>
  );
};

export default Location;
