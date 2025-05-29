import React, { useState } from 'react';
import './ServiceModal.css';

function UpdateServiceModal() {

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

                        <form>
                            <div className="item-input mb-3">
                                <label htmlFor="specialtyUpdate">Especialidade</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    id="specialtyUpdate"
                                    placeholder="Especialidade do atendimento"
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="localityUpdate">Local</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    id="localityUpdate"
                                    placeholder="Local do atendimento"
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="dataAtendimentoUpdate">Data do Atendimento</label>
                                    
                                <input
                                    type="date"
                                    className="form-control"
                                    id="dataAtendimentoUpdate"
                                    required
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="qtdSenhasUpdate">Quantidade de Senhas</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    id="qtdSenhasUpdate"
                                    min="1"
                                    required
                                />
                            </div>

                            <button className="btn-default" type="submit">
                                Editar Atendimento
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateServiceModal;