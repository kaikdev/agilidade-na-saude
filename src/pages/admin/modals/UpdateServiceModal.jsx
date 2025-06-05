import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';
import './ServiceModal.css';

function UpdateServiceModal({ selectedAppointment, onServiceUpdated }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    const [specialty, setSpecialty] = useState('');
    const [locality, setLocality] = useState('');
    const [serviceDate, setServiceDate] = useState('');
    const [serviceStartTime, setServiceStartTime] = useState('');
    const [qtdAttendance, setQtdAttendance] = useState('');
    const [loading, setLoading] = useState(false);

    const { token } = useAuth();

    useEffect(() => {
        if (selectedAppointment) {
            setSpecialty(selectedAppointment.specialty || '');
            setLocality(selectedAppointment.locality || '');
            setQtdAttendance(selectedAppointment.qtd_attendance || '');
            
            const dateTimeString = selectedAppointment.service_date;

            if (typeof dateTimeString === 'string' && dateTimeString.includes(' ')) {
                const [datePart, timePart] = dateTimeString.split(' ');

                setServiceDate(datePart);
                setServiceStartTime(timePart.slice(0, 5));
            } else {
                setServiceDate('');
                setServiceStartTime('');
            }
        } else {
            setSpecialty('');
            setLocality('');
            setServiceDate('');
            setServiceStartTime('');
            setQtdAttendance('');
        }
    }, [selectedAppointment]);

    const formatDateTimeForAPI = (dateString, timeString) => {
        if (!dateString || !timeString) return ''; 
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year} ${timeString}`;
    };

    const handleUpdateService = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!selectedAppointment || !selectedAppointment.id) {
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Nenhum atendimento selecionado para edição.',
                confirmButtonText: 'Ok'
            });

            setLoading(false);

            return;
        }

        try {
            const formattedServiceDateTime = formatDateTimeForAPI(serviceDate, serviceStartTime);

            const payload = {
                specialty: specialty,
                locality: locality,
                qtd_attendance: parseInt(qtdAttendance),
                service_date: formattedServiceDateTime,
            };

            const response = await axios.put(`${API_BASE_URL}/api/admin/appointments/update/${selectedAppointment.id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Atendimento Atualizado!',
                text: response.data.message || 'Atendimento atualizado com sucesso!',
                confirmButtonText: 'Ok'
            }).then(() => {
                const modalElement = document.getElementById('modalUpdateService');
                if (modalElement) {
                    const bootstrapModal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
                    bootstrapModal.hide();
                }

                if (onServiceUpdated) {
                    onServiceUpdated();
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar atendimento:', error);
            let errorMessage = 'Ocorreu um erro ao atualizar o atendimento.';

            if (error.response) {
                if (error.response.status === 401 || error.response.status === 403) {
                    errorMessage = 'Sua sessão expirou ou você não tem permissão para editar.';
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
                title: 'Erro na Atualização!',
                text: errorMessage,
                confirmButtonText: 'Tentar Novamente'
            });

        } 
        finally {
            setLoading(false);
        }
    };

    return (
        /* Modal Editar Atendimento */
        <div className="modal fade" id="modalUpdateService" tabIndex="-1" aria-labelledby="modalUpdateServiceLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalUpdateServiceLabel">
                            Editar Atendimento
                        </h6>

                        <form onSubmit={handleUpdateService}>
                            <div className="item-input mb-3">
                                <label htmlFor="specialtyUpdate">Títudo do Atendimento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="specialtyUpdate"
                                    placeholder="Especialidade do atendimento"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="localityUpdate">Local do Atendimento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="localityUpdate"
                                    placeholder="Local do atendimento"
                                    value={locality}
                                    onChange={(e) => setLocality(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="dataAtendimentoUpdate">Data do Atendimento</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="dataAtendimentoUpdate"
                                    value={serviceDate}
                                    onChange={(e) => setServiceDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="updateServiceStartTime">Horário de Início</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="updateServiceStartTime"
                                    value={serviceStartTime}
                                    onChange={(e) => setServiceStartTime(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="qtdSenhasUpdate">Quantidade de Senhas</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="qtdSenhasUpdate"
                                    placeholder="Quantidade de senhas"
                                    min="1"
                                    value={qtdAttendance}
                                    onChange={(e) => setQtdAttendance(e.target.value)}
                                    required
                                />
                            </div>

                            <button className="btn-default" type="submit" disabled={loading}>
                                {loading ? 'Atualizando...' : 'Editar Atendimento'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateServiceModal;