import React, { useState, useEffect } from "react";
import "../css/Home.css";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext"; // Importando o hook correto

const Home = () => {
  const { token } = useAuth();
  const [capitalizedName, setCapitalizedName] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para o modal

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("❌ Erro ao decodificar o token:", error);
      }
    }

    setTimeout(() => setFadeIn(true), 100);
  }, [token]);

  useEffect(() => {
    if (!decodedToken || !token) {
      return;
    }

    const { idMembro } = decodedToken;
    const { idUser } = decodedToken;

    const fetchCapitalizedName = async () => {
      try {
        const response = await api.get(`/usuarios/capitalize/${idUser}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCapitalizedName(response.data.capitalized_login);
      } catch (error) {
        console.error("❌ Erro ao buscar nome capitalizado:", error);
      }
    };

    const fetchAvisos = async () => {
      try {
        const response = await api.get("/avisos/ativos/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userAviso = response.data.find(
          (aviso) => aviso.idMembro === idMembro
        );

        setAviso(userAviso || null);
        if (userAviso) {
          setShowModal(true); // Mostrar o modal quando houver um aviso
          setTimeout(() => setShowModal(false), 5000); // Esconde o modal após 5 segundos
        }
      } catch (error) {
        console.error("❌ Erro ao buscar avisos:", error);
      }
    };

    fetchCapitalizedName();
    fetchAvisos();
  }, [decodedToken, token]);

  return (
    <div className={`container ${fadeIn ? "fade-in" : ""}`}>
      <div className="header">
        <div className="headerTitleContainer">
          <h1 className="headerTitleText">
            {capitalizedName
              ? `Bem-vindo(a), ${capitalizedName}!`
              : decodedToken?.nomeCompleto
              ? `Bem-vindo(a), ${decodedToken.nomeCompleto}!`
              : "Bem-vindo(a)!"}
          </h1>
        </div>
      </div>

      {/* Modal de Aviso */}
      {showModal && (
        <div className="avisos-modal">
          <div className="avisos-modal-content">
            <h2 className="avisos-modal-title">📢 Aviso Importante</h2>
            <p className="avisos-modal-text">
              Você tem avisos importantes! Abra a aba de avisos.
            </p>
            <button
              className="avisos-modal-button"
              onClick={() => setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="content">
        <p>Esta é a página inicial do sistema.</p>
      </div>
    </div>
  );
};

export default Home;
