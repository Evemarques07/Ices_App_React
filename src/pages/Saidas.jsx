import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/Saidas.css";

const Saidas = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedYear, selectedMonth } = location.state || {};
  const [saidas, setSaidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(false);
  const [totalGeral, setTotalGeral] = useState(0);

  const token = localStorage.getItem("token");

  const fetchSaidas = useCallback(async () => {
    if (!token) return; // Se não houver token, impede a busca

    setLoading(true);
    setError(null);
    setShowList(false);

    try {
      const response = await api.get("/saidas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Resposta da API:", response.data);

      if (!Array.isArray(response.data)) {
        throw new Error("Formato de resposta inválido");
      }

      const saidasFiltradas = response.data.filter((item) => {
        const itemDate = new Date(item.dataRegistro);
        return (
          itemDate.getFullYear() === selectedYear &&
          itemDate.getMonth() + 1 === selectedMonth
        );
      });

      const total = saidasFiltradas.reduce(
        (acc, item) => acc + parseFloat(item.valor || 0),
        0
      );

      setSaidas(saidasFiltradas);
      setTotalGeral(total);
      setShowList(true);
    } catch (error) {
      console.error("Erro ao buscar saídas:", error);
      setError("Erro ao buscar as saídas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, token]);

  useEffect(() => {
    if (!token) {
      setError("Você precisa estar logado para visualizar as saídas.");
      return;
    }

    if (selectedYear && selectedMonth) {
      fetchSaidas();
    }

    setTimeout(() => setFadeIn(true), 100);
  }, [selectedYear, selectedMonth, fetchSaidas, token]);

  return (
    <div className={`container ${fadeIn ? "fade-in" : ""}`}>
      <h2 className="title">Saídas</h2>
      {selectedYear && selectedMonth && (
        <h3 className="year-month">
          {new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
            new Date(selectedYear, selectedMonth - 1)
          )}{" "}
          {selectedYear}
        </h3>
      )}

      {!token ? (
        <div className="login-warning">
          <p className="error">
            ⚠️ Você precisa estar logado para visualizar os dados.
          </p>
          <button className="login-button" onClick={() => navigate("/login")}>
            Fazer Login
          </button>
        </div>
      ) : loading ? (
        <p className="loading">Carregando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        showList && (
          <>
            <div className="saidas-list">
              {saidas.map((item) => (
                <div key={item.idSaida} className="saida-item">
                  <p>
                    <strong>Descrição:</strong> {item.descricao}
                  </p>
                  <p className="valor">
                    💰 R$ {parseFloat(item.valor).toFixed(2)}
                  </p>
                  <p className="data">
                    📅 {new Date(item.dataRegistro).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
            <p className="total-mes">
              Total do mês: R$ {totalGeral.toFixed(2)}
            </p>
          </>
        )
      )}
    </div>
  );
};

export default Saidas;
