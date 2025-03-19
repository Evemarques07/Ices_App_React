import React, { useState, useEffect, useCallback } from "react";
import "../css/Contribuicoes.css";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext"; // 🔹 Importa corretamente o useAuth
import { jwtDecode } from "jwt-decode";

const Contributions = () => {
  const location = useLocation();
  const { selectedYear } = location.state || {};
  const { user, token } = useAuth(); // 🔹 Obtém o usuário e o token
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(false);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const activeUser = user || storedUser;
  const activeToken = token || storedToken;

  // console.log("🔹 Usuário ativo:", activeUser);
  // console.log("🔹 Token ativo:", activeToken);

  // console.log("Usuário logado:", user);

  useEffect(() => {
    // console.log("🔄 Verificando atualização do usuário...");
    // console.log("👤 Estado do usuário no contexto:", user);
  }, [user]);

  const fetchEntradas = useCallback(async () => {
    if (!activeUser || !activeToken) return; // Verifica se o usuário e token estão disponíveis

    let decoded;
    try {
      decoded = jwtDecode(activeToken);
      // console.log("✅ Token decodificado:", decoded);
    } catch (error) {
      console.error("❌ Erro ao decodificar o token:", error);
      return;
    }

    setLoading(true);
    setError(null);
    setShowList(false);

    try {
      const response = await api.post(
        `/entradas/ano/`,
        {
          idMembro: decoded.idMembro,
          ano: selectedYear, // Usa o ano da navegação
        },
        {
          headers: { Authorization: `Bearer ${activeToken}` },
        }
      );
      // console.log(
      //   "Enviando o membro: ",
      //   decoded.idMembro,
      //   "e ano: ",
      //   selectedYear
      // );

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
        "Projetos",
        "Venda Materiais",
        "Doacoes Empresas",
        "Parcerias Ongs",
        "Apoio Outras Igrejas",
        "Investimentos",
      ];

      const entradasFiltradas = entradasComEspaco.filter((item) =>
        tiposPermitidos.includes(item.tipo)
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
      console.error("Erro ao buscar as entradas:", error);
      setError("Erro ao buscar as entradas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [selectedYear, activeToken, activeUser]); // 🔹 Remove `loading` da dependência

  // 🔹 Chama a API quando a página carregar
  useEffect(() => {
    fetchEntradas();
  }, [fetchEntradas]);

  return (
    <div className="contributions-container">
      <h1 className="title">💵 Suas Contribuições</h1>
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
                    <p className="data">
                      📅{" "}
                      {new Date(item.dataRegistro).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="valor">
                      💰 R$ {parseFloat(item.valor).toFixed(2)}
                    </p>
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
