// src/pages/Login.jsx
import React, { useState } from "react";
import '../css/Login.css';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await api.post("/auth/token", new URLSearchParams(formData).toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.status === 200) {
        // Salva o access_token no localStorage
        localStorage.setItem("token", JSON.stringify(response.data)); // Save the entire object as a string
        alert("Login bem-sucedido!");
        navigate('/home'); // Use navigate to redirect
      } else {
        setError("Usuário ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      setError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;