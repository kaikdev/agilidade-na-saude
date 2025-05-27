import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';
import usePasswordToggle from '../../hooks/usePasswordToggle';

function LoginModal() {
    const [showPasswordStates, togglePasswordVisibility] = usePasswordToggle({
        loginSenha: false,
    });
    
    return (
        /* Modal de Login */
        <div className="modal fade" id="modalLogin" tabIndex="-1" aria-labelledby="modalLoginLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalLoginLabel">Login</h6>

                        <form htmlFor="#">
                            <div className="item-input mb-3">
                                <label className="icon-input" htmlFor="loginEmail">
                                    <i className="fa-solid fa-envelope"></i>
                                </label>

                                <input type="email" id="loginEmail" placeholder="Digite seu email" />
                            </div>

                            <div className="item-input password mb-3">
                                <label className="icon-input" htmlFor="loginSenha">
                                    <i className="fa-solid fa-lock"></i>
                                </label>

                                <input 
                                    type={showPasswordStates.loginSenha ? 'text' : 'password'}
                                    id="loginSenha" 
                                    placeholder="Digite sua senha" 
                                />

                                <button className="show-password" type="button" onClick={() => togglePasswordVisibility('loginSenha')}>
                                    {showPasswordStates.loginSenha ? 
                                        (<i className="fa-solid fa-eye-slash"></i>) : 
                                        (<i className="fa-solid fa-eye"></i>)
                                    }
                                </button>
                            </div>

                            <button className="btn-default mb-3" type="submit">Entrar</button>
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