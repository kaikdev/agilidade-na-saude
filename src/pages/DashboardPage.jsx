import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './DashboardPage.css';

function DashboardPage() {
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Não Autorizado',
                    text: 'Você precisa estar logado para acessar esta página.',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    navigate('/');
                });
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                if (!userId) {
                    throw new Error('ID do usuário não encontrado no token.');
                }

                const response = await axios.get(`http://localhost:3001/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Inclui o token no cabeçalho
                    }
                });

                setUserName(response.data.name);
            } catch (err) {
                console.error('Erro ao buscar dados do usuário:', err);
                setError('Não foi possível carregar os dados do usuário.');

                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Sessão Expirada',
                        text: 'Sua sessão expirou ou é inválida. Por favor, faça login novamente.',
                        showConfirmButton: false,
                        timer: 2500
                    }).then(() => {
                        localStorage.removeItem('authToken');
                        navigate('/');
                    });
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
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        Swal.fire({
            title: 'Deseja realmente sair?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, sair!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userEmail');
                
                Swal.fire({
                    icon: 'success',
                    title: 'Deslogado!',
                    text: 'Você foi desconectado com sucesso.',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate('/');
                });
            }
        });
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Carregando dados do usuário...</p>
                {/* Você pode adicionar um spinner de carregamento aqui */}
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                <p>{error}</p>

                <button className="btn btn-danger mt-3" onClick={handleLogout}>
                    Ir para Login
                </button>
            </div>
        );
    }

    return (
        <main className="main-dashboard">
            <h1>Olá, {userName || 'Usuário'}!</h1>
            
            <p>Bem-vindo ao seu Dashboard. Esta é uma página protegida.</p>

            <button className="btn btn-danger mt-3" onClick={handleLogout}>
                Sair (Logout)
            </button>
        </main>
    );
}

export default DashboardPage;