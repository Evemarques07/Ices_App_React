import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/Navbar.css";
import logo from "../assets/images/logoPombaAzul.png";
import api from "../services/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasNewAvisos, setHasNewAvisos] = useState(false);

  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await api.post("/auth/token", formData.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });

      if (response.status === 200) {
        const { access_token } = response.data;
        login(null, access_token);
        setShowLoginModal(false); // Fecha o modal após login bem-sucedido
        setUsername("");
        setPassword("");
      } else {
        setError("Usuário ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
      setError("Erro ao conectar ao servidor.");
    }
  };

  useEffect(() => {
    // console.log("Verificando user:", user);
    if (user && user.idUser) {
      // console.log("Chamando fetchAvisos...");
      fetchAvisos();
    }
  }, [user]);

  useEffect(() => {
    // console.log("🔄 Atualizando UI: hasNewAvisos =", hasNewAvisos);
  }, [hasNewAvisos]);

  const fetchAvisos = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Nenhum token encontrado. O usuário está autenticado?");
      return;
    }

    try {
      const response = await api.get("/avisos/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // console.log("✅ Avisos recebidos:", response.data);

      // Se houver avisos, definir hasNewAvisos como true
      if (response.data.length > 0) {
        setHasNewAvisos(true);
      } else {
        setHasNewAvisos(false);
      }
    } catch (error) {
      console.error("❌ Erro ao buscar avisos:", error);
    }
  };

  return (
    <nav id="navbar">
      {/* Botão do menu hambúrguer */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="Logo MeuApp" className="logo-image" />
      </div>

      {/* Navbar normal para telas grandes */}
      <div className="nav-container">
        <Link to="/home" className="nav-link">
          Home
        </Link>
        <Link to="/contribuicoes" className="nav-link">
          Contribuições
        </Link>
        <Link to="/relatorios" className="nav-link">
          Relatórios
        </Link>
        <Link to="/avisos" className="nav-link">
          Avisos
          {user && hasNewAvisos && (
            <span className="notification-icon">🔔</span>
          )}
        </Link>

        {user ? (
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        ) : (
          <button className="login-btn" onClick={() => setShowLoginModal(true)}>
            Login
          </button>
        )}
      </div>

      {/* Menu lateral (Drawer) */}
      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>
          ×
        </button>
        <Link to="/home" className="nav-link" onClick={toggleMenu}>
          Home
        </Link>
        <Link to="/contribuicoes" className="nav-link" onClick={toggleMenu}>
          Contribuições
        </Link>
        <Link to="/relatorios" className="nav-link" onClick={toggleMenu}>
          Relatórios
        </Link>
        <Link to="/avisos" className="nav-link" onClick={toggleMenu}>
          Avisos
          {user && hasNewAvisos && (
            <span className="notification-icon">🔔</span>
          )}
        </Link>

        {user ? (
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        ) : (
          <button className="login-btn" onClick={() => setShowLoginModal(true)}>
            Login
          </button>
        )}
      </div>

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setShowLoginModal(false)}
            >
              ×
            </button>
            <h2>Login</h2>
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
