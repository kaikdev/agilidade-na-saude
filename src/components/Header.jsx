import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/images/logo.png'
import './Header.css';

function Header() {
    const [menuActive, setMenuActive] = useState(false);
    const timeoutRef = useRef(null);

    function toggleMenu() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setMenuActive(!menuActive);
            timeoutRef.current = null;
        }, 100);
    }

    function handleTouchStart(event) {
        event.preventDefault();
        toggleMenu();
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
                    onTouchStart={handleTouchStart}
                >
                    <span id="hamburger"></span>
                </button>

                <ul id="menu" role="menu">
                    <li>
                        <a href="#sobre" onClick={() => setMenuActive(false)}>Sobre</a>
                    </li>
                    <li>
                        <a href="#depoimentos" onClick={() => setMenuActive(false)}>Depoimentos</a>
                    </li>
                    <li>
                        <a href="#faq" onClick={() => setMenuActive(false)}>FAQ</a>
                    </li>
                    <li>
                        <a href="#login" onClick={() => setMenuActive(false)}>Login</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;