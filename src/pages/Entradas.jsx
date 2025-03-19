import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../css/Entradas.css";

const EntradasDetalhes = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedYear, selectedMonth } = location.state || {};
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(false);
  const [totalGeral, setTotalGeral] = useState(0);

  const token = localStorage.getItem("token");

  const fetchEntradas = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);
    setShowList(false);

    try {
      const response = await api.post(
        "/entradas/soma_tipos/",
        { ano: selectedYear, mes: selectedMonth },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Resposta da API:", response.data);

      const { resultados } = response.data;

      if (!resultados || typeof resultados !== "object") {
        throw new Error("Formato de resposta inválido");
      }

      // Convertendo o objeto em array e filtrando valores maiores que zero
      const entradasFormatadas = Object.entries(resultados)
        .map(([tipo, valor]) => ({ tipo, valor }))
        .filter((item) => item.valor > 0); // Apenas entradas com valor maior que zero

      const total = entradasFormatadas.reduce(
        (acc, item) => acc + parseFloat(item.valor || 0),
        0
      );

      setEntradas(entradasFormatadas);
      setTotalGeral(total);
      setShowList(true);
    } catch (error) {
      console.error("Erro ao buscar entradas:", error);
      setError("Erro ao buscar as entradas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedMonth, token]);

  useEffect(() => {
    if (!token) {
      setError("Você precisa estar logado para visualizar as entradas.");
      return;
    }

    if (selectedYear && selectedMonth) {
      fetchEntradas();
    }

    setTimeout(() => setFadeIn(true), 100);
  }, [selectedYear, selectedMonth, fetchEntradas, token]);

  return (
    <div className={`container ${fadeIn ? "fade-in" : ""}`}>
      <h2 className="title">Entradas</h2>
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
            <div className="entradas-list">
              {entradas.map((item, index) => (
                <div key={index} className="entrada-item">
                  <p>
                    <strong>Tipo:</strong> {item.tipo.replace(/_/g, " ")}
                  </p>
                  <p className="valor">
                    💰 R$ {parseFloat(item.valor).toFixed(2)}
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

export default EntradasDetalhes;
