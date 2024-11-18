import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import appFirebase from "../../credenciales";
import Imagen from "../images/logo.png"; // Asegúrate de que el logo esté en el directorio correcto
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

const auth = getAuth(appFirebase);

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      navigate("/home"); // Redirige al Home después del inicio de sesión exitoso
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setErrorMessage("Usuario no encontrado.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Contraseña incorrecta.");
      } else {
        setErrorMessage("Error al iniciar sesión.");
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#04294F",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Logo */}
        <img
          src={Imagen}
          alt="Logo"
          style={{
            height: "100px",
            width: "100px",
            borderRadius: "50%",
            marginBottom: "20px",
            objectFit: "cover",
          }}
        />
        {/* Título */}
        <h1 style={{ color: "#04294F", fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
          BIENVENIDO
        </h1>
        <p style={{ color: "#666", fontSize: "16px", marginBottom: "20px" }}>welcome back we missed you</p>

        <form onSubmit={handleSignIn}>
          {/* Campo de Email */}
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label style={{ color: "#04294F", fontWeight: "bold", marginBottom: "5px", display: "block" }}>
              Usuario
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                color: "#333",
                outline: "none",
              }}
            />
          </div>

          {/* Campo de Contraseña */}
          <div style={{ marginBottom: "15px", textAlign: "left", position: "relative" }}>
            <label style={{ color: "#04294F", fontWeight: "bold", marginBottom: "5px", display: "block" }}>
              Contraseña
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                color: "#333",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#555",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {isPasswordVisible ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Mostrar error */}
          {errorMessage && <p style={{ color: "red", marginBottom: "15px" }}>{errorMessage}</p>}

          {/* Botón de inicio de sesión */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#0056b3",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "5px",
              border: "none",
              marginBottom: "15px",
            }}
          >
            Inicia Sesión
          </button>
        </form>

        {/* Continuar con */}
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "15px" }}>O continuar con</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#0056b3" }}>
            <FaGoogle size={28} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#0056b3" }}>
            <FaApple size={28} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#0056b3" }}>
            <FaFacebookF size={28} />
          </button>
        </div>

        {/* Enlace a registrarse */}
        <p style={{ color: "#555", fontSize: "14px", marginTop: "20px" }}>
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              background: "none",
              border: "none",
              color: "#0056b3",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
