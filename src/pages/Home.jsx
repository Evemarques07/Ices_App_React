import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Se precisar para navegação interna
import "../css/Home.css"; // Verifique se o caminho do CSS está correto
import api from "../services/api"; // Importa a API configurada
import { jwtDecode } from "jwt-decode";


const Home = ({ token }) => {
    const [capitalizedName, setCapitalizedName] = useState(null);
    const [aviso, setAviso] = useState(null);
    const [decodedToken, setDecodedToken] = useState(null);

    // Decodifica o token ao iniciar
    useEffect(() => {
        if (token) {
            try {
                setDecodedToken(jwtDecode(token));
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, [token]);

    // Busca o nome capitalizado do usuário
    const fetchCapitalizedName = async (idUser, token) => {
        try {
            const response = await api.get(`/usuarios/capitalize/${idUser}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCapitalizedName(response.data.capitalized_login);
        } catch (error) {
            console.error("Erro ao buscar nome capitalizado:", error);
        }
    };

    // Busca avisos ativos para o usuário
    const fetchAvisos = async (idMembro, token) => {
        try {
            console.log("Iniciando requisição para /avisos/ativos/");
            const response = await api.get("/avisos/ativos/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Resposta da API:", response.data);

            const userAviso = response.data.find((aviso) => aviso.idMembro === idMembro);

            if (userAviso) {
                console.log("Aviso encontrado para o usuário:", userAviso);
                setAviso(userAviso);
            } else {
                console.log("Nenhum aviso encontrado para idMembro:", idMembro);
                setAviso(null);
            }
        } catch (error) {
            console.error("Erro ao buscar avisos:", error);
        }
    };

    // Faz as requisições quando `decodedToken` mudar
    useEffect(() => {
        if (decodedToken) {
            const idMembro = decodedToken.idMembro;
            fetchCapitalizedName(idMembro, token);
            fetchAvisos(idMembro, token);
        }
    }, [decodedToken, token]);

    return (
        <div className="container">
            <div className="header">
                <div className="headerTitleContainer">
                    <h1 className="headerTitleText">
                        {capitalizedName
                            ? `Bem-vindo(a), ${capitalizedName}!`
                            : decodedToken
                            ? `Bem-vindo(a), ${decodedToken.nomeCompleto || "Usuário"}!`
                            : "Bem-vindo(a)!"}
                    </h1>
                    {aviso && (
                        <div className="avisoContainer">
                            <span className="avisoText">Avisos: {aviso.mensagem}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="content">
                <p>Esta é a página inicial do sistema.</p>
            </div>
        </div>
    );
};

export default Home;
