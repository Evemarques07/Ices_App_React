import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/MonthSelection.css";

const MonthSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedYear } = location.state || {}; // Recebe o ano da tela anterior

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const getMonthOptions = () => [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const handleMonthPress = (monthValue) => {
    navigate("/saidas/detalhes", {
      // Navega para a próxima tela
      state: { selectedYear, selectedMonth: monthValue }, // Passa ano e mês
    });
  };

  return (
    <div className={`container ${fadeIn ? "fade-in" : ""}`}>
      <h2 className="title">Selecione o Mês para {selectedYear}:</h2>
      <div className="month-buttons-container">
        {getMonthOptions().map((month, index) => (
          <button
            key={index + 1}
            className="month-button"
            onClick={() => handleMonthPress(index + 1)}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonthSelection;
