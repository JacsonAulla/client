import React, { useState } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Login({ setIsAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const cookies = new Cookies();
  const navigate = useNavigate();

  const login = () => {
    if (!username || !password) {
      alert("Ingresa usuario y contraseña");
      return;
    }

    Axios.post("http://localhost:3001/login", {
      username,
      password,
    })
      .then((res) => {
        if (res.data.message === "Usuario no Encontrado") {
          alert("Usuario no encontrado");
          return;
        }
        if (res.data.message === "Contraseña incorrecta") {
          alert("Contraseña incorrecta");
          return;
        }

        const { token, userId, username } = res.data;

        cookies.set("token", token);
        cookies.set("userId", userId);
        cookies.set("username", username);
        setIsAuth(true);
        navigate("/joingame");
      })
      .catch((err) => {
        console.error("Error al iniciar sesión:", err);
        alert("Ocurrió un error al iniciar sesión.");
      });
  };

  return (
    <div className='auth-container login'>
      <label>Login</label>

      <input
        placeholder='Usuario'
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />

      <input
        placeholder='Contraseña'
        type='password'
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}>Login</button>
      <button onClick={() => navigate("/")}>Volver al menú</button>
    </div>
  );
}

export default Login;
