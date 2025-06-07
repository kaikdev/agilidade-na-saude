import React from 'react';
import './ProviderInfoModal.css';

function ProviderInfoModal({ providerInfo }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const defaultProviderImage = null;
    
    const imageUrl = providerInfo?.image_url 
        ? `${API_BASE_URL}${providerInfo.image_url}` 
        : defaultProviderImage;
        
    return (
        /* Modal Mais Informações */
        <div className="modal fade" id="modalProviderInfo" tabIndex="-1" aria-labelledby="modalProviderInfoLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalProviderInfoLabel">
                            Mais Informações
                        </h6>

                        <form>
                            <div className="item-input mb-3">
                                <p>Foto do Profissional</p>

                                <div className="img-provider-info" id="providerImageInfoModal"
                                    style={{
                                        backgroundImage: `url('${imageUrl}')`
                                    }}
                                ></div>
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="providerNameInfoModal">Nome do Profissional</label>

                                <input
                                    type="text"
                                    id="providerNameInfoModal"
                                    className="form-control"
                                    value={providerInfo?.name || 'Não informado'}
                                    readOnly
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="providerSpecialtyInfoModal">Especialidade</label>

                                <input
                                    type="text"
                                    id="providerSpecialtyInfoModal"
                                    className="form-control"
                                    value={providerInfo?.specialty || 'Não informada'}
                                    readOnly
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="providerCrmInfoModal">CRM</label>

                                <input
                                    type="text"
                                    id="providerCrmInfoModal"
                                    className="form-control"
                                    value={providerInfo?.crm || 'Não informado'}
                                    readOnly
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="providerPresentationInfoModal">Apresentação</label>

                                <textarea
                                    className="form-control"
                                    id="providerPresentationInfoModal"
                                    rows="3"
                                    value={providerInfo?.presentation || 'Nenhuma apresentação disponível.'}
                                    readOnly
                                >
                                </textarea>
                            </div>

                            <button type="button" className="btn-default" data-bs-dismiss="modal" aria-label="Ok">
                                OK
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderInfoModal;