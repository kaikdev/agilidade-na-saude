import ServiceRegistrationModal from './modals/ServiceRegistrationModal';
import './DashboardUser.css';

function DashboardUser() {
    return (
        <main className="main-dashboard">
            <div className="title-user">
                <h3>Olá, Usuário!</h3>
                <p>Seja bem-vindo ao seu Dashboard.</p>
            </div>

            <section className="create-service">
                <h3 className="section-title">
                    <i className="fa-solid fa-briefcase-medical"></i>
                    Atendimentos Disponíveis
                </h3>

                <div className="service-empty">
                    <p>
                        <i className="fa-solid fa-circle-exclamation"></i>
                        Nenhum atendimento disponível.
                    </p>
                </div>

                <div className="services-list">
                    <div className="item-service">
                        <div className="body-service">
                            <h5>Titulo do Atendimento</h5>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-calendar-days"></i>
                                        Data:
                                    </span>
                                    29/05/2025
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-location-dot"></i>
                                        Local:
                                    </span>
                                    Praça do Forró
                                </p>
                            </div>
                            <div className="desc-service">
                                <p>
                                    <span>
                                        <i className="fa-solid fa-list-ol"></i>
                                        Senhas Disponíveis:
                                    </span>
                                    10
                                </p>
                            </div>

                            <div className="buttons-actions">
                                <button className="create-service" type="button" data-bs-toggle="modal" data-bs-target="#modalServiceRegistration">
                                    <i className="fa-solid fa-user-plus"></i>
                                    Participar
                                </button>

                                <button className="btn-edit" type="button">
                                    <i className="fa-solid fa-circle-info"></i>
                                    Mais Informações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ServiceRegistrationModal />
        </main>
    );
}

export default DashboardUser;