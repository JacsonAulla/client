import React from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <h2>Bienvenido al Juego</h2>
      <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
      <button onClick={() => navigate("/signup")}>Registrarse</button>
    </div>
  );
}

export default Home;
