import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import LoginScreen from "./assets/components/LoginScreen";
import RegisterScreen from "./assets/components/RegisterScreen";
import GenerarPeticion from "./assets/ModuloServicio/GenerarPeticion";
import ModuloServicio from "./assets/ModuloServicio/ModuloServicio";
import EstadoPeticiones from "./assets/ModuloServicio/EstadoPeticiones";
import PagoServicio from "./assets/ModuloServicio/PagoServicio";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ModuloServicio />} />
        <Route path="/generar-peticion" element={<GenerarPeticion />} />
        <Route path="/estado-peticiones" element={<EstadoPeticiones />} />
        <Route path="/pagoServicio" element={<PagoServicio/>} />
        {/* Redirección predeterminada */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
