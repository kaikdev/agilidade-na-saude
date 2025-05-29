import React, { useState } from 'react';
import './CreateServiceModal.css';

function CreateServiceModal() {

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

                        <form>
                            <div className="item-input mb-3">
                                <label htmlFor="specialty">Especialidade</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    id="specialty"
                                    placeholder="Especialidade do atendimento"
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="locality">Local</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    id="locality"
                                    placeholder="Local do atendimento"
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="dataAtendimento">Data do Atendimento</label>
                                    
                                <input
                                    type="date"
                                    className="form-control"
                                    id="dataAtendimento"
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="qtdSenhas">Quantidade de Senhas</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    id="qtdSenhas"
                                    min="1"
                                    required
                                />
                            </div>

                            <button className="btn-default" type="submit">
                                Criar Atendimento
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateServiceModal;