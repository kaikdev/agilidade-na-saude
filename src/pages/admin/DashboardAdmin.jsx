import React, { useState, useEffect } from 'react';
import CreateServiceModal from './modals/CreateServiceModal';
import './DashboardAdmin.css';

function DashboardAdmin() {
    return (
        <main className="main-dashboard">
            <div className="title-user">
                <h3>Olá, Usuário!</h3>

                <p>Seja bem-vindo ao seu Dashboard.</p>
            </div>
            

            <section className="create-service">
                <h3 className="section-title">
                    <i className="fa-solid fa-briefcase-medical"></i>
                    Atendimentos
                </h3>

                <div className="service-empty">
                    <p>
                        <i className="fa-solid fa-circle-exclamation"></i>
                        Nenhum atendimento cadastrado ainda.
                    </p>
                </div>
                
                <div className="services-list">
                    <div className="item-service">
                        <div className="body-service">
                            <h5>Cardiologista</h5>

                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-calendar-days"></i>
                                        Data:
                                    </span>

                                    25/10/2025
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-location-dot"></i>
                                        Local:
                                    </span>

                                    Fatec da Zona Leste
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-list-ol"></i>
                                        Qtd. de Senhas:
                                    </span>

                                    10
                                </p>
                            </div>

                            <div className="buttons-actions">
                                <button className="btn-edit" type="button">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    Editar
                                </button>

                                <button className="btn-delete" type="button">
                                    <i className="fa-solid fa-trash-can"></i>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="item-service">
                        <div className="body-service">
                            <h5>Cardiologista</h5>

                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-calendar-days"></i>
                                        Data:
                                    </span>

                                    25/10/2025
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-location-dot"></i>
                                        Local:
                                    </span>

                                    Fatec da Zona Leste
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-list-ol"></i>
                                        Qtd. de Senhas:
                                    </span>

                                    10
                                </p>
                            </div>

                            <div className="buttons-actions">
                                <button className="btn-edit" type="button">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    Editar
                                </button>

                                <button className="btn-delete" type="button">
                                    <i className="fa-solid fa-trash-can"></i>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="item-service">
                        <div className="body-service">
                            <h5>Cardiologista</h5>

                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-calendar-days"></i>
                                        Data:
                                    </span>

                                    25/10/2025
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-location-dot"></i>
                                        Local:
                                    </span>

                                    Fatec da Zona Leste
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-list-ol"></i>
                                        Qtd. de Senhas:
                                    </span>

                                    10
                                </p>
                            </div>

                            <div className="buttons-actions">
                                <button className="btn-edit" type="button">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    Editar
                                </button>

                                <button className="btn-delete" type="button">
                                    <i className="fa-solid fa-trash-can"></i>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="item-service">
                        <div className="body-service">
                            <h5>Cardiologista</h5>

                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-calendar-days"></i>
                                        Data:
                                    </span>

                                    25/10/2025
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-location-dot"></i>
                                        Local:
                                    </span>

                                    Fatec da Zona Leste
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-list-ol"></i>
                                        Qtd. de Senhas:
                                    </span>

                                    10
                                </p>
                            </div>

                            <div className="buttons-actions">
                                <button className="btn-edit" type="button">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    Editar
                                </button>

                                <button className="btn-delete" type="button">
                                    <i className="fa-solid fa-trash-can"></i>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-service">
                    <button className="create-service" type="button" data-bs-toggle="modal" data-bs-target="#modalCreateService">
                        Criar Atendimento
                    </button>
                </div>
            </section>

            <CreateServiceModal />
        </main>
    );
}

export default DashboardAdmin;