import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import appFirebase from "../../credenciales";
import Imagen from "../images/logo.png"; // Cambia el logo según tu estructura

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      // Guardar datos del usuario en Firestore
      await setDoc(doc(db, "Usuario", userCredential.user.uid), {
        email: email.trim(),
        contraseña: password.trim(),
        nombre: name.trim(),
      });

      // Redirigir al inicio de sesión
      navigate("/");
    } catch (error) {
      console.error("Error al registrar:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("El correo ya está en uso.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("La contraseña es demasiado débil.");
      } else {
        setErrorMessage("Ocurrió un error, por favor inténtalo de nuevo.");
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
        <h1
          style={{
            color: "#04294F",
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          REGÍSTRATE
        </h1>

        <form onSubmit={handleRegister}>
          {/* Campo de Nombre */}
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label
              style={{
                color: "#04294F",
                fontWeight: "bold",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Tu Usuario
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="@tunombre"
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

          {/* Campo de Email */}
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label
              style={{
                color: "#04294F",
                fontWeight: "bold",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Dirección electrónica
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
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
            <label
              style={{
                color: "#04294F",
                fontWeight: "bold",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Contraseña
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
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

          {/* Mostrar errores */}
          {errorMessage && (
            <p
              style={{
                color: "red",
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "15px",
              }}
            >
              {errorMessage}
            </p>
          )}

          {/* Botón de registro */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#3366FF",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Regístrate
          </button>
        </form>

        {/* Enlace para volver al login */}
        <p style={{ color: "#555", fontSize: "14px", marginTop: "20px" }}>
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "#3366FF",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Inicia Sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
