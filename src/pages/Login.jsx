import React, { useState, useEffect } from "react";
import "../css/Login.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/logoPombaAzul.png";

const Login = () => {
  const { user, token, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      navigate("/home");
    }
  }, [user, token, navigate]);

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setError("");
    const formData = new URLSearchParams();
    formData.append("username", trimmedUsername);
    formData.append("password", trimmedPassword);

    try {
      const response = await api.post("/auth/token", formData.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });

      if (response.status === 200) {
        const { access_token } = response.data;
        login(null, access_token);
        navigate("/home");
      } else {
        setError("Usuário ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      setError("Erro ao conectar ao servidor.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && username.trim() && password.trim()) {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo" className="logoLogin" />
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="input-container">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value.trimStart())}
            required
            onKeyDown={handleKeyPress}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            onKeyDown={handleKeyPress}
          />
        </div>
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={!username.trim() || !password.trim()}
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default Login;
