import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../credenciales";

const MapaRuta = () => {
  const [userEmail, setUserEmail] = useState(null); // Estado para almacenar el correo del usuario autenticado
  const [userExists, setUserExists] = useState(false); // Verifica si el usuario está en la colección Usuario
  const [userLocation, setUserLocation] = useState(null); // Ubicación del usuario
  const [providerLocation, setProviderLocation] = useState(null); // Ubicación del proveedor
  const [error, setError] = useState(null); // Manejo de errores

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDlyKmoYGs3Wxmr3wBLWRJ2JikspQ7sqyk", // Asegúrate de reemplazar con tu clave válida
  });

  // Verificar el usuario autenticado y que esté en la colección Usuario
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        setUserEmail(email);

        // Verificar si el correo pertenece a la colección Usuario
        try {
          const userSnapshot = await verificarUsuarioEnColeccion(email);
          if (userSnapshot) {
            setUserExists(true); // Usuario existe en la colección Usuario
          } else {
            alert("El usuario no está registrado en la colección Usuario.");
            setError("El usuario no está registrado en la colección Usuario.");
          }
        } catch (error) {
          console.error("Error al verificar el usuario:", error);
          setError("No se pudo verificar al usuario.");
        }
      } else {
        setError("Usuario no autenticado. Por favor, inicia sesión.");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const verificarUsuarioEnColeccion = async (email) => {
    try {
      const userRef = collection(db, "Usuario");
      const q = query(userRef, where("email", "==", email)); // Buscar en la colección Usuario por el campo email
      const userSnapshot = await getDocs(q);
      return !userSnapshot.empty; // Retorna true si existe un documento
    } catch (error) {
      console.error("Error al verificar en la colección Usuario:", error);
      return false;
    }
  };

  // Obtener ubicación del usuario
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Error al obtener la ubicación del usuario:", err);
          setError("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      setError("La geolocalización no es soportada por este navegador.");
    }
  }, []);

  // Obtener ubicación del proveedor
  useEffect(() => {
    if (userExists) {
      const fetchProviderLocation = async () => {
        try {
          const peticionesRef = collection(db, "Peticion");
          const q = query(peticionesRef, where("usuario", "==", userEmail), where("estado", "==", "Pagado"));
          const peticionSnapshot = await getDocs(q);

          if (peticionSnapshot.empty) {
            console.warn("No se encontró ninguna petición con estado 'Pagado'.");
            return;
          }

          const peticionData = peticionSnapshot.docs[0].data();
          const correoProveedor = peticionData.correoProveedor;

          const proveedoresRef = collection(db, "proveedores");
          const qProveedor = query(proveedoresRef, where("email", "==", correoProveedor));
          const proveedorSnapshot = await getDocs(qProveedor);

          if (proveedorSnapshot.empty) {
            console.warn(`No se encontró ningún proveedor con el correo: ${correoProveedor}`);
            return;
          }

          const proveedorData = proveedorSnapshot.docs[0].data();
          const direccion = proveedorData.direccion;

          const apiKey = "AIzaSyDlyKmoYGs3Wxmr3wBLWRJ2JikspQ7sqyk";
          const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            direccion
          )}&key=${apiKey}`;
          const response = await axios.get(url);

          if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry.location;
            setProviderLocation({ lat, lng });
          } else {
            console.warn(`No se encontraron coordenadas para la dirección: ${direccion}`);
          }
        } catch (error) {
          console.error("Error al obtener la ubicación del proveedor:", error);
          setError("No se pudo obtener la ubicación del proveedor.");
        }
      };

      fetchProviderLocation();
    }
  }, [userEmail, userExists]);

  if (!isLoaded) return <p>Cargando mapa...</p>;

  if (!userLocation || !providerLocation) {
    return <p>No se pudo obtener las ubicaciones necesarias para mostrar la ruta.</p>;
  }

  const bounds = new window.google.maps.LatLngBounds();
  bounds.extend(userLocation);
  bounds.extend(providerLocation);

  const center = bounds.getCenter().toJSON();
  const path = [userLocation, providerLocation];

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "500px" }}
      center={center}
      zoom={12}
    >
      {/* Marcador del usuario */}
      <Marker
        position={userLocation}
        label="Tú estás aquí"
        icon={{
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />

      {/* Marcador del proveedor */}
      <Marker
        position={providerLocation}
        label="Proveedor"
        icon={{
          url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />

      {/* Línea entre las ubicaciones */}
      <Polyline path={path} options={{ strokeColor: "#FF0000", strokeWeight: 4 }} />
    </GoogleMap>
  );
};

export default MapaRuta;
