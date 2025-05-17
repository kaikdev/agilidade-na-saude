import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/images/logo.png'
import './Header.css';

function Header() {
    const [menuActive, setMenuActive] = useState(false);

    function toggleMenu(event) {
        if (event.type === 'touchstart') event.preventDefault();
        
        setMenuActive(!menuActive);
    }

    return (
        <header id="header">
            <Link to="/" id="logo">
                <img src={logoImg} alt="Logo Agilidade na Saúde" width="150px" height="auto"/>
            </Link>

            <nav id="nav" className={menuActive ? 'active' : ''}>
                <button 
                    aria-label={menuActive ? 'Fechar Menu' : 'Abrir Menu'}
                    id="btn-mobile" 
                    aria-haspopup="true" 
                    aria-controls="menu" 
                    aria-expanded={menuActive}
                    onClick={toggleMenu}
                    onTouchStart={toggleMenu}
                >
                    <span id="hamburger"></span>
                </button>

                <ul id="menu" role="menu">
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
                        <a href="#login">Login</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;