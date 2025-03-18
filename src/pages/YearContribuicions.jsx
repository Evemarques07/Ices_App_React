import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/YearContribuition.css';

const YearSelection = ({ token }) => {
  const navigate = useNavigate();
  const fadeIn = useRef(0);
  const translateY = useRef(30);
  const buttonScale = useRef(1);
  const [years, setYears] = useState([]);

  useEffect(() => {
    fadeIn.current = 0;
    translateY.current = 30;

    const currentYear = new Date().getFullYear();
    setYears(Array.from({ length: currentYear - 2022 }, (_, i) => currentYear - i));
                            

    const animate = () => {
      let currentFadeIn = fadeIn.current;
      let currentTranslateY = translateY.current;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        currentFadeIn = Math.min(progress / 800, 1);
        currentTranslateY = 30 * (1 - currentFadeIn); // Adjusted calculation

        fadeIn.current = currentFadeIn;
        translateY.current = currentTranslateY;

        if (progress < 800) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    animate();
  }, []);

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 2022 + 1 }, (_, i) => currentYear - i);
  };

  const handleYearPress = (year) => {
    const animateButton = () => {
      let currentScale = buttonScale.current;
      let startTime = null;

      const stepDown = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        currentScale = 1 - (0.1 * Math.min(progress / 100, 1));
        buttonScale.current = currentScale;

        if (progress < 100) {
          requestAnimationFrame(stepDown);
        } else {
          // Animate back to 1
          startTime = null;
          const stepUp = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            currentScale = 0.9 + (0.1 * Math.min(progress / 100, 1));
            buttonScale.current = currentScale;

            if (progress < 100) {
              requestAnimationFrame(stepUp);
            } else {
              buttonScale.current = 1; // Ensure it resets to 1
              navigate(`/contribuicoes/${year}`);
            }
          };
          requestAnimationFrame(stepUp);
        }
      };
      requestAnimationFrame(stepDown);
    };
    animateButton();
  };


  return (
    <div className="container">
      <h1 className="title">Selecione o Ano</h1>
      <div className="year-buttons-container">
        {years.map((year) => (
          <button key={year} className="year-button" onClick={() => handleYearPress(year)}>
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default YearSelection;