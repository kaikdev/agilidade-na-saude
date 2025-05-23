import React, { useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import './HomePage.css';
import imgDoctor from '../assets/images/doctor.png';
import imgTempo from '../assets/images/economia-de-tempo.png';
import imgEcologico from '../assets/images/ecologico.png';
import imgAcesso from '../assets/images/tecnologia.png';
import imgSobre from '../assets/images/sobre.jpg';
import imgPessoa1 from '../assets/images/pessoa-1.jpg';
import imgPessoa2 from '../assets/images/pessoa-2.jpg';
import imgPessoa3 from '../assets/images/pessoa-3.jpg';
import imgPessoa4 from '../assets/images/pessoa-4.jpg';
import imgPessoa5 from '../assets/images/pessoa-5.jpg';
import imgPessoa6 from '../assets/images/pessoa-6.jpg';
import imgPessoa7 from '../assets/images/pessoa-7.jpg';
import imgPessoa8 from '../assets/images/pessoa-8.jpg';

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

            <section className="section-depoiments" id="depoimentos">
                <h6 className="tag-section">Depoimentos</h6>

                <h2>
                    O que os clientes dizem
                    <br></br>
                    sobre nosso sistema
                </h2>

                <Splide
                    options={{
                        type: 'loop',
                        perPage: 3,
                        perMove: 1,
                        autoplay: true,
                        interval: 3000,
                        gap: '1rem',
                        breakpoints: {
                            900: {
                                perPage: 2,
                                interval: 5000
                            },
                            600: {
                                perPage: 1,
                            }
                        }
                    }}
                    aria-label="Carrossel de Depoimentos" tag="section" id="splide-depoimentos">

                    <SplideSlide>
                        <div className="item-depoiment">
                            <div className="area-img" style={{backgroundImage: `url(${imgPessoa1})`}}>
                            </div>

                            <p className="name-depoiment">
                                Maria Eduarda
                            </p>

                            <p className="desc-depoiment">
                                Nunca foi tão fácil agendar! Chega de filas gigantes e horas de espera. Agora consigo organizar tudo do meu celular. O sistema é muito prático e mudou minha rotina. Super recomendo a todos!
                            </p>
                        </div>
                    </SplideSlide>

                    <SplideSlide>
                        <div className="item-depoiment">
                            <div className="area-img" style={{backgroundImage: `url(${imgPessoa2})`}}>
                            </div>

                            <p className="name-depoiment">
                                João Pedro
                            </p>

                            <p className="desc-depoiment">
                                Fui surpreendido pela facilidade de uso do sistema. É intuitivo e me ajudou muito a conseguir uma consulta gratuita sem estresse. Menos papel, mais agilidade, tudo o que eu buscava.
                            </p>
                        </div>
                    </SplideSlide>

                    <SplideSlide>
                        <div className="item-depoiment">
                            <div className="area-img" style={{backgroundImage: `url(${imgPessoa3})`}}>
                            </div>

                            <p className="name-depoiment">
                                Ana Clara
                            </p>

                            <p className="desc-depoiment">
                                O Agilidade na Saúde é demais! Antes, eu perdia muito tempo esperando, mas agora acompanho tudo online. Consigo cuidar da minha saúde sem complicação. É a inovação que o Brasil precisava.
                            </p>
                        </div>    
                    </SplideSlide>
                    
                    <SplideSlide>
                        <div className="item-depoiment">
                            <div className="area-img" style={{backgroundImage: `url(${imgPessoa4})`}}>
                            </div>

                            <p className="name-depoiment">
                                Lucas Gabriel
                            </p>

                            <p className="desc-depoiment">
                                Que diferença faz um sistema organizado! Agora sei a hora certa de sair de casa para meu atendimento. Acabou a agonia das filas. É uma ferramenta essencial para a saúde pública gratuita.
                            </p>
                        </div>
                    </SplideSlide>

                    <SplideSlide>
                        <div className="item-depoiment">
                            <div className="area-img" style={{backgroundImage: `url(${imgPessoa5})`}}>
                            </div>

                            <p className="name-depoiment">
                                Isabela Ferreira
                            </p>

                            <p className="desc-depoiment">
                                Finalmente um sistema que pensa na gente! Consigo ver minha posição na fila e sou avisada quando está perto. É muito mais cômodo e seguro. Parabéns à equipe do Agilidade na Saúde!
                            </p>
                        </div>  
                    </SplideSlide>
                    
                    <SplideSlide>
                        <div className="item-depoiment">
                            <div className="area-img" style={{backgroundImage: `url(${imgPessoa6})`}}>
                            </div>

                            <p className="name-depoiment">
                                Rafael Rodrigues
                            </p>

                            <p className="desc-depoiment">
                                Com o Agilidade na Saúde, o tempo de espera diminuiu muito. Posso usar esse tempo para outras coisas importantes. É um avanço enorme para quem precisa de atendimento gratuito. Fantástico!
                            </p>
                        </div>
                    </SplideSlide>

                    <SplideSlide>
                        <div className="item-depoiment">
                            <div className="area-img" style={{backgroundImage: `url(${imgPessoa7})`}}>
                            </div>

                            <p className="name-depoiment">
                                Beatriz Pereira
                            </p>

                            <p className="desc-depoiment">
                                Eu tinha receio, mas o aplicativo é muito simples e funcional. Consegui agendar minha consulta em poucos cliques. O benefício de não pegar fila é incrível. Uma ferramenta indispensável hoje.
                            </p>
                        </div>  
                    </SplideSlide>

                    <SplideSlide>
                        <div className="item-depoiment">
                            <div className="area-img" style={{backgroundImage: `url(${imgPessoa8})`}}>
                            </div>

                            <p className="name-depoiment">
                                Guilherme Alves
                            </p>

                            <p className="desc-depoiment">
                                É impressionante como o Agilidade na Saúde otimiza tudo. Acompanho a fila de casa e sou chamado na hora certa. Isso realmente facilita o acesso ao médico sem custo. Grande iniciativa!
                            </p>
                        </div>
                    </SplideSlide>
                </Splide>
            </section>


        </main>
    );
}

export default HomePage;