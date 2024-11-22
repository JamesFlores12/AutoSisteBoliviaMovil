import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ModuloServicio from './assets/ModuloServicio/ModuloServicio.jsx'
import EstadoPeticiones from './assets/ModuloServicio/EstadoPeticiones.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)
