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
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

    const [userScheduledAppointments, setUserScheduledAppointments] = useState([]);
    const [isLoadingScheduled, setIsLoadingScheduled] = useState(true);
    const [scheduledError, setScheduledError] = useState(null);

    const fetchUserScheduledAppointments = useCallback(async () => {
        setIsLoadingScheduled(true);
        setScheduledError(null);
        setUserScheduledAppointments([]);

        try {
            if (!isAuthenticated || !token) {
                setIsLoadingScheduled(false);
                return;
            }
            const response = await axios.get('http://localhost:3000/api/users/appointments/scheduled', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && Array.isArray(response.data.appointments)) {
                setUserScheduledAppointments(response.data.appointments);
            }
        } catch (err) {
            console.error("Erro ao buscar Meus Agendamentos:", err);
            let errorMessage = 'Ocorreu um erro ao carregar seus agendamentos.';
            if (err.response) {
                errorMessage = err.response.data.error || err.response.data.message || `Erro ${err.response.status}`;
            } else if (err.request) {
                errorMessage = 'Não foi possível conectar ao servidor (Meus Agendamentos).';
            }
            setScheduledError(errorMessage);
        } finally {
            setIsLoadingScheduled(false);
        }
    }, [isAuthenticated, token]);

    const fetchAvailableAppointments = useCallback(async () => {
        setDataLoading(true);
        setError(null);
        setAvailableAppointments([]);
        setPriorities([]);
        try {
            if (!isAuthenticated || !token || !user?.id) {
                setDataLoading(false);

                return;
            }
            const response = await axios.get('http://localhost:3000/api/users/appointments/list', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data.appointments)) {
                setAvailableAppointments(response.data.appointments);
            }

            if (Array.isArray(response.data.priorites)) {
                setPriorities(response.data.priorites);
            }
        } catch (err) {
            console.error("Erro ao buscar Atendimentos Disponíveis:", err);
            let errorMessage = 'Ocorreu um erro ao carregar os atendimentos disponíveis.';
            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    errorMessage = 'Acesso não autorizado. Sua sessão pode ter expirado.';
                } 
                else {
                    errorMessage = err.response.data.error || err.response.data.message || `Erro ${err.response.status}`;
                }
            } else if (err.request) {
                errorMessage = 'Não foi possível conectar ao servidor (Atend. Disponíveis).';
            }

            setError(errorMessage);
        } 
        finally {
            setDataLoading(false);
        }
    }, [isAuthenticated, token, user?.id]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchAvailableAppointments();
            fetchUserScheduledAppointments();
        } 
        else if (!authLoading && !isAuthenticated) {
            setAvailableAppointments([]);
            setPriorities([]);
            setUserScheduledAppointments([]);
            setDataLoading(false);
            setIsLoadingScheduled(false);
            setError(null);
            setScheduledError(null);
            setSelectedService(null);
            setIsServiceModalOpen(false);
        }
    }, [authLoading, isAuthenticated, fetchAvailableAppointments, fetchUserScheduledAppointments]);


    const handleParticiparClick = (service) => {
        setSelectedService(service);
        setIsServiceModalOpen(true);
    };

    const handleCloseServiceModal = useCallback(() => {
        setIsServiceModalOpen(false);
    }, []);

    const onServiceModalHidden = useCallback(() => {
        setSelectedService(null);
    }, []);

    const handleServiceRegistered = () => {
        fetchAvailableAppointments();
        fetchUserScheduledAppointments();
    };

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
                    <i className="fa-solid fa-user-clock"></i>
                    Meus Agendamentos
                </h3>

                {isLoadingScheduled ? (
                    <p>Carregando seus agendamentos...</p>
                ) : scheduledError ? (
                    <div className="alert alert-warning">
                        <p>{scheduledError}</p>

                        <button className="btn btn-primary btn-sm" onClick={fetchUserScheduledAppointments}>Tentar Novamente</button>
                    </div>

                ) : userScheduledAppointments.length === 0 ? (
                    <div className="service-empty">
                        <p>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            Você ainda não possui agendamentos.
                        </p>
                    </div>
                ) : (
                    <div className="services-list scheduled-list">
                        {userScheduledAppointments.map((appt) => (
                            <div className="item-service scheduled-item" key={`sched-${appt.consultation_id}`}>
                                <div className="body-service">
                                    <h5>{appt.service_specialty}</h5>

                                    <div className="desc-service">
                                        <p>
                                            <strong>Profissional:</strong> 
                                            {appt.provider_name}
                                        </p>
                                    </div>

                                    <div className="desc-service">
                                        <p>
                                            <strong>CRM:</strong> 
                                            {appt.provider_crm || 'Não informado'}
                                        </p>
                                    </div>

                                    <div className="desc-service">
                                        <p>
                                            <strong>Data:</strong> 
                                            {appt.service_date ? new Date(appt.service_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}
                                        </p>
                                    </div>

                                    <div className="desc-service">
                                        <p>
                                            <strong>Local:</strong> 
                                            {appt.locality}
                                        </p>
                                    </div>

                                    <div className="desc-service">
                                        <p>
                                            <strong>Prioridade:</strong> 
                                            {appt.priority}
                                        </p>
                                    </div>

                                    <div className="desc-service">
                                        <p>
                                            <strong>Senha:</strong> 
                                            <span className="badge bg-primary">{appt.password}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

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
                            <div className="item-service appointments-list" key={service.id}>
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
                isOpen={isServiceModalOpen}
                onClose={handleCloseServiceModal} 
                onHidden={onServiceModalHidden}
                selectedService={selectedService} 
                priorities={priorities} 
                onServiceRegistered={handleServiceRegistered} 
            />
        </main>
    );
}

export default DashboardUser;