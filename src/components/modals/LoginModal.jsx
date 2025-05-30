import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';
import Swal from 'sweetalert2';
import usePasswordToggle from '../../hooks/usePasswordToggle';
import { useAuth } from '../../context/AuthContext';

function LoginModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPasswordStates, togglePasswordVisibility] = usePasswordToggle({
        loginSenha: false,
    });
    
    const { login } = useAuth();

    // Função de submissão do formulário de login
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                email,
                password,
            });

            Swal.fire({
                icon: 'success',
                title: 'Login Realizado!',
                text: 'Você está logado. Redirecionando...',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                login(response.data.token); 

                const modalElement = document.getElementById('modalLogin');
                if (modalElement) {
                    const bootstrapModal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                    bootstrapModal.hide();
                }

                setEmail('');
                setPassword('');
            });
        } 
        catch (error) {
            console.error('Erro no login:', error);
            let errorMessage = 'Ocorreu um erro inesperado ao tentar logar.';

            if (error.response) {
                errorMessage = error.response.data.error || 'Credenciais inválidas ou erro no servidor.';
            } else if (error.request) {
                errorMessage = 'Erro de rede: Servidor não responde. Verifique sua conexão.';
            } 
            
            Swal.fire({
                icon: 'error',
                title: 'Falha no Login!',
                text: errorMessage,
                confirmButtonText: 'Tentar Novamente'
            });

        } 
        finally {
            setLoading(false);
        }
    };

    return (
        /* Modal de Login */
        <div className="modal fade" id="modalLogin" tabIndex="-1" aria-labelledby="modalLoginLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalLoginLabel">Login</h6>

                        <form onSubmit={handleLoginSubmit}>
                            <div className="item-input mb-3">
                                <label className="icon-input" htmlFor="loginEmail">
                                    <i className="fa-solid fa-envelope"></i>
                                </label>

                                <input
                                    type="email"
                                    id="loginEmail"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="item-input password mb-3">
                                <label className="icon-input" htmlFor="loginSenha">
                                    <i className="fa-solid fa-lock"></i>
                                </label>

                                <input 
                                    type={showPasswordStates.loginSenha ? 'text' : 'password'}
                                    id="loginSenha" 
                                    placeholder="Digite sua senha" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button className="show-password" type="button" onClick={() => togglePasswordVisibility('loginSenha')}>
                                    {showPasswordStates.loginSenha ? 
                                        (<i className="fa-solid fa-eye-slash"></i>) : 
                                        (<i className="fa-solid fa-eye"></i>)
                                    }
                                </button>
                            </div>

                            <button className="btn-default mb-3" type="submit" disabled={loading}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>

                        <a className="forgot-password" href="#" data-bs-toggle="modal" data-bs-target="#modalRecover" data-bs-dismiss="modal">
                            Esqueceu a senha?
                        </a>

                        <div className="footer-login">
                            <span>
                                Não tem uma conta?

                                <a href="#" data-bs-toggle="modal" data-bs-target="#modalCadastro" data-bs-dismiss="modal">
                                    Cadastre-se
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;