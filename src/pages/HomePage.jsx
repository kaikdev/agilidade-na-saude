import React, { useState } from 'react';
import './HomePage.css';
import imgDoctor from '../assets/images/doctor.png';
import imgTempo from '../assets/images/economia-de-tempo.png';
import imgEcologico from '../assets/images/ecologico.png';
import imgAcesso from '../assets/images/tecnologia.png';



function HomePage() {
    return (
        <main className="main-home">
            <section className="section-main">
                <div className="title-main">
                    <h1>Organize suas filas de atendimento médico gratuito com o Agilidade na Saúde!</h1>

                    <p>Um sistema eficiente para gerenciar o fluxo de pacientes e otimizar o acesso aos serviços de saúde.</p>
                </div>

                <img src={imgDoctor} className="img-main"  alt="Logo Agilidade na Saúde" width="400px" height="auto"/>
            </section>

            <section className="section-quality">
                <div className="item-quality">
                    <div className="img-quality">
                        <img src={imgTempo}  alt="Imagem Agilidade" width="80px" height="auto"/>
                    </div>

                    <h4>Agilidade</h4>

                    <p>Otimize seu tempo de espera e o processo de atendimento, garantindo acesso mais rápido e eficiente aos serviços de saúde gratuitos.</p>
                </div>
                
                <div className="item-quality">
                    <div className="img-quality">
                        <img src={imgEcologico}  alt="Imagem Ecológico" width="80px" height="auto"/>
                    </div>

                    <h4>Ecológico</h4>

                    <p>Contribua para o meio ambiente. Nossa fila online elimina a necessidade de senhas de papel, reduzindo o desperdício e a pegada ecológica.</p>
                </div>
                    
                <div className="item-quality">
                    <div className="img-quality">
                        <img src={imgAcesso}  alt="Imagem Acesso" width="80px" height="auto"/>
                    </div>

                    <h4>Acesso Fácil</h4>

                    <p>Conectamos você aos serviços de saúde gratuitos de maneira simples e intuitiva, a apenas alguns cliques de distância.</p>
                </div>
            </section>
        </main>
    );
}

export default HomePage;