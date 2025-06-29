import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import CreateServiceModal from './modals/CreateServiceModal';
import UpdateServiceModal from './modals/UpdateServiceModal';
import ManageQueueModal from './modals/ManageQueueModal';
import { formatCPF, formatDateBR } from '../../utils/formatters';
import './DashboardAdmin.css';

function DashboardAdmin() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { user, token, isAuthenticated, loading: authLoading, logout } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [serviceIdToManage, setServiceIdToManage] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);

    const formatDateTime = (datetimeStr) => {
        const date = new Date(datetimeStr.replace(' ', 'T'));
        const dateStr = date.toLocaleDateString('pt-BR');
        const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        return { dateStr, timeStr };
    };

    const fetchAdminAppointments = async () => {
        setDataLoading(true);
        setError(null);

        try {
            if (!isAuthenticated || !token || !user?.id) {
                logout(false, 'Sua sessão é inválida ou expirou. Por favor, faça login novamente.');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/api/admin/appointments/listAll`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (Array.isArray(response.data)) {
                setAppointments(response.data);
            } else {
                setAppointments([]);
            }

        } catch (err) {
            let errorMessage = 'Ocorreu um erro ao carregar seus atendimentos.';

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

            if (err.response?.status !== 401 && err.response?.status !== 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: errorMessage,
                    confirmButtonText: 'Ok'
                });
            }
        }
        finally {
            setDataLoading(false);
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, deletar!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${API_BASE_URL}/api/admin/appointments/delete/${appointmentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    Swal.fire(
                        'Deletado!',
                        response.data.message,
                        'success'
                    );

                    fetchAdminAppointments();
                }
                catch (err) {
                    console.error('Erro ao deletar atendimento:', err);
                    let errorMessage = 'Não foi possível deletar o atendimento.';
                    if (err.response) {
                        if (err.response.status === 401 || err.response.status === 403) {
                            errorMessage = 'Acesso não autorizado. Sua sessão pode ter expirado.';
                            logout(false, errorMessage);
                        } else {
                            errorMessage = err.response.data.error || err.response.data.message || errorMessage;
                        }
                    } else if (err.request) {
                        errorMessage = 'Erro de rede: Servidor não responde.';
                    }
                    Swal.fire(
                        'Erro!',
                        errorMessage,
                        'error'
                    );
                }
            }
        });
    };

    const handleEditClick = (appointment) => {
        setSelectedAppointment(appointment);

        const modalElement = document.getElementById('modalUpdateService');

        if (modalElement) {
            const bootstrapModal = new window.bootstrap.Modal(modalElement);
            bootstrapModal.show();
        }
    };

    const handleOpenDisplayPanel = (apiUrl) => {
        if (apiUrl) {
            const uuid = apiUrl.split('/').pop();
            const displayPageUrl = `/display/${uuid}`;
            window.open(displayPageUrl, '_blank', 'noopener,noreferrer');
        }
        else {
            Swal.fire('Erro', 'O link para o painel de senhas não está disponível para este atendimento.', 'error');
        }
    };

    const handleManageQueueClick = (serviceId) => {
        setServiceIdToManage(serviceId);
    };

    const fetchAdminHistory = useCallback(async () => {
        setIsHistoryLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && Array.isArray(response.data.data)) {
                setHistoryData(response.data.data);
            }
        }
        catch (err) {
            if (err.response?.status !== 404) {
                console.error("Erro ao buscar histórico:", err);
            }

            setHistoryData([]);
        }
        finally {
            setIsHistoryLoading(false);
        }
    }, [token, API_BASE_URL]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchAdminAppointments();
            fetchAdminHistory();
        }

    }, [authLoading, isAuthenticated, token, user?.id, logout]);

    const handleQueueUpdate = () => {
        fetchAdminAppointments();
        fetchAdminHistory();
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
                    <h3>Carregando seus atendimentos...</h3>
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
                    <button className="btn btn-primary mt-3" onClick={fetchAdminAppointments}>Tentar Novamente</button>
                </div>
            </main>
        );
    }

    return (
        <main className="main-dashboard">
            <div className="title-user">
                <h3>Olá, {user?.name || 'Admin'}!</h3>
                <p>Seja bem-vindo ao seu Dashboard.</p>
            </div>

            <section className="create-service">
                <h3 className="section-title">
                    <i className="fa-solid fa-briefcase-medical"></i>
                    Atendimentos
                </h3>

                {appointments.length === 0 ? (
                    <div className="service-empty">
                        <p>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            Nenhum atendimento cadastrado ainda.
                        </p>
                    </div>
                ) : (
                    <div className="services-list dash-admin">
                        {appointments.map((appointment) => {
                            const { dateStr, timeStr } = appointment.service_date
                                ? formatDateTime(appointment.service_date)
                                : { dateStr: 'N/A', timeStr: 'N/A' };

                            return (
                                <div className="item-service" key={appointment.id}>
                                    <div className="body-service">
                                        <h5>{appointment.specialty}</h5>
                                        <div className="desc-service">
                                            <p>
                                                <span>
                                                    <i className="fa-solid fa-calendar-days"></i>
                                                    Data:
                                                </span>
                                                {dateStr}
                                            </p>
                                        </div>
                                        <div className="desc-service">
                                            <p>
                                                <span>
                                                    <i className="fa-solid fa-clock"></i>
                                                    Horário:
                                                </span>
                                                {timeStr}
                                            </p>
                                        </div>
                                        <div className="desc-service">
                                            <p>
                                                <span>
                                                    <i className="fa-solid fa-location-dot"></i>
                                                    Local:
                                                </span>
                                                {appointment.locality}
                                            </p>
                                        </div>
                                        <div className="desc-service">
                                            <p>
                                                <span>
                                                    <i className="fa-solid fa-list-ol"></i>
                                                    Qtd. de Senhas:
                                                </span>
                                                {appointment.qtd_attendance}
                                            </p>
                                        </div>

                                        <div className="buttons-actions">
                                            <button className="btn-management" type="button"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modalManageQueue"
                                                onClick={() => handleManageQueueClick(appointment.id)}>
                                                <i className="fa-solid fa-users-gear"></i>
                                                Gerenciar Fila
                                            </button>

                                            <button className="btn-display" type="button" onClick={() => handleOpenDisplayPanel(appointment.links?.displayScreen)} disabled={!appointment.links?.displayScreen}>
                                                <i className="fa-solid fa-display"></i>
                                                Painel de Senhas
                                            </button>

                                            <button className="btn-edit" type="button" onClick={() => handleEditClick(appointment)}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                                Editar
                                            </button>

                                            <button className="btn-delete" type="button" onClick={() => handleDeleteAppointment(appointment.id)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <div className="footer-service">
                    <button className="create-service" type="button" data-bs-toggle="modal" data-bs-target="#modalCreateService">
                        Criar Atendimento
                    </button>
                </div>
            </section>

            <section className="create-service">
                <h3 className="section-title">
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    Histórico de Atendimentos
                </h3>

                {isHistoryLoading ? (
                    <p>Carregando histórico...</p>
                ) : historyData.length === 0 ? (
                    <div className="service-empty">
                        <p>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            Nenhum histórico de atendimento foi gerado ainda.
                        </p>
                    </div>
                ) : (
                    <div className="services-list history dash-admin">
                        {historyData.map((record) => {
                            const { dateStr, timeStr } = formatDateTime(record.archivedAt);
                            const accordionId = `history-${record.serviceId}`;

                            return (
                                <div className="item-service" key={accordionId}>
                                    <div className="body-service">
                                        <h5>Atendimento #{record.serviceId}</h5>

                                        <div className="desc-service">
                                            <p>
                                                <span>
                                                    <i className="fa-solid fa-archive"></i> 
                                                    Arquivado em:
                                                </span> 
                                                {dateStr} às {timeStr}
                                            </p>
                                        </div>

                                        <div className="desc-service">
                                            <p>
                                                <span>
                                                    <i className="fa-solid fa-users"></i> 
                                                    Pacientes Atendidos:
                                                </span> 
                                                {record.totalPatients}
                                            </p>
                                        </div>

                                        <div className="accordion mt-3" id={`accordion-${accordionId}`}>
                                            <div className="accordion-item">
                                                <h2 className="accordion-header" id={`heading-${accordionId}`}>
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${accordionId}`} aria-expanded="false">
                                                        Ver Detalhes dos Pacientes
                                                    </button>
                                                </h2>

                                                <div id={`collapse-${accordionId}`} className="accordion-collapse collapse" data-bs-parent={`#accordion-${accordionId}`}>
                                                    <div className="accordion-body">
                                                        <ul className="list-group">
                                                            {record.patients.map((patient, index) => (
                                                                <li className="list-group-item" key={index}>
                                                                    <span>{patient.name}</span>

                                                                    <span>CPF: {formatCPF(patient.cpf)}</span>

                                                                    <span>Prioridade: {patient.priority}</span>

                                                                    <span className="badge bg-primary">{patient.password}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <CreateServiceModal onServiceCreated={handleQueueUpdate} />

            <UpdateServiceModal
                selectedAppointment={selectedAppointment}
                onServiceUpdated={handleQueueUpdate}
            />

            <ManageQueueModal
                serviceId={serviceIdToManage}
                onQueueUpdate={handleQueueUpdate}
            />
        </main>
    );
}

export default DashboardAdmin;