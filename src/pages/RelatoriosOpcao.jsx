import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/RelatoriosOpcao.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Selecione uma Opção</h1>
      <div className="button-container">
        <button
          className="home-button entradas"
          onClick={() => navigate("/entradas")}
        >
          ENTRADAS
        </button>
        <button
          className="home-button saidas"
          onClick={() => navigate("/saidas")}
        >
          SAÍDAS
        </button>
      </div>
    </div>
  );
};

export default Home;
