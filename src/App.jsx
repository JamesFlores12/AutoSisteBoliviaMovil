import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import LoginScreen from './assets/components/LoginScreen';
import RegisterScreen from './assets/components/RegisterScreen';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
      <Route path="/" element={<LoginScreen/>} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen/>} />
      </Routes>
      </Router>
  )
}

export default App
