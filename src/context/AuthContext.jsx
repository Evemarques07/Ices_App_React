// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";

// Função para decodificar o token (se necessário)
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o payload do JWT
    return payload;
  } catch (error) {
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedToken && !storedUser) {
      // Decodifique o token e defina o usuário se o token existir
      const decoded = decodeToken(storedToken);
      if (decoded) {
        setUser({
          idUser: decoded.idUser,
          nomeCompleto: decoded.nomeCompleto,
          cpf: decoded.cpf,
          cargo: decoded.cargo,
        });
      }
    } else if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (userData, tokenData) => {
    const decoded = decodeToken(tokenData); // Decodifica o token para extrair informações

    if (decoded) {
      const userId = decoded.idUser; // Extrai o idUser do token

      setUser({ idUser: userId }); // Atualiza o estado com o idUser
      setToken(tokenData);

      localStorage.setItem("user", JSON.stringify({ idUser: userId })); // Armazena apenas o idUser
      localStorage.setItem("token", tokenData);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
