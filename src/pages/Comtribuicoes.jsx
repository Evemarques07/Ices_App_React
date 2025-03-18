import React, { useState, useCallback } from "react";
import "../css/Contribuicoes.css";
import api from "../services/api";

const Contributions = () => {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(false);
  const [selectedYear] = useState(new Date().getFullYear());

  const token = JSON.parse(localStorage.getItem("token"));

  const fetchEntradas = useCallback(async () => {
    if (loading) return; // Evita chamadas duplicadas

    setLoading(true);
    setError(null);
    setShowList(false);

    try {
      const response = await api.get(`/entradas/me/`, {
        headers: { Authorization: `Bearer ${token?.access_token}` },
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Formato de resposta inválido");
      }

      const entradasComEspaco = response.data.map((item) => ({
        ...item,
        tipo: item.tipo.replace(/_/g, " "),
      }));

      const tiposPermitidos = [
        "Dizimos",
        "Ofertas",
        "Ofertas Missionarias",
        "Campanhas",
        "Eventos",
        "Venda Materiais",
        "Doacoes Empresas",
        "Parcerias Ongs",
        "Apoio Outras Igrejas",
        "Investimentos",
      ];

      const entradasFiltradas = entradasComEspaco.filter(
        (item) =>
          tiposPermitidos.includes(item.tipo) &&
          new Date(item.dataRegistro).getFullYear() === selectedYear
      );

      if (entradasFiltradas.length === 0) {
        setError(`Nenhuma contribuição encontrada para ${selectedYear}.`);
        setEntradas([]);
        return;
      }

      const groupedData = tiposPermitidos
        .map((tipo) => {
          const dataByType = entradasFiltradas.filter(
            (item) => item.tipo === tipo
          );
          const total = dataByType.reduce(
            (sum, item) => sum + parseFloat(item.valor || 0),
            0
          );

          return {
            title: tipo,
            data: dataByType,
            total: total.toFixed(2),
          };
        })
        .filter((section) => section.data.length > 0);

      setEntradas(groupedData);
      setShowList(true);
    } catch (error) {
      setError("Erro ao buscar as entradas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, token, loading]);

  return (
    <div className="contributions-container">
      <h1 className="title">💵 Suas Contribuições</h1>
      {/* <p className="yearText">{selectedYear}</p> */}
      <button onClick={fetchEntradas} className="refreshButton">
        🔄 Atualizar
      </button>

      {loading && <p className="loadingText">Carregando...</p>}
      {error && <p className="errorText">{error}</p>}

      {showList && (
        <div className="entradas-list">
          {entradas.map((section) => (
            <div key={section.title} className="section">
              <h2 className="sectionHeader">{section.title}</h2>
                <div className="carEntrada">
                  {section.data.map((item) => (
                    <div key={item.idEntrada} className="entradaItem">
                      <p className="descricao">{item.descricao}</p>
                      <p className="data">📅 {new Date(item.dataRegistro).toLocaleDateString("pt-BR")}</p>
                      <p className="valor">💰 R$ {parseFloat(item.valor).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              <p className="total">Total: R$ {section.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contributions;
