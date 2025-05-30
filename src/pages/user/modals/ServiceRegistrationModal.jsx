import './ServiceRegistrationModal.css';

function ServiceRegistrationModal() {
    return (
        /* Modal Inserir User em Atendimento */
        <div className="modal fade" id="modalServiceRegistration" tabIndex="-1" aria-labelledby="modalServiceRegistrationLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalServiceRegistrationLabel">
                            Participar do Atendimento
                        </h6>

                        <form>
                            <div className="item-input mb-3">
                                <label htmlFor="specialty">Selecionar Prioridades</label>
                            </div>
                                
                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="priorities0" />

                                    <label className="form-check-label" for="priorities0">
                                        Nenhuma prioridade
                                    </label>
                                </div>

                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="priorities1" />

                                    <label className="form-check-label" for="priorities1">
                                        PCD - Pessoa com Deficiência
                                    </label>
                                </div>

                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="priorities2" />

                                    <label className="form-check-label" for="priorities2">
                                        Idoso
                                    </label>
                                </div>

                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="priorities3" />

                                    <label className="form-check-label" for="priorities3">
                                        Grávida
                                    </label>
                                </div>

                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="priorities4" />

                                    <label className="form-check-label" for="priorities4">
                                        Lactante
                                    </label>
                                </div>

                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="priorities5" />

                                    <label className="form-check-label" for="priorities5">
                                        Mobilidade Reduzida (Temporária ou Permanente)
                                    </label>
                                </div>

                            <button className="btn-default" type="submit">
                                Gerar Senha
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceRegistrationModal;