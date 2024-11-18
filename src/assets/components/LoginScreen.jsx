import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import ReCAPTCHA from "react-google-recaptcha";
import appFirebase from "../../credenciales";
import Imagen from "../images/logo.png"; // Asegúrate de que el logo esté en el directorio correcto
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const recapthaRef = useRef(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Verificar si el captcha es válido
    if (!captchaValid) {
      setErrorMessage("Por favor, completa el captcha antes de continuar.");
      return;
    }

    try {
      // Iniciar sesión con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

      // Validar el usuario en Firestore
      const userDoc = await getDoc(doc(db, "Usuario", userCredential.user.uid));
      if (userDoc.exists()) {
        navigate("/home");
      } else {
        setErrorMessage("El usuario no tiene acceso.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.code === "auth/user-not-found") {
        setErrorMessage("Usuario no encontrado.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Contraseña incorrecta.");
      } else {
        setErrorMessage("Error al iniciar sesión.");
      }
    }
  };

  const handleCaptchaChange = () => {
    if (recapthaRef.current.getValue()) {
      setCaptchaValid(true);
      setErrorMessage(""); // Limpiar el mensaje de error del captcha si ya es válido
    } else {
      setCaptchaValid(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#04294F",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
          padding: "20px",
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
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
          BIENVENIDO
        </h1>
        <p style={{ color: "#ccc", fontSize: "16px", marginBottom: "20px" }}>
          welcome back we missed you
        </p>

        <form onSubmit={handleSignIn}>
          {/* Campo de Email */}
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label
              style={{
                color: "#fff",
                fontWeight: "bold",
                marginBottom: "5px",
                display: "block",
              }}
            >
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
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                outline: "none",
              }}
            />
          </div>

          {/* Campo de Contraseña */}
          <div style={{ marginBottom: "15px", textAlign: "left", position: "relative" }}>
            <label
              style={{
                color: "#fff",
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
              placeholder="********"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
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
                color: "#fff",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {isPasswordVisible ? "🙈" : "👁️"}
            </button>
          </div>

          {/* reCAPTCHA */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <ReCAPTCHA
              ref={recapthaRef}
              sitekey="6LeLNVUqAAAAAMBwBqSou7UclqdGe925Pd5mW_91" // Reemplázalo con tu clave de sitio
              onChange={handleCaptchaChange}
            />
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
              cursor: "pointer",
            }}
          >
            Inicia Sesión
          </button>
        </form>

        {/* Continuar con */}
        <p style={{ color: "#fff", fontSize: "14px", marginBottom: "15px" }}>O continuar con</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <FaGoogle size={28} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <FaApple size={28} />
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <FaFacebookF size={28} />
          </button>
        </div>

        {/* Enlace a registrarse */}
        <p style={{ color: "#fff", fontSize: "14px", marginTop: "20px" }}>
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              background: "none",
              border: "none",
              color: "#00bfff",
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
