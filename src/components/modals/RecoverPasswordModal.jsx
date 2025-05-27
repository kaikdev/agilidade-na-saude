import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';

function RecoverPasswordModal() {
    return (
        /* Modal de Recuperação */
        <div className="modal fade" id="modalRecover" tabIndex="-1" aria-labelledby="modalRecoverLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalRecoverLabel">Recuperar Senha</h6>

                        <form htmlFor="#">
                            <div className="item-input mb-3">
                                <label className="icon-input" htmlFor="recoverEmail">
                                    <i className="fa-solid fa-envelope"></i>
                                </label>

                                <input type="email" id="recoverEmail" placeholder="Digite seu email" />
                            </div>

                            <button className="btn-default" type="submit">Recuperar</button>
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