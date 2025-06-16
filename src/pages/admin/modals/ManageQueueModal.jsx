import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';
import './ManageQueueModal.css';

function ManageQueueModal({ serviceId, onQueueUpdate }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { token } = useAuth();

    const [queue, setQueue] = useState([]);
    const [nextPatient, setNextPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchQueue = useCallback(async () => {
        if (!serviceId) return;

        setIsLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/scheduled/getMyQueries/${serviceId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQueue(response.data.queue || []);
            setNextPatient(response.data.next_patient_to_finalize || null);
        }
        catch (err) {
            setError('Não foi possível carregar a fila. Pode ser que não haja pacientes.');
            setQueue([]);
            setNextPatient(null);
        }
        finally {
            setIsLoading(false);
        }
    }, [serviceId, token, API_BASE_URL]);

    useEffect(() => {
        if (serviceId) {
            fetchQueue();
        }
    }, [serviceId, fetchQueue]);

    const handlePrioritize = async (patientId) => {
        try {
            await axios.put(`${API_BASE_URL}/api/admin/appointments/prioritizePatient/${patientId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire('Sucesso!', 'Paciente priorizado.', 'success');
            fetchQueue();
        }
        catch (err) {
            Swal.fire('Erro!', 'Não foi possível priorizar o paciente.', 'error');
        }
    };

    const handleFinalizeNext = async () => {
        if (!nextPatient) return;

        try {
            await axios.put(`${API_BASE_URL}/api/admin/scheduled/appointments/finalize/${nextPatient.scheduled_id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire('Sucesso!', `${nextPatient.user_name} foi chamado. A fila andou.`, 'success');
            fetchQueue();
        }
        catch (err) {
            Swal.fire('Erro!', 'Não foi possível chamar o próximo paciente.', 'error');
        }
    };

    const handleArchiveService = async () => {
        const result = await Swal.fire({
            title: 'Encerrar Atendimento?',
            text: "Isso irá gerar o histórico e limpar a fila de atendidos. Esta ação não pode ser desfeita.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, encerrar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.post(`${API_BASE_URL}/api/admin/service/archive/${serviceId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                await Swal.fire('Encerrado!', 'O atendimento foi arquivado com sucesso.', 'success');

                const modalInstance = window.bootstrap.Modal.getInstance(document.getElementById('modalManageQueue'));
                
                if (modalInstance) {
                    modalInstance.hide();
                }

                if (onQueueUpdate) {
                    onQueueUpdate();
                }

            } catch (err) {
                Swal.fire('Erro!', 'Não foi possível arquivar. Verifique se todos os pacientes foram chamados.', 'error');
            }
        }
    };

    return (
        <div className="modal fade" id="modalManageQueue" tabIndex="-1" aria-labelledby="modalManageQueueLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalManageQueueLabel">
                            Gerenciar Fila de Atendimento
                        </h6>

                        {isLoading ? (
                            <p>Carregando fila...</p>
                        ) : error ? (
                            <div className="alert alert-warning">{error}</div>
                        ) : (
                            <>
                                <div className="queue-controls">
                                    <button className="btn btn-success" onClick={handleFinalizeNext}
                                        disabled={!nextPatient}>
                                        <i className="fa-solid fa-bullhorn"></i>
                                        Chamar Próximo ({nextPatient ? nextPatient.password : '---'})
                                    </button>

                                    <button className="btn btn-danger" onClick={handleArchiveService}
                                        disabled={queue.length > 0}
                                        title={queue.length > 0 ? "Finalize todos os atendimentos antes de arquivar" : "Encerrar e gerar histórico"}>
                                        <i className="fa-solid fa-folder"></i>
                                        Encerrar Atendimento
                                    </button>
                                </div>

                                {queue.length > 0 ? (
                                    <>
                                        <h6 className="title-queue mt-3 mb-2">
                                            Pacientes na Fila de Espera
                                        </h6>

                                        <ul className="list-group patient-queue-list">
                                            {queue.map((patient, index) => (
                                                <li key={patient.scheduled_id} className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <span className="fw-bold me-2">{index + 1}º</span>
                                                        <span>{patient.user_name}</span>
                                                        <span className="badge text-bg-primary ms-2">{patient.password}</span>
                                                    </div>

                                                    {index > 0 && (
                                                        <button className="btn btn-sm btn-warning"
                                                            onClick={() => handlePrioritize(patient.scheduled_id)}>
                                                            <i className="fa-solid fa-up-long"></i>
                                                            Priorizar
                                                        </button>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <p className="text-center empty mt-3">
                                        A fila de espera está vazia.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageQueueModal;