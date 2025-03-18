import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
// import "../css/Saidas.css";

const Saidas = () => {
  const location = useLocation();
  const { selectedYear, selectedMonth } = location.state || {};
  const [saidas, setSaidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showList, setShowList] = useState(false);
  
  const token = JSON.parse(localStorage.getItem("token"));

  const fetchSaidas = useCallback(async () => {
    setLoading(true);
    setError(null);
    setShowList(false);

    try {
      const response = await axios.get("/api/saidas", {
        headers: { Authorization: `Bearer ${token?.access_token}` }
      });
      
      if (!Array.isArray(response.data)) {
        throw new Error("Formato de resposta inválido");
      }

      const saidasComEspaco = response.data.map((item) => ({
        ...item,
        tipo: item.tipo.replace(/_/g, " "),
      }));

      const saidasFiltradas = saidasComEspaco.filter((item) => {
        const itemDate = new Date(item.dataRegistro);
        return (
          itemDate.getFullYear() === selectedYear &&
          itemDate.getMonth() + 1 === selectedMonth
        );
      });

      const groupedData = Object.values(
        saidasFiltradas.reduce((acc, item) => {
          if (!acc[item.tipo]) {
            acc[item.tipo] = { title: item.tipo, data: [], total: 0 };
          }
          acc[item.tipo].data.push(item);
          acc[item.tipo].total += parseFloat(item.valor || 0);
          return acc;
        }, {})
      );
      
      setSaidas(groupedData);
      setShowList(true);
    } catch (error) {
      console.error("Erro ao buscar saídas:", error);
      setError("Erro ao buscar as saídas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchSaidas();
    }
  }, [selectedYear, selectedMonth, fetchSaidas]);

  return (
    <div className="container">
      <h2 className="title">Saídas</h2>
      {selectedYear && selectedMonth && (
        <h3 className="year-month">
          {new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
            new Date(selectedYear, selectedMonth - 1)
          )} {selectedYear}
        </h3>
      )}
      
      {loading && <p className="loading">Carregando...</p>}
      {error && <p className="error">{error}</p>}
      
      {showList && (
        <div className="saidas-list">
          {saidas.map((section) => (
            <div key={section.title} className="saidas-section">
              <h4 className="section-header">{section.title}</h4>
              {section.data.map((item) => (
                <div key={item.idSaida} className="saida-item">
                  <p><strong>Descrição:</strong> {item.descricao}</p>
                  <p className="valor">💰 R$ {parseFloat(item.valor).toFixed(2)}</p>
                  <p className="data">📅 {new Date(item.dataRegistro).toLocaleDateString("pt-BR")}</p>
                </div>
              ))}
              <p className="total">Total: R$ {section.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saidas;
