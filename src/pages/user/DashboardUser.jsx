import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Importe useAuth
import Swal from 'sweetalert2'; // Para feedback
import ServiceRegistrationModal from './modals/ServiceRegistrationModal'; // Seu modal de inscrição
import './DashboardUser.css';

function DashboardUser() {
    const { user, token, isAuthenticated, loading: authLoading, logout } = useAuth(); // Pegue o user e o token
    const [availableAppointments, setAvailableAppointments] = useState([]); // Para armazenar os atendimentos disponíveis
    const [priorities, setPriorities] = useState([]); // Para as prioridades
    const [dataLoading, setDataLoading] = useState(true); // Para carregamento dos dados da página
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null); // Para o serviço a ser inscrito no modal

    // Função para buscar os atendimentos disponíveis para o usuário
    const fetchAvailableAppointments = async () => {
        setDataLoading(true);
        setError(null);
        try {
            // Verificações pré-requisição para segurança e evitar chamadas desnecessárias
            if (!isAuthenticated || !token || !user?.id) {
                logout(false, 'Sua sessão é inválida ou expirou. Por favor, faça login novamente.');
                return;
            }

            const response = await axios.get('http://localhost:3000/api/users/appointments/list', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (Array.isArray(response.data.appointments)) {
                setAvailableAppointments(response.data.appointments);
            } else {
                setAvailableAppointments([]); // Garante que é um array
            }
            if (Array.isArray(response.data.priorites)) {
                setPriorities(response.data.priorites); // Armazena as prioridades
            } else {
                setPriorities([]);
            }

        } catch (err) {
            let errorMessage = 'Ocorreu um erro ao carregar os atendimentos disponíveis.';
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    errorMessage = 'Acesso não autorizado. Sua sessão pode ter expirado ou você não tem permissão.';
                    logout(false, errorMessage);
                    return;
                } else {
                    errorMessage = err.response.data.error || err.response.data.message || errorMessage;
                }
            } else if (err.request) {
                errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.';
            }
            setError(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: errorMessage,
                confirmButtonText: 'Ok'
            });
        } finally {
            setDataLoading(false);
        }
    };

    // Função para abrir o modal de inscrição
    const handleParticiparClick = (service) => {
        setSelectedService(service); // Define qual serviço será usado no modal de inscrição
        const modalElement = document.getElementById('modalServiceRegistration');
        if (modalElement) {
            const bootstrapModal = new window.bootstrap.Modal(modalElement);
            bootstrapModal.show();
        }
    };

    // useEffect para carregar os atendimentos disponíveis
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchAvailableAppointments();
        }
    }, [authLoading, isAuthenticated, token, user?.id, logout]); // Dependências do useEffect

    // Lógica de Renderização Condicional (Carregamento, Erro, Vazio, Lista)
    if (authLoading) {
        return (
            <main className="main-dashboard">
                <div className="title-user">
                    <h3>Verificando sua sessão...</h3>
                    <p>Aguarde enquanto autenticamos.</p>
                </div>
            </main>
        );
    }

    if (dataLoading) {
        return (
            <main className="main-dashboard">
                <div className="title-user">
                    <h3>Carregando atendimentos disponíveis...</h3>
                    <p>Por favor, aguarde.</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="main-dashboard">
                <div className="title-user">
                    <h3 style={{ color: 'red' }}>Erro ao carregar o Dashboard</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary mt-3" onClick={fetchAvailableAppointments}>Tentar Novamente</button>
                </div>
            </main>
        );
    }

    return (
        <main className="main-dashboard">
            <div className="title-user">
                {/* Exibe o nome do usuário logado */}
                <h3>Olá, {user?.name || 'Usuário'}!</h3>
                <p>Seja bem-vindo ao seu Dashboard.</p>
            </div>

            <section className="create-service">
                <h3 className="section-title">
                    <i className="fa-solid fa-briefcase-medical"></i>
                    Atendimentos Disponíveis
                </h3>

                {availableAppointments.length === 0 ? (
                    // Se não houver atendimentos, exibe a mensagem de vazio
                    <div className="service-empty">
                        <p>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            Nenhum atendimento disponível.
                        </p>
                    </div>
                ) : (
                    // Se houver atendimentos, renderiza a lista
                    <div className="services-list">
                        {availableAppointments.map((service) => (
                            <div className="item-service" key={service.id}>
                                <div className="body-service">
                                    <h5>{service.specialty}</h5>
                                    <div className="desc-service">
                                        <p>
                                            <span>
                                                <i className="fa-solid fa-calendar-days"></i>
                                                Data:
                                            </span>
                                            {service.service_date ? new Date(service.service_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="desc-service">
                                        <p>
                                            <span>
                                                <i className="fa-solid fa-location-dot"></i>
                                                Local:
                                            </span>
                                            {service.locality}
                                        </p>
                                    </div>
                                    <div className="desc-service">
                                        <p>
                                            <span>
                                                <i className="fa-solid fa-list-ol"></i>
                                                Senhas Disponíveis:
                                            </span>
                                            {service.qtd_attendance}
                                        </p>
                                    </div>

                                    <div className="buttons-actions">
                                        <button
                                            className="create-service"
                                            type="button"
                                            // Conecte o botão ao evento de abrir o modal
                                            onClick={() => handleParticiparClick(service)}
                                            disabled={service.qtd_attendance <= 0} // Desabilita se não houver senhas
                                        >
                                            <i className="fa-solid fa-user-plus"></i>
                                            Participar
                                        </button>

                                        <button className="btn-edit" type="button">
                                            <i className="fa-solid fa-circle-info"></i>
                                            Mais Informações
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Passe o serviço selecionado e as prioridades para o modal */}
            <ServiceRegistrationModal
                selectedService={selectedService}
                priorities={priorities}
                onServiceRegistered={fetchAvailableAppointments} // Função para recarregar a lista após a inscrição
            />
        </main>
    );
}

export default DashboardUser;