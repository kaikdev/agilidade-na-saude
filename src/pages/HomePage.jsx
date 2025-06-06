import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
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
import imgFaq from '../assets/images/faq.jpg';
import imgContato from '../assets/images/contato.jpg';
import UpdatePasswordModal from '../components/modals/UpdatePasswordModal';

function HomePage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [activeResetToken, setActiveResetToken] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tokenFromQuery = queryParams.get('resetToken');

        const tokenToUse = tokenFromQuery;

        if (tokenToUse) {
            console.log("Token de redefinição encontrado na URL:", tokenToUse);
            setActiveResetToken(tokenToUse);
            setIsResetModalOpen(true);
        }
    }, [location, navigate]);

    const handleModalClose = () => {
        setIsResetModalOpen(false);
        setActiveResetToken(null);

        navigate(location.pathname, { replace: true });
    };

    const handlePasswordSuccessfullyReset = () => {
        setIsResetModalOpen(false);
        setActiveResetToken(null);

        window.location.href = '/';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !email || !mensagem) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção!',
                text: 'Por favor, preencha todos os campos do formulário.',
            });

            return;
        }

        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/contato`, { nome, email, mensagem });
            
            Swal.fire({
                icon: 'success',
                title: 'Enviado!',
                text: 'Sua mensagem foi enviada com sucesso. Agradecemos o seu contato!',
            });

            setNome('');
            setEmail('');
            setMensagem('');

        } 
        catch (error) {
            const errorMessage = error.response?.data?.error || 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente mais tarde.';

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            });
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <main className="main-home">
            <section className="section-main">
                <div className="title-main">
                    <h1>Organize suas filas de atendimento médico gratuito com o Agilidade na Saúde!</h1>

                    <p>Um sistema eficiente para gerenciar o fluxo de pacientes e otimizar o acesso aos serviços de saúde.</p>
                </div>

                <img src={imgDoctor} className="img-main" alt="Logo Agilidade na Saúde" width="400px" height="auto" />
            </section>

            <section className="section-quality">
                <div className="item-quality">
                    <div className="img-quality">
                        <img src={imgTempo} alt="Imagem Agilidade" width="80px" height="auto" />
                    </div>

                    <h5>Agilidade</h5>

                    <p>Otimize seu tempo de espera e o processo de atendimento, garantindo acesso mais rápido e eficiente aos serviços de saúde gratuitos.</p>
                </div>

                <div className="item-quality">
                    <div className="img-quality">
                        <img src={imgEcologico} alt="Imagem Ecológico" width="80px" height="auto" />
                    </div>

                    <h5>Ecológico</h5>

                    <p>Contribua para o meio ambiente. Nossa fila online elimina a necessidade de senhas de papel, reduzindo o desperdício e a pegada ecológica.</p>
                </div>

                <div className="item-quality">
                    <div className="img-quality">
                        <img src={imgAcesso} alt="Imagem Acesso" width="80px" height="auto" />
                    </div>

                    <h5>Acesso Fácil</h5>

                    <p>Conectamos você aos serviços de saúde gratuitos de maneira simples e intuitiva, a apenas alguns cliques de distância.</p>
                </div>
            </section>

            <div className="div-separator"></div>

            <section className="section-about" id="sobre">
                <div className="area-img">
                    <img src={imgSobre} alt="Imagem Sobre" width="650px" height="auto" />
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

            <div className="div-separator"></div>

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
                            <div className="area-img" style={{ backgroundImage: `url(${imgPessoa1})` }}>
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
                            <div className="area-img" style={{ backgroundImage: `url(${imgPessoa2})` }}>
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
                            <div className="area-img" style={{ backgroundImage: `url(${imgPessoa3})` }}>
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
                            <div className="area-img" style={{ backgroundImage: `url(${imgPessoa4})` }}>
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
                            <div className="area-img" style={{ backgroundImage: `url(${imgPessoa5})` }}>
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
                            <div className="area-img" style={{ backgroundImage: `url(${imgPessoa6})` }}>
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
                            <div className="area-img" style={{ backgroundImage: `url(${imgPessoa7})` }}>
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
                            <div className="area-img" style={{ backgroundImage: `url(${imgPessoa8})` }}>
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

            <div className="div-separator"></div>

            <section className="section-faq" id="faq">
                <h6 className="tag-section">FAQ - Perguntas Frequentes</h6>

                <h2>
                    Tire suas dúvidas sobre o
                    <br></br>
                    Agilidade na Saúde
                </h2>

                <div className="area-faq">
                    <div className="area-img">
                        <img src={imgFaq} alt="Imagem FAQ - Perguntas frequentes" width="100%" height="auto" />
                    </div>

                    <div className="accordion" id="accordionFaq">
                        <div className="accordion-item">
                            <h6 className="accordion-header" id="headingOne">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                    Como posso me cadastrar para começar a usar o Agilidade na Saúde ?
                                </button>
                            </h6>

                            <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionFaq">
                                <div className="accordion-body">
                                    <p>
                                        O Agilidade na Saúde oferece duas opções de cadastro:

                                        <li>
                                            Para Médicos: Se você é um profissional de saúde e deseja disponibilizar seu serviço gratuito para a população, nosso sistema te ajuda a organizar a fila de atendimento de forma eficiente.
                                        </li>


                                        <li>
                                            Para Pacientes: Ao se cadastrar como paciente, você pode agendar em atendimentos específicos ou visualizar as oportunidades de atendimento médico gratuito disponíveis para ser atendido.
                                        </li>

                                        Ambos os cadastros são simples e práticos, feitos diretamente pelo sistema online.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h6 className="accordion-header" id="headingTwo">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    O sistema Agilidade na Saúde é realmente gratuito para o usuário ?
                                </button>
                            </h6>

                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionFaq">
                                <div className="accordion-body">
                                    <p>
                                        Sim, absolutamente!
                                        <br></br>
                                        O Agilidade na Saúde foi criado com o objetivo de ser 100% gratuito para todos os usuários, sejam eles pacientes ou médicos.
                                        <br></br>
                                        Além disso, somos um projeto open-source, reforçando nosso compromisso com a acessibilidade e a comunidade.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h6 className="accordion-header" id="headingThree">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    Como o Agilidade na Saúde me ajuda a evitar longas esperas em filas ?
                                </button>
                            </h6>

                            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionFaq">
                                <div className="accordion-body">
                                    <p>
                                        O Agilidade na Saúde organiza as filas de forma digital, o que significa que o processo de atendimento se torna mais rápido e simples.
                                        <br></br>
                                        Você não precisa mais esperar horas presencialmente, pois o sistema te permite acompanhar sua posição e gerenciar sua vez de forma eficiente.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h6 className="accordion-header" id="headingFour">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                    Preciso instalar algo no meu celular ou computador para usar o sistema ?
                                </button>
                            </h6>

                            <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionFaq">
                                <div className="accordion-body">
                                    <p>
                                        Não, não é necessário instalar nada!
                                        <br></br>
                                        O Agilidade na Saúde é um sistema totalmente online. Basta acessá-lo diretamente pelo navegador do seu celular, tablet ou computador para começar a usar e aproveitar todos os benefícios.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h6 className="accordion-header" id="headingFive">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                    Posso agendar ou apenas acompanhar atendimentos médicos gratuitos pelo Agilidade na Saúde ?
                                </button>
                            </h6>

                            <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionFaq">
                                <div className="accordion-body">
                                    <p>
                                        Pelo Agilidade na Saúde, você pode coletar uma senha disponível para um atendimento médico gratuito e, posteriormente, acompanhar todo o andamento dessa senha.
                                        <br></br>
                                        Nosso foco é otimizar sua experiência na fila, desde a reserva da sua senha até o momento do atendimento.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="div-separator"></div>

            <section className="section-contact" id="contato">
                <h6 className="tag-section">Área de Contato</h6>

                <h2>
                    Alguma sugestão ?
                    <br></br>
                    Envie-nos uma mensagem
                </h2>
                
                <div className="body-contact">
                    <div className="area-img">
                        <img src={imgContato} alt="Imagem Contato" width="650px" height="auto" />
                    </div>

                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="item-input-user mb-3">
                                <label>Nome</label>

                                <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                            </div>
                            
                            <div className="item-input-user mb-3">
                                <label>Email</label>

                                <input type="email" placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            
                            
                            <div className="item-input-user mb-3">
                                <label>Mensagem</label>

                                <textarea placeholder="Sua mensagem" rows={4} value={mensagem} onChange={(e) => setMensagem(e.target.value)} required></textarea>
                            </div>
                            
                            <button className="btn-default" type="submit" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar Mensagem'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {activeResetToken && (
                <UpdatePasswordModal
                    isOpen={isResetModalOpen}
                    onClose={handleModalClose}
                    token={activeResetToken}
                    onPasswordResetSuccess={handlePasswordSuccessfullyReset}
                />
            )}
        </main>
    );
}

export default HomePage;