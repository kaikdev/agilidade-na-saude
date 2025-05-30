import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import ServiceRegistrationModal from './modals/ServiceRegistrationModal'; 
import './DashboardUser.css';

function DashboardUser() {
    const { user, token, isAuthenticated, loading: authLoading, logout } = useAuth(); 
    const [availableAppointments, setAvailableAppointments] = useState([]); 
    const [priorities, setPriorities] = useState([]); 
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAvailableAppointments = async () => {
        setDataLoading(true);
        setError(null);
        try {
            if (!isAuthenticated || !token || !user?.id) {
                logout(false, 'Sua sessão é inválida ou expirou. Por favor, faça login novamente.');
                return;
            }

            const response = await axios.get('http://localhost:3000/api/users/appointments/list', { // <-- Porta 3000
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (Array.isArray(response.data.appointments)) {
                setAvailableAppointments(response.data.appointments);
            } else {
                setAvailableAppointments([]);
            }
            
            if (Array.isArray(response.data.priorites)) {
                setPriorities(response.data.priorites);
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
                } 
                else {
                    errorMessage = err.response.data.error || err.response.data.message || errorMessage;
                }
            } 
            else if (err.request) {
                errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.';
            }

            setError(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: errorMessage,
                confirmButtonText: 'Ok'
            });
        } 
        finally {
            setDataLoading(false);
        }
    };

    const handleParticiparClick = (service) => {
        setSelectedService(service); 
        setIsModalOpen(true); 
    };

    const handleCloseModal = useCallback(() => { 
        setIsModalOpen(false); 
    }, []); 

    const onModalHiddenFromChild = useCallback(() => { 
        setSelectedService(null);
    }, []);

    const handleServiceRegistered = () => {
        fetchAvailableAppointments(); 
    };

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchAvailableAppointments();
        }
    }, [authLoading, isAuthenticated, token, user?.id, logout]);

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
                <h3>Olá, {user?.name || 'Usuário'}!</h3>
                <p>Seja bem-vindo ao seu Dashboard.</p>
            </div>

            <section className="create-service">
                <h3 className="section-title">
                    <i className="fa-solid fa-briefcase-medical"></i>
                    Atendimentos Disponíveis
                </h3>

                {availableAppointments.length === 0 ? (
                    <div className="service-empty">
                        <p>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            Nenhum atendimento disponível.
                        </p>
                    </div>
                ) : (
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
                                        <button className="create-service" type="button"
                                            onClick={() => handleParticiparClick(service)} 
                                            disabled={service.qtd_attendance <= 0} 
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

            <ServiceRegistrationModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onHidden={onModalHiddenFromChild}
                selectedService={selectedService} 
                priorities={priorities} 
                onServiceRegistered={handleServiceRegistered} 
            />
        </main>
    );
}

export default DashboardUser;