import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import logo from '../assets/images/logoPombaAzul.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav id="navbar">
      {/* Botão do menu hambúrguer */}
      <button className="menu-toggle" onClick={toggleMenu}>☰</button>

      {/* Logo ou Título */}
      <div className="logo">
      <img src={logo} alt="Logo MeuApp" className="logo-image" />
    </div>

      {/* Navbar normal para telas grandes */}
      <div className="nav-container">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/contribuicoes" className="nav-link">Contribuições</Link>
        <Link to="/saidas" className="nav-link">Saídas</Link>
      </div>

      {/* Menu lateral (Drawer) */}
      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>×</button>
        <Link to="/home" className="nav-link" onClick={toggleMenu}>Home</Link>
        <Link to="/contribuicoes" className="nav-link" onClick={toggleMenu}>Contribuições</Link>
        <Link to="/saidas" className="nav-link" onClick={toggleMenu}>Saídas</Link>
      </div>
    </nav>
  );
};

export default Navbar;
