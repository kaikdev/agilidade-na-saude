import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './QueueDisplayPage.css';

function QueueDisplayPage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { uuid } = useParams();

    const [displayData, setDisplayData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/display/${uuid}`);
            setDisplayData(response.data);
            setError(null);
        } 
        catch (err) {
            setError("Atendimento não encontrado, finalizado ou aguardando início.");
            console.error("Erro ao buscar dados do painel:", err);
        } 
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, [uuid]);

    if (loading) {
        return <div className="display-container loading"><h1>Carregando Painel...</h1></div>;
    }

    if (error) {
        return <div className="display-container error"><h1>{error}</h1></div>;
    }

    if (!displayData) {
        return <div className="display-container"><h1>Aguardando início do atendimento...</h1></div>;
    }

    return (
        <div className="display-container">
            <header className="display-header">
                <h1>{displayData.service_specialty}</h1>
            </header>

            <main className="display-main">
                <section className="current-password-section">
                    <h2>Senha Atual</h2>

                    <div className="current-password-box">
                        {displayData.current ? displayData.current.password : '---'}
                    </div>

                    <p className="patient-name">
                        {displayData.current ? displayData.current.patient_name : 'Aguardando próximo paciente'}
                    </p>
                </section>

                <aside className="last-called-section">
                    <h3>Últimas Senhas</h3>

                    <ul className="last-called-list">
                        {displayData.last_called && displayData.last_called.length > 0 ? (
                            displayData.last_called.map((item, index) => (
                                <li key={index} className="last-called-item">
                                    <span className="last-password">{item.password}</span>
                                    <span className="last-patient">{item.patient_name}</span>
                                </li>
                            ))
                        ) : (
                            <li>Nenhuma senha chamada ainda.</li>
                        )}
                    </ul>
                </aside>
            </main>
        </div>
    );
}

export default QueueDisplayPage;