import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoadScriptNext } from '@react-google-maps/api'; // Cargar el script de Google Maps
import './App.css';

// Componentes Importados
import LoginScreen from './assets/components/LoginScreen';
import RegisterScreen from './assets/components/RegisterScreen';
import HomeScreen from './assets/components/HomeScreen';
import PerfilScreen from './assets/components/PerfilScreen';
import HistorialScreen from './assets/components/HistorialScreen';
import ModuloServicio from './assets/ModuloServicio/ModuloServicio';
import GenerarPeticion from './assets/ModuloServicio/GenerarPeticion';
import EstadoPeticiones from './assets/ModuloServicio/EstadoPeticiones';
import PagoServicio from './assets/ModuloServicio/PagoServicio';
import Mapa from './assets/ModuloServicio/Mapa';
import MapView from './assets/ModuloServicio/MapView';
import MapaRuta from './assets/ModuloServicio/MapaRuta';


function App() {
  // Clave de la API de Google Maps
  const googleMapsApiKey = 'AIzaSyDlyKmoYGs3Wxmr3wBLWRJ2JikspQ7sqyk';

  return (
    // Envolvemos toda la aplicación con LoadScriptNext
    <LoadScriptNext googleMapsApiKey={googleMapsApiKey}>
      <Router>
        <Routes>
          {/* Definición de rutas */}
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/profile" element={<PerfilScreen />} />
          <Route path="/historial" element={<HistorialScreen />} />
          <Route path="/services" element={<ModuloServicio />} />
          <Route path="/generar-peticion" element={<GenerarPeticion />} />
          <Route path="/estado-peticiones" element={<EstadoPeticiones />} />
          <Route path="/pagoServicio" element={<PagoServicio />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/map-view" element={<MapView />} />
          <Route path="/ruta-mapa" element={<MapaRuta/>} />

        </Routes>
      </Router>
    </LoadScriptNext>
  );
}

export default App;
