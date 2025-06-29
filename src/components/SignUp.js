import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

function SignUp({ setIsAuth }) {
  const cookies = new Cookies();
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const signUp = () => {
    if (!user.username || !user.password) {
      alert("Completa todos los campos antes de continuar.");
      return;
    }

    Axios.post("http://localhost:3001/signup", user)
      .then((res) => {
        const { token, userId, username, hashedPassword } = res.data;

        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("username", username);
        cookies.set("hashedPassword", hashedPassword); // Puedes quitarlo también si quieres

        setIsAuth(true);
        navigate("/joingame");
      })
      .catch((err) => {
        console.error("Error al registrarse:", err);
        alert("Ocurrió un error al registrarse. Intenta nuevamente.");
      });
  };

  return (
    <div className='auth-container signUp'>
      <label>Registrar</label>

      <input
        placeholder='Usuario'
        onChange={(event) => {
          setUser({ ...user, username: event.target.value });
        }}
      />

      <input
        placeholder='Contraseña'
        type='password'
        onChange={(event) => {
          setUser({ ...user, password: event.target.value });
        }}
      />

      <button onClick={signUp}>Registrar</button>
      <button onClick={() => navigate("/")}>Volver al menú</button>
    </div>
  );
}

export default SignUp;
