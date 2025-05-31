import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Modal.css';
import Swal from 'sweetalert2';
import usePasswordToggle from '../../hooks/usePasswordToggle';

function UpdatePasswordModal({ isOpen, onClose, token, onPasswordResetSuccess }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const [showPasswordStates, togglePasswordVisibility] = usePasswordToggle({
        loginSenha: false,
    });

    const modalRef = useRef(null);
    const bsModalInstanceRef = useRef(null);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
            bsModalInstanceRef.current = new window.bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });

            const handleBootstrapCloseEvent = (event) => {
                if (isOpen && onClose && event.target === modalElement) {
                }
            };

            modalElement.addEventListener('hide.bs.modal', handleBootstrapCloseEvent);

            return () => {
                modalElement.removeEventListener('hide.bs.modal', handleBootstrapCloseEvent);
            };
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        if (bsModalInstanceRef.current) {
            if (isOpen) {
                bsModalInstanceRef.current.show();
            } else {
                bsModalInstanceRef.current.hide();
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setNewPassword('');
            setConfirmPassword('');
            setFormError('');
            setLoading(false); // Reseta o loading
        }
    }, [isOpen]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!newPassword || !confirmPassword) {
            setFormError('Por favor, preencha os dois campos de senha.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setFormError('As senhas não coincidem.');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`http://localhost:3000/api/reset-password/${token}`, {
                newPassword: newPassword
            });

            Swal.fire({
                icon: 'success',
                title: 'Senha Redefinida!',
                text: 'Sua senha foi alterada com sucesso. Você já pode fazer login com sua nova senha.',
                confirmButtonText: 'Ok, Entendido!'
            }).then(() => {
                if (onPasswordResetSuccess) {
                    onPasswordResetSuccess();
                }
            });
        } 
        catch (err) {
            console.error("Erro ao redefinir senha:", err);
            let errorMessage = "Não foi possível redefinir sua senha. O link pode ter expirado ou ser inválido.";
            
            if (err.response && err.response.data && err.response.data.error) {
                errorMessage = err.response.data.error;
            }

            Swal.fire({
                icon: 'error',
                title: 'Erro ao Redefinir',
                text: errorMessage,
                confirmButtonText: 'Tentar Novamente'
            });
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade" id="modalUpdatePassword" ref={modalRef} tabIndex="-1" aria-labelledby="modalUpdatePasswordLabel" aria-hidden={!isOpen} data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <h6 className="modal-title text-center mb-3" id="modalUpdatePasswordLabel">Redefinir Senha</h6>

                        {formError && <p className="text-danger text-center small">{formError}</p>}

                        <form onSubmit={handleFormSubmit}>
                            <div className="item-input password mb-3">
                                <label className="icon-input" htmlFor="newPasswordInput">
                                    <i className="fa-solid fa-lock"></i>
                                </label>

                                <input
                                    type={showPasswordStates.newPasswordInput ? 'text' : 'password'}
                                    id="newPasswordInput"
                                    placeholder="Digite sua nova senha"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />

                                <button
                                    className="show-password"
                                    type="button"
                                    onClick={() => togglePasswordVisibility('newPasswordInput')}
                                    aria-label={showPasswordStates.newPasswordInput ? "Esconder senha" : "Mostrar senha"}
                                >
                                    <i className={`fa-solid ${showPasswordStates.newPasswordInput ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>

                            <div className="item-input password mb-3">
                                <label className="icon-input" htmlFor="confirmNewPasswordInput">
                                    <i className="fa-solid fa-lock"></i>
                                </label>

                                <input
                                    type={showPasswordStates.confirmNewPasswordInput ? 'text' : 'password'}
                                    id="confirmNewPasswordInput"
                                    placeholder="Confirme sua nova senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />

                                <button
                                    className="show-password"
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirmNewPasswordInput')}
                                    aria-label={showPasswordStates.confirmNewPasswordInput ? "Esconder senha" : "Mostrar senha"}
                                >
                                    <i className={`fa-solid ${showPasswordStates.confirmNewPasswordInput ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>

                            <button className="btn-default mb-3 w-100" type="submit" disabled={loading}>
                                {loading ? 'Atualizando...' : 'Redefinir Senha'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdatePasswordModal;