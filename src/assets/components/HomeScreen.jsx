import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import appFirebase from "../../credenciales";
import {
  FaHome,
  FaTools,
  FaReceipt,
  FaUser,
  FaSearch,
} from "react-icons/fa";
import Modal from "react-modal"; // Importación de Modal

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const HomeScreen = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Estados para el filtrado
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    tipoServicio: "",
    nombreEmpresa: "",
  });

  // Estados para calificaciones y reseñas
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    calificacion: "",
    comentario: "",
    fecha: "",
    nombreEmpresa: "",
    tipoServicio: "",
  });

  // Cargar datos desde Firestore
  useEffect(() => {
    const fetchProviders = async () => {
      const querySnapshot = await getDocs(collection(db, "proveedores"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setProviders(data);
    };

    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, "Calificaciones_Reseñas"));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setReviews(data);
    };

    fetchProviders();
    fetchReviews();
  }, []);

  // Aplicar filtros en el modal de búsqueda
  const applyFilters = () => {
    let results = providers;
    if (searchFilters.tipoServicio) {
      results = results.filter((provider) =>
        provider.tipoServicio
          .toLowerCase()
          .includes(searchFilters.tipoServicio.toLowerCase())
      );
    }
    if (searchFilters.nombreEmpresa) {
      results = results.filter((provider) =>
        provider.nombreEmpresa
          .toLowerCase()
          .includes(searchFilters.nombreEmpresa.toLowerCase())
      );
    }
    setFilteredProviders(results);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters({ ...searchFilters, [name]: value });
  };

  const handleAddReview = async () => {
    if (
      newReview.calificacion &&
      newReview.comentario &&
      newReview.fecha &&
      newReview.nombreEmpresa &&
      newReview.tipoServicio
    ) {
      await addDoc(collection(db, "Calificaciones_Reseñas"), newReview);
      setReviews((prev) => [...prev, newReview]);
      setNewReview({
        calificacion: "",
        comentario: "",
        fecha: "",
        nombreEmpresa: "",
        tipoServicio: "",
      });
      alert("¡Reseña guardada con éxito!");
    } else {
      alert("Por favor completa todos los campos.");
    }
  };

  const renderStars = (rating) => {
    return (
      <>
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} style={{ color: index < rating ? "#FFD700" : "#E0E0E0" }}>
            ⭐
          </span>
        ))}
      </>
    );
  };

  const handleNavigation = (index) => {
    setSelectedIndex(index);
    if (index === 0) navigate("/home");
    if (index === 1) navigate("/services");
    if (index === 2) navigate("/historial");
    if (index === 3) navigate("/profile");
  };

  return (
    <div style={{ backgroundColor: "#1E1E2C", minHeight: "100vh", color: "white" }}>
      {/* Header */}
      <div
        style={{
          height: "35vh",
          background: "linear-gradient(to bottom, #1E1E2C, #FBC02D)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Bienvenido a</h1>
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#FBC02D",
            letterSpacing: "2px",
          }}
        >
          AUTOSISTE BOLIVIA
        </h2>
      </div>

      {/* Barra de búsqueda */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Buscar servicios, repuestos, mecánicos..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
          />
          <FaSearch
            onClick={() => setIsSearchOpen(true)}
            style={{
              marginLeft: "10px",
              cursor: "pointer",
              fontSize: "20px",
              color: "white",
            }}
          />
        </div>
      </div>

      {/* Calificaciones y Reseñas */}
      <div>
        <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>Calificaciones y Reseñas</h3>
        <div style={{ marginBottom: "20px" }}>
          {reviews.map((review, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#FFF",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <p style={{ margin: "0", fontWeight: "bold" }}>
                Empresa: {review.nombreEmpresa} <br />
                Servicio: {review.tipoServicio}
              </p>
              <div style={{ fontSize: "16px" }}>{renderStars(Number(review.calificacion))}</div>
              <p style={{ margin: "0", fontSize: "14px" }}>Comentario: {review.comentario}</p>
              <p style={{ margin: "0", fontSize: "12px", color: "gray" }}>Fecha: {review.fecha}</p>
            </div>
          ))}
        </div>

        {/* Formulario de Nueva Reseña */}
        <div
          style={{
            backgroundColor: "#FFF",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <h4>Deja tu calificación</h4>
          <select
            onChange={(e) => {
              const selectedProvider = providers.find(
                (provider) => provider.nombreEmpresa === e.target.value
              );
              if (selectedProvider) {
                setNewReview({
                  ...newReview,
                  nombreEmpresa: selectedProvider.nombreEmpresa,
                  tipoServicio: selectedProvider.tipoServicio,
                });
              }
            }}
            value={newReview.nombreEmpresa}
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "5px",
            }}
          >
            <option value="">Selecciona una Empresa</option>
            {providers.map((provider, index) => (
              <option key={index} value={provider.nombreEmpresa}>
                {provider.nombreEmpresa}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tipo de Servicio"
            value={newReview.tipoServicio}
            disabled
            style={{
              width: "100%",
              marginBottom: "10px",
              padding: "5px",
            }}
          />
          <textarea
            placeholder="Comentario"
            value={newReview.comentario}
            onChange={(e) => setNewReview({ ...newReview, comentario: e.target.value })}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="date"
            value={newReview.fecha}
            onChange={(e) => setNewReview({ ...newReview, fecha: e.target.value })}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
          <input
            type="number"
            placeholder="Calificación (1-5)"
            value={newReview.calificacion}
            onChange={(e) => setNewReview({ ...newReview, calificacion: e.target.value })}
            style={{ width: "100%", marginBottom: "10px", padding: "5px" }}
          />
          <button
            onClick={handleAddReview}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#FBC02D",
              border: "none",
              borderRadius: "5px",
              color: "#1E1E2C",
              fontWeight: "bold",
            }}
          >
            Enviar Reseña
          </button>
        </div>
      </div>

      {/* Navegación */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#1E1E2C",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px 0",
        }}
      >
        {[{ icon: <FaHome />, label: "Inicio" },
          { icon: <FaTools />, label: "Servicios" },
          { icon: <FaReceipt />, label: "Historial" },
          { icon: <FaUser />, label: "Perfil" }].map((tab, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(index)}
            style={{
              background: "none",
              border: "none",
              color: selectedIndex === index ? "#FBC02D" : "white",
              fontSize: "18px",
            }}
          >
            {tab.icon}
            <p style={{ margin: 0 }}>{tab.label}</p>
          </button>
        ))}
      </div>

      {/* Modal de Búsqueda */}
      <Modal
        isOpen={isSearchOpen}
        onRequestClose={() => setIsSearchOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
          },
        }}
      >
        <h2>Buscar Proveedores</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            name="tipoServicio"
            placeholder="Tipo de servicio"
            value={searchFilters.tipoServicio}
            onChange={handleFilterChange}
            style={{ padding: "10px" }}
          />
          <input
            type="text"
            name="nombreEmpresa"
            placeholder="Nombre de la empresa"
            value={searchFilters.nombreEmpresa}
            onChange={handleFilterChange}
            style={{ padding: "10px" }}
          />
          <button
            onClick={applyFilters}
            style={{
              padding: "10px",
              backgroundColor: "#283593",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Aplicar Filtros
          </button>
        </div>

        <h3>Resultados:</h3>
        <ul>
          {filteredProviders.map((provider, index) => (
            <li key={index}>
              <strong>{provider.nombreEmpresa}</strong> - {provider.tipoServicio} <br />
              Horario: {provider.horarioAtencion}
            </li>
          ))}
        </ul>

        <button
          onClick={() => setIsSearchOpen(false)}
          style={{
            padding: "10px",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Cerrar
        </button>
      </Modal>
    </div>
  );
};

export default HomeScreen;
