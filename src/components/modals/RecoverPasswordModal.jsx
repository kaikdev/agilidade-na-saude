import React, { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Modal.css';

function RecoverPasswordModal() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const modalRef = useRef(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleRecoverPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obrigatório',
                text: 'Por favor, insira seu endereço de e-mail.',
                confirmButtonText: 'Ok'
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/forgot-password`, { email });

            Swal.fire({
                icon: 'info',
                title: 'Solicitação Enviada',
                text: response.data.message || "Se um e-mail correspondente for encontrado em nosso sistema, um link para redefinição de senha será enviado.",
                confirmButtonText: 'Ok'
            }).then(() => {
                setEmail('');

                if (modalRef.current) {
                    const modalInstance = window.bootstrap.Modal.getInstance(modalRef.current);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            });

        } catch (error) {
            console.error('Erro ao solicitar recuperação de senha:', error);
            let errorMessage = "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.";

            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            Swal.fire({
                icon: 'error',
                title: 'Erro na Solicitação',
                text: errorMessage,
                confirmButtonText: 'Ok'
            });
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        /* Modal de Recuperação */
        <div className="modal fade" id="modalRecover" tabIndex="-1" aria-labelledby="modalRecoverLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalRecoverLabel">Recuperar Senha</h6>

                        <form onSubmit={handleRecoverPasswordSubmit}> 
                            <div className="item-input mb-3">
                                <label className="icon-input" htmlFor="recoverEmail">
                                    <i className="fa-solid fa-envelope"></i>
                                </label>

                                <input
                                    type="email"
                                    id="recoverEmail"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button className="btn-default" type="submit" disabled={loading}>
                                {loading ? 'Enviando...' : 'Recuperar'}
                            </button>
                        </form>

                        <div className="footer-login">
                            <span>
                                Lembrou a sua senha?

                                <a href="#" data-bs-toggle="modal" data-bs-target="#modalLogin" data-bs-dismiss="modal">
                                    Entrar
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecoverPasswordModal;