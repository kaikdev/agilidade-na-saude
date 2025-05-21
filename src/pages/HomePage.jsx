import React, { useState } from 'react';
import './HomePage.css';
import imgDoctor from '../assets/images/doctor.png';
import imgTempo from '../assets/images/economia-de-tempo.png';
import imgEcologico from '../assets/images/ecologico.png';
import imgAcesso from '../assets/images/tecnologia.png';
import imgSobre from '../assets/images/sobre.jpg';

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

                    <h5>Agilidade</h5>

                    <p>Otimize seu tempo de espera e o processo de atendimento, garantindo acesso mais rápido e eficiente aos serviços de saúde gratuitos.</p>
                </div>
                
                <div className="item-quality">
                    <div className="img-quality">
                        <img src={imgEcologico}  alt="Imagem Ecológico" width="80px" height="auto"/>
                    </div>

                    <h5>Ecológico</h5>

                    <p>Contribua para o meio ambiente. Nossa fila online elimina a necessidade de senhas de papel, reduzindo o desperdício e a pegada ecológica.</p>
                </div>
                    
                <div className="item-quality">
                    <div className="img-quality">
                        <img src={imgAcesso}  alt="Imagem Acesso" width="80px" height="auto"/>
                    </div>

                    <h5>Acesso Fácil</h5>

                    <p>Conectamos você aos serviços de saúde gratuitos de maneira simples e intuitiva, a apenas alguns cliques de distância.</p>
                </div>
            </section>

            <section className="section-about" id="sobre">
                <div className="area-img">
                    <img src={imgSobre}  alt="Imagem Sobre" width="650px" height="auto"/>
                </div>

                <div>
                    <h6 className="tag-section">Sobre o sistema</h6>

                    <h2>O que é o <strong>Agilidade na Saúde?</strong> </h2>
                    
                    <p>
                        O <strong>Agilidade na Saúde</strong> é um sistema online criado para organizar as filas de atendimento médico gratuito.
                        
                        <br></br>
                        
                        Nosso objetivo é simplificar e agilizar o acesso à saúde, eliminando a espera presencial e as senhas de papel, o que também contribui para o meio ambiente. 
                        Com ele, você acompanha sua posição na fila de forma digital, garantindo um atendimento mais eficiente e digno para todos.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default HomePage;