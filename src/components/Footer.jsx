import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImgWhite from '../assets/images/logo-white.png'
import './Footer.css';
import { useAuth } from '../context/AuthContext';

function Footer() {
    const location = useLocation();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const isHome = location.pathname === '/';
    const showOnlyGitHub = !isHome;
    const showLoginAndCadastro = isHome && !authLoading && !isAuthenticated;

    return (
        <footer className="footer">
            <div className="footer-left">
                <Link to="/" className="logo-footer">
                    <img src={logoImgWhite} alt="Logo Agilidade na Saúde" width="150px" height="auto"/>
                </Link>
                
                <p className="footer-text">
                    Este sistema é um sistema desenvolvido para fins educacionais do "Projeto Integrador - 2º Sem." do curso de Desenvolvimento de Software Multiplataforma da FATEC da Zona Leste.
                </p>
            </div>
            
            <div className="footer-right">
                <div className="footer-box-links">
                    <p className="footer-title">
                        Links
                    </p>  
                    
                    <ul className="footer-list">
                        <li>
                            <a href="https://github.com/kaikdev/agilidade-na-saude" target="_blank" rel="noopener noreferrer">
                                GitHub do Projeto
                            </a>
                        </li>

                        {isAuthenticated && location.pathname !== '/' && (
                            <li>
                                <a href="/">Página Inicial</a>
                            </li>
                        )}

                        {!showOnlyGitHub && (
                            <>
                                <li>
                                    <a href="#sobre">Sobre</a>
                                </li>

                                <li>
                                    <a href="#depoimentos">Depoimentos</a>
                                </li>

                                <li>
                                    <a href="#faq">FAQ</a>
                                </li>

                                <li>
                                    <a href="#contato">Contato</a>
                                </li>

                                {showLoginAndCadastro && (
                                    <>
                                        <li>
                                            <a href="#" data-bs-toggle="modal" data-bs-target="#modalLogin">Login</a>
                                        </li>
                                    </>
                                )}
                            </>
                        )}
                    </ul>
                </div>
                
                <div className="footer-box-links">
                    <p className="footer-title">
                        Desenvolvedores
                    </p>  
                    
                    <ul className="footer-list">
                        <li>
                            <a href="https://github.com/kaikdev" target="_blank">
                                Kaik Silva
                            </a>
                        </li>

                        <li>
                            <a href="https://github.com/vasquesgabriel91" target="_blank">
                                Gabriel Vasques
                            </a>
                        </li>

                        <li>
                            <a href="https://github.com/user49tbd" target="_blank">
                                Jonathan Moura
                            </a>
                        </li>

                        <li>
                            <a href="https://github.com/rogeriobgregorio" target="_blank">
                                Rogério Bernardo
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;