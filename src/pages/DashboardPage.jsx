import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

function DashboardPage() {
    const { isAuthenticated, user, logout } = useAuth();
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isAuthenticated) {
                logout(false, 'Você precisa estar logado para acessar esta página.');
                return;
            }

            if (user && user.id) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.get(`http://localhost:3001/api/users/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    setUserName(response.data.name);
                } 
                catch (err) {
                    console.error('Erro ao buscar dados do usuário:', err);

                    setError('Não foi possível carregar os dados do usuário.');
                    
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        logout(false, 'Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro!',
                            text: 'Ocorreu um erro ao buscar seus dados. Tente novamente.',
                            confirmButtonText: 'Ok'
                        });
                    }
                } 
                finally {
                    setLoading(false);
                }
            } 
            else {
                setLoading(false);
                setError('Dados do usuário não disponíveis. Faça login novamente.');
                logout(false, 'Erro nos dados da sessão. Faça login novamente.');
            }
        };

        fetchUserData();
    }, [isAuthenticated, user, logout]);

    const handleLogout = () => {
        logout(true);
    };

    if (loading) {
        return (
            <main className="main-dashboard">
                <p>Carregando dados do usuário...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="main-dashboard">
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className="main-dashboard">
            <h1>Olá, {userName || (user ? user.name : 'Usuário')}!</h1>

            <p>Bem-vindo ao seu Dashboard. Esta é uma página protegida.</p>

            <button className="btn btn-danger mt-3" onClick={handleLogout}>
                Sair (Logout)
            </button>
        </main>
    );
}

export default DashboardPage;