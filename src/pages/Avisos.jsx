import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../css/Avisos.css";

const Avisos = () => {
  const { token } = useAuth();
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAvisos = async () => {
    if (!token) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/avisos/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAvisos(response.data);
    } catch (error) {
      console.error("❌ Erro ao buscar avisos:", error);
      setError("Erro ao carregar os avisos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvisos();
  }, [token]);

  return (
    <div className="avisos-container">
      <h1>📢 Meus Avisos</h1>

      {loading ? (
        <p>Carregando avisos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : avisos.length === 0 ? (
        <p className="no-avisos">Nenhum aviso encontrado.</p>
      ) : (
        <ul className="avisos-list">
          {avisos.map((aviso) => (
            <li key={aviso.idAviso} className="aviso-item">
              <strong>{aviso.descricao}</strong>
              <p>
                📅 Data do Evento:{" "}
                {new Date(aviso.dataEvento).toLocaleDateString("pt-BR")}
              </p>
              <p>Status: {aviso.status ? "Ativo ✅" : "Inativo ❌"}</p>
            </li>
          ))}
        </ul>
      )}

      <button className="refresh-button" onClick={fetchAvisos}>
        🔄 Atualizar Avisos
      </button>
    </div>
  );
};

export default Avisos;
