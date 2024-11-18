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

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
      <Route path="/" element={<LoginScreen/>} />
      <Route path="/register" element={<RegisterScreen/>} />
      <Route path="/home" element={<HomeScreen/>} />
      <Route path="/profile" element={<PerfilScreen/>} />
      <Route path="/historial" element={<HistorialScreen/>} />
      </Routes>
      </Router>
  )
}

export default App
