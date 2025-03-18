import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Year.css";

const YearSaidas = () => {
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    setYears(
      Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => currentYear - i
      )
    );

    // Animação de fade-in ao montar o componente
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleYearPress = (year) => {
    navigate("/saidas/mes", { state: { selectedYear: year } });
  };

  return (
    <div className={`container ${fadeIn ? "fade-in" : ""}`}>
      <h2 className="title">Selecione o Ano</h2>
      <div className="year-buttons-container">
        {years.map((year) => (
          <button
            key={year}
            className="year-button"
            onClick={() => handleYearPress(year)}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearSaidas;
