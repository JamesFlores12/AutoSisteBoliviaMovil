
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import LoginScreen from './assets/components/LoginScreen';
import RegisterScreen from './assets/components/RegisterScreen';
import HomeScreen from './assets/components/HomeScreen';
import PerfilScreen from './assets/components/PerfilScreen';
import HistorialScreen from './assets/components/HistorialScreen';
import ModuloServicio from './assets/ModuloServicio/ModuloServicio';
import GenerarPeticion from './assets/ModuloServicio/GenerarPeticion';
import EstadoPeticiones from './assets/ModuloServicio/EstadoPeticiones';
import PagoServicio from './assets/ModuloServicio/PagoServicio';



function App() {
  return (
    <Router>
      <Routes>

      <Route path="/" element={<LoginScreen/>} />
      <Route path="/register" element={<RegisterScreen/>} />
      <Route path="/home" element={<HomeScreen/>} />
      <Route path="/profile" element={<PerfilScreen/>} />
      <Route path="/historial" element={<HistorialScreen/>} />
      <Route path="/services" element={<ModuloServicio/>} />
      <Route path="/generar-peticion" element={<GenerarPeticion/>} />
      <Route path="/estado-peticiones" element={<EstadoPeticiones/>} />
      <Route path="/pagoServicio" element={<PagoServicio/>} />
      
       
      </Routes>
    </Router>
  );
}

export default App;
