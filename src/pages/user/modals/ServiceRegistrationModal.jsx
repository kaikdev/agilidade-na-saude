import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';
import './ServiceRegistrationModal.css';

function ServiceRegistrationModal({ selectedService, priorities, onServiceRegistered, onModalActuallyClosed }) {
    const [selectedPriorityId, setSelectedPriorityId] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();
    const modalRef = useRef(null);
    const wasRegistrationSuccessfulRef = useRef(false);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement) return;

        const handleModalCompletelyHidden = () => {
            setSelectedPriorityId('');
            if (onModalActuallyClosed) {
                onModalActuallyClosed();
            }

            if (wasRegistrationSuccessfulRef.current && onServiceRegistered) {
                onServiceRegistered();
                wasRegistrationSuccessfulRef.current = false;
            }
        };

        modalElement.addEventListener('hidden.bs.modal', handleModalCompletelyHidden);
        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleModalCompletelyHidden);
        };
    }, [onModalActuallyClosed, onServiceRegistered]);

    useEffect(() => {
        if (selectedService) {
            setSelectedPriorityId('');
            wasRegistrationSuccessfulRef.current = false;
        }
    }, [selectedService]);

    const handlePriorityChange = (e) => {
        setSelectedPriorityId(e.target.value);
    };

    const handleRegisterService = async (e) => {
        e.preventDefault();
        setLoading(true);
        wasRegistrationSuccessfulRef.current = false;

        if (!selectedService || !selectedService.id) {
            Swal.fire({
                icon: 'error', title: 'Erro!',
                text: 'Nenhum atendimento selecionado para inscrição.',
                confirmButtonText: 'Ok'
            }).then(() => setLoading(false));
            return;
        }

        let priorityToSend = { nome: "Comum", nivel: 99 };
        if (selectedPriorityId) {
            const chosenPriority = priorities.find(p => p.id === parseInt(selectedPriorityId));
            if (chosenPriority) {
                priorityToSend = { nome: chosenPriority.nome, nivel: chosenPriority.nivel };
            }
        }

        try {
            const payload = {
                priority: priorityToSend.nome,
                level: priorityToSend.nivel,
            };

            const response = await axios.post(`http://localhost:3000/api/users/appointments/createListOfService/${selectedService.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const apiResponseData = response.data.data;

            if (apiResponseData && apiResponseData.success) {
                wasRegistrationSuccessfulRef.current = true;

                Swal.fire({
                    icon: 'success',
                    title: 'Inscrição Confirmada!',
                    html: `Seu agendamento para <strong>${selectedService.specialty}</strong> foi realizado.<br>Sua senha é: <strong>${apiResponseData.password}</strong><br>Prioridade: <strong>${apiResponseData.priority}</strong>`,
                    confirmButtonText: 'Ok',
                    didClose: () => {
                        const modalElement = modalRef.current;
                        if (modalElement) {
                            const bootstrapModalInstance = window.bootstrap.Modal.getInstance(modalElement);
                            if (bootstrapModalInstance) {
                                bootstrapModalInstance.hide();
                            }
                        }
                    }
                });
            } 
            else {
                const message = apiResponseData?.message || response.data?.message || 'Erro desconhecido ao processar a inscrição.';
                throw new Error(message);
            }
        } 
        catch (error) {
            console.error('Erro ao participar do atendimento:', error);

            let errorMessage = 'Ocorreu um erro ao participar do atendimento.';

            if (error.response) {
                errorMessage = error.response.data.error || error.response.data.message || `Erro ${error.response.status}`;
            } 
            else if (error.request) {
                errorMessage = 'Erro de rede. Tente novamente.';
            } 
            else if (error.message) {
                errorMessage = error.message;
            }
            Swal.fire({
                icon: 'error',
                title: 'Erro na Inscrição',
                text: errorMessage,
                confirmButtonText: 'Ok'
            });
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="modalServiceRegistration" ref={modalRef} tabIndex="-1" aria-labelledby="modalServiceRegistrationLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalServiceRegistrationLabel">Participar do Atendimento</h6>

                        {selectedService ? (
                            <>
                                <div className="item-input mb-3">
                                    <label>Você está se inscrevendo para:</label>
                                    <input type="text" className="form-control" value={selectedService.specialty} readOnly />
                                </div>

                                <div className="item-input mb-3">
                                    <label>Local de Atendimento</label>
                                    <input type="text" className="form-control" value={selectedService.locality} readOnly />
                                </div>

                                <div className="item-input mb-3">
                                    <label>Data de Atendimento</label>
                                    <input type="text" className="form-control" value={selectedService.service_date ? new Date(selectedService.service_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'} readOnly />
                                </div>

                                <div className="item-input mb-3">
                                    <label>Senhas Disponíveis</label>
                                    <input type="text" className="form-control" value={selectedService.qtd_attendance} readOnly />
                                </div>

                                <form onSubmit={handleRegisterService}>
                                    <div className="item-input mb-3">
                                        <label htmlFor="prioritySelect">Selecionar Prioridade (opcional)</label>
                                        <select
                                            className="form-select"
                                            id="prioritySelect"
                                            value={selectedPriorityId}
                                            onChange={handlePriorityChange}
                                            disabled={!selectedService}
                                        >
                                            <option value="">Nenhuma prioridade (senha comum)</option>

                                            {priorities.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nome} (Nível: {p.nivel})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <button className="btn-default" type="submit" disabled={loading || !selectedService}>
                                        {loading ? 'Gerando Senha...' : 'Gerar Senha'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <p>Selecione um atendimento para participar.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceRegistrationModal;