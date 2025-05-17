import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImgWhite from '../assets/images/logo-white.png'
import './Footer.css';

function Footer() {
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
                            <a href="#" target="_blank">
                                GitHub do Projeto
                            </a>
                        </li>
                        <li>
                            <a href="#sobre">
                                Sobre
                            </a>
                        </li>
                        <li>
                            <a href="#depoimentos">
                                Depoimentos
                            </a>
                        </li>
                        <li>
                            <a href="#faq">
                                FAQ
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                Login
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                Cadastro
                            </a>
                        </li>
                    </ul>
                </div>
                
                <div className="footer-box-links">
                    <p className="footer-title">
                        Desenvolvedores
                    </p>  
                    
                    <ul className="footer-list">
                        <li>
                            <a href="https://github.com/seu-github-1" target="_blank">
                                Kaik Silva
                            </a>
                        </li>

                        <li>
                            <a href="https://github.com/seu-github-1" target="_blank">
                                Gabriel Vasques
                            </a>
                        </li>

                        <li>
                            <a href="https://github.com/seu-github-1" target="_blank">
                                Jonathan Moura
                            </a>
                        </li>

                        <li>
                            <a href="https://github.com/seu-github-1" target="_blank">
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