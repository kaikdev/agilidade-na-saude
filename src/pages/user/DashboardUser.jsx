import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import ServiceRegistrationModal from './modals/ServiceRegistrationModal';
import ProviderInfoModal from './modals/ProviderInfoModal';
import './DashboardUser.css';

function DashboardUser() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { user, token, isAuthenticated, loading: authLoading, logout } = useAuth();

    const [availableAppointments, setAvailableAppointments] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedProviderForInfo, setSelectedProviderForInfo] = useState(null);

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
            const response = await axios.get(`${API_BASE_URL}/api/users/appointments/scheduled`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data && Array.isArray(response.data.appointments)) {
                setUserScheduledAppointments(response.data.appointments);
            }
        } 
        catch (err) {
            console.error("Erro ao buscar Meus Agendamentos:", err);
            let errorMessage = 'Ocorreu um erro ao carregar seus agendamentos.';

            if (err.response) {
                errorMessage = err.response.data.error || err.response.data.message || `Erro ${err.response.status}`;
            } 
            else if (err.request) {
                errorMessage = 'Não foi possível conectar ao servidor (Meus Agendamentos).';
            }
            setScheduledError(errorMessage);
        } 
        finally {
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

            const response = await axios.get(`${API_BASE_URL}/api/users/appointments/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data.appointments)) {
                setAvailableAppointments(response.data.appointments);
            }

            if (Array.isArray(response.data.priorites)) {
                setPriorities(response.data.priorites);
            }
        } 
        catch (err) {
            console.error("Erro ao buscar Atendimentos Disponíveis:", err);
            let errorMessage = 'Ocorreu um erro ao carregar os atendimentos disponíveis.';

            if (err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    errorMessage = 'Acesso não autorizado. Sua sessão pode ter expirado.';
                    logout(false, errorMessage);
                    return;
                } 
                else {
                    errorMessage = err.response.data.error || err.response.data.message || `Erro ${err.response.status}`;
                }
            } 
            else if (err.request) {
                errorMessage = 'Não foi possível conectar ao servidor (Atend. Disponíveis).';
            }

            setError(errorMessage);
            Swal.fire({
                icon: 'error',
                title: 'Erro ao Carregar!',
                text: errorMessage,
                confirmButtonText: 'Ok'
            });
        } 
        finally {
            setDataLoading(false);
        }
    }, [isAuthenticated, token, user?.id, logout]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchAvailableAppointments();
            fetchUserScheduledAppointments();
        } 
        else if (!authLoading && !isAuthenticated) {
            setAvailableAppointments([]); setPriorities([]); setUserScheduledAppointments([]);
            setDataLoading(false); setIsLoadingScheduled(false); setError(null); setScheduledError(null);
            setSelectedService(null);
        }
    }, [authLoading, isAuthenticated, fetchAvailableAppointments, fetchUserScheduledAppointments]);

    const handleParticiparClick = (service) => {
        setSelectedService(service);

        const modalElement = document.getElementById('modalServiceRegistration');

        if (modalElement) {
            const existingInstance = window.bootstrap.Modal.getInstance(modalElement);

            if (existingInstance) {
                existingInstance.dispose();
            }

            const serviceModalInstance = new window.bootstrap.Modal(modalElement);
            serviceModalInstance.show();
        }
    };

    const handleMoreInfoClick = (service) => {
        const providerData = {
            name: service.provider_name || 'Não informado',
            specialty: service.specialty || 'Não informada',
            crm: service.provider_crm || 'Não informado',
            presentation: service.provider_presentation || 'Nenhuma apresentação disponível.',
            image_url: service.provider_image_url || null
        };

        setSelectedProviderForInfo(providerData);

        const modalElement = document.getElementById('modalProviderInfo');
        if (modalElement) {
            const existingInstance = window.bootstrap.Modal.getInstance(modalElement);
            if (existingInstance) {
                existingInstance.dispose();
            }
            const providerInfoModalInstance = new window.bootstrap.Modal(modalElement);
            providerInfoModalInstance.show();
        }
    };

    const handleServiceModalActuallyClosed = useCallback(() => {
        setSelectedService(null);
    }, []);

    const handleServiceRegistered = () => {
        fetchAvailableAppointments();
        fetchUserScheduledAppointments();
    };

    useEffect(() => {
        const modalElement = document.getElementById('modalProviderInfo');
        const handleModalHidden = () => {
            setSelectedProviderForInfo(null);
        };

        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', handleModalHidden);
        }

        return () => {
            if (modalElement) {
                modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);
            }
        };
    }, []);

    if (authLoading) {
        return (<main className="main-dashboard"><div className="title-user"><h3>Verificando sua sessão...</h3><p>Aguarde...</p></div></main>);
    }

    const showGeneralLoading = (dataLoading && availableAppointments.length === 0 && !error) || (isLoadingScheduled && userScheduledAppointments.length === 0 && !scheduledError);

    if (showGeneralLoading && !authLoading) {
        return (<main className="main-dashboard"><div className="title-user"><h3>Carregando dados do dashboard...</h3><p>Por favor, aguarde.</p></div></main>);
    }

    if (error && availableAppointments.length === 0 && !dataLoading && scheduledError && userScheduledAppointments.length === 0 && !isLoadingScheduled && !authLoading) {
        return (
            <main className="main-dashboard">
                <div className="title-user">
                    <h3 style={{ color: 'red' }}>Erro ao carregar o Dashboard</h3>
                    
                    <p>{error || scheduledError}</p>
                    
                    <button className="btn btn-primary mt-3" onClick={() => { fetchAvailableAppointments(); fetchUserScheduledAppointments(); }}>Tentar Novamente</button>
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

            {/* Meus Agendamentos */}
            <section className="create-service">
                <h3 className="section-title">
                    <i className="fa-solid fa-calendar-check"></i> 
                    Meus Agendamentos
                </h3>

                {isLoadingScheduled && userScheduledAppointments.length === 0 ? (
                    <p>Carregando seus agendamentos...</p>
                ) : scheduledError ? (
                    <div className="alert alert-warning">
                        <p>{scheduledError}</p>
                        <button className="btn btn-primary btn-sm" onClick={fetchUserScheduledAppointments}>Tentar Novamente</button>
                    </div>
                ) : !isLoadingScheduled && userScheduledAppointments.length === 0 ? (
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
                                            {appt.user_name}
                                        </p>
                                    </div>

                                    <div className="desc-service">
                                        <p>
                                            <strong>Especialidade:</strong>
                                            {appt.admin_specialty}
                                        </p>
                                    </div>

                                    <div className="desc-service">
                                        <p>
                                            <strong>CRM:</strong> 
                                            {appt.provider_crm}
                                        </p>
                                    </div>

                                    <div className="desc-service">
                                        <p>
                                            <strong>Data:</strong> 
                                            {appt.service_date
                                            ? new Date(appt.service_date).toLocaleDateString('pt-BR')
                                            : 'N/A'}
                                        </p>
                                    </div>
                                    
                                    <div className="desc-service">
                                        <p>
                                            <strong>Horário:</strong> 
                                            {appt.service_date
                                            ? new Date(appt.service_date).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : 'N/A'}
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

            {/* Atendimentos Disponíveis */}
            <section className="create-service">
                <h3 className="section-title">
                    <i className="fa-solid fa-briefcase-medical"></i> 
                    Atendimentos Disponíveis
                </h3>

                {dataLoading && availableAppointments.length === 0 ? (
                    <p>Carregando atendimentos disponíveis...</p>
                ) : error ? (
                    <div className="alert alert-danger">
                        <p>{error}</p>
                        <button className="btn btn-primary btn-sm" onClick={fetchAvailableAppointments}>Tentar Novamente</button>
                    </div>
                ) : !dataLoading && availableAppointments.length === 0 ? (
                    <div className="service-empty">
                        <p>
                            <i className="fa-solid fa-circle-exclamation"></i> 
                            Nenhum atendimento disponível no momento.
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
                                            {service.service_date
                                            ? new Date(service.service_date).toLocaleDateString('pt-BR')
                                            : 'N/A'}
                                        </p>
                                    </div>

                                    <div className="desc-service">
                                        <p>
                                            <span>
                                                <i className="fa-solid fa-clock"></i> 
                                                Horário de Início:
                                            </span> 
                                            {service.service_date
                                            ? new Date(service.service_date).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : 'N/A'}
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
                                            disabled={service.qtd_attendance <= 0}>

                                            <i className="fa-solid fa-user-plus"></i> Participar
                                        </button>

                                        <button className="btn-edit" type="button" onClick={() => handleMoreInfoClick(service)}>
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
                selectedService={selectedService}
                priorities={priorities}
                onServiceRegistered={handleServiceRegistered}
                onModalActuallyClosed={handleServiceModalActuallyClosed}
            />
            
            <ProviderInfoModal
                providerInfo={selectedProviderForInfo}
            />
        </main>
    );
}

export default DashboardUser;