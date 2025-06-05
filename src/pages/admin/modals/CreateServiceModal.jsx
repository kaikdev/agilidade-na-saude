import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';

import './ServiceModal.css';

function CreateServiceModal({ onServiceCreated }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [specialty, setSpecialty] = useState('');
    const [locality, setLocality] = useState('');
    const [serviceDate, setServiceDate] = useState('');
    const [serviceStartTime, setServiceStartTime] = useState('');
    const [qtdAttendance, setQtdAttendance] = useState('');
    const [loading, setLoading] = useState(false);

    const { token, user } = useAuth();

    // (AAAA-MM-DD) (HH:MM)"
    const formatDateTimeForAPI = (dateString, timeString) => {
        if (!dateString || !timeString) {
            return ''; 
        }

        const [year, month, day] = dateString.split('-');
        
        return `${day}/${month}/${year} ${timeString}`;
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!specialty || !locality || !serviceDate || !serviceStartTime || !qtdAttendance) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Obrigatórios',
                text: 'Todos os campos, incluindo data e horário de início, são obrigatórios.',
            });

            setLoading(false);
            return;
        }

        const formattedServiceDateTime = formatDateTimeForAPI(serviceDate, serviceStartTime);

        if (!formattedServiceDateTime) {
             Swal.fire({
                icon: 'error',
                title: 'Data ou Hora Inválida',
                text: 'Por favor, forneça uma data e um horário de início válidos.',
            });

            setLoading(false);
            return;
        }

        try {
            const userIdForApi = user?.id;

            const payload = {
                user_id: userIdForApi,
                specialty: specialty,
                locality: locality,
                qtd_attendance: parseInt(qtdAttendance),
                service_date: formattedServiceDateTime,
            };

            const response = await axios.post(`${API_BASE_URL}/api/admin/appointments`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Atendimento Criado!',
                text: response.data.message || 'Atendimento cadastrado com sucesso!',
                confirmButtonText: 'Ok'
            }).then(() => {
                setSpecialty('');
                setLocality('');
                setServiceDate('');
                setServiceStartTime('');
                setQtdAttendance('');

                const modalElement = document.getElementById('modalCreateService');
                if (modalElement) {
                    const bootstrapModal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                    bootstrapModal.hide();
                }

                if (onServiceCreated) {
                    onServiceCreated();
                }
            });

        } catch (error) {
            console.error('Erro ao criar atendimento:', error);
            let errorMessage = 'Ocorreu um erro ao criar o atendimento.';

            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    errorMessage = 'Sua sessão expirou ou você não tem permissão para criar atendimentos.';
                } 
                else {
                    errorMessage = error.response.data.error || error.response.data.message || errorMessage;
                }
            } 
            else if (error.request) {
                errorMessage = 'Erro de rede: Servidor não responde. Verifique sua conexão.';
            }

            Swal.fire({
                icon: 'error',
                title: 'Erro na Criação!',
                text: errorMessage,
                confirmButtonText: 'Tentar Novamente'
            });

        } 
        finally {
            setLoading(false);
        }
    };

    return (
        /* Modal Criar Atendimento */
        <div className="modal fade" id="modalCreateService" tabIndex="-1" aria-labelledby="modalCreateServiceLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalCreateServiceLabel">
                            Criar Atendimento
                        </h6>

                        <form onSubmit={handleCreateService}>
                            <div className="item-input mb-3">
                                <label htmlFor="specialty">Titulo do Atendimento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="specialty"
                                    placeholder="Ex: exame de vista"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="locality">Local de Atendimento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="locality"
                                    placeholder="Local do atendimento"
                                    value={locality}
                                    onChange={(e) => setLocality(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="dataAtendimento">Data do Atendimento</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="dataAtendimento"
                                    value={serviceDate}
                                    onChange={(e) => setServiceDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="createServiceStartTime">Horário de Início</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="createServiceStartTime"
                                    value={serviceStartTime}
                                    onChange={(e) => setServiceStartTime(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="qtdSenhas">Quantidade de Senhas</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="qtdSenhas"
                                    placeholder="Quantidade de senhas"
                                    min="1"
                                    value={qtdAttendance}
                                    onChange={(e) => setQtdAttendance(e.target.value)}
                                    required
                                />
                            </div>

                            <button className="btn-default" type="submit" disabled={loading}>
                                {loading ? 'Criando...' : 'Criar Atendimento'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateServiceModal;