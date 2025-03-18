import React, { useState, useEffect } from "react";
import "../css/Login.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, token, login } = useAuth(); // Obtendo funções e dados do contexto
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Se já estiver autenticado, redireciona para /home
  useEffect(() => {
    if (user && token) {
      navigate("/home");
    }
  }, [user, token, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await api.post("/auth/token", formData.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true, // Permite que cookies sejam armazenados (se for usar cookies HTTP-only)
      });

      if (response.status === 200) {
        const { access_token } = response.data;
        login(null, access_token); // Passa o token para o contexto
        navigate("/home");
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
