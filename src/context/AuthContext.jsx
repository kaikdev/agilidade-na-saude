import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const decodeAndSetUser = (currentToken) => {
        if (currentToken) {
            try {
                const decoded = jwtDecode(currentToken);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    console.warn('Token JWT expirado.');

                    Swal.fire({ 
                        icon: 'warning',
                        title: 'Sessão Expirada', 
                        text: 'Sua sessão expirou. Faça login novamente.', 
                        showConfirmButton: false, timer: 2000 
                    });

                    localStorage.removeItem('authToken');
                    setToken(null);
                    setUser(null);
                    return null;
                }
                setUser(decoded);
                return decoded;
            } 
            catch (error) {
                console.error('Erro ao decodificar o token:', error);

                Swal.fire({ 
                    icon: 'error', 
                    title: 'Token Inválido', 
                    text: 'Token inválido. Faça login novamente.', 
                    showConfirmButton: false, timer: 2000 
                });

                localStorage.removeItem('authToken');
                setToken(null);
                setUser(null);
                return null;
            }
        }

        setUser(null);
        return null;
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');

        if (storedToken) {
            setToken(storedToken);
            decodeAndSetUser(storedToken);
        } 
        else {
            setToken(null);
            setUser(null);
        }

        setLoading(false);
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);

        const decodedUser = decodeAndSetUser(newToken);

        if (decodedUser) {
            if (decodedUser.role === 'admin') {
                navigate('/dashboard');
            } 
            else {
                navigate('/dashboard');
            }
        }
    };

    const handleLogout = (confirm = true, message = 'Você foi desconectado com sucesso.') => {
        const performLogout = () => {
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);

            Swal.fire({
                icon: 'success',
                title: 'Deslogado!',
                text: message,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                navigate('/');
            });
        };

        if (confirm) {
            Swal.fire({
                title: 'Deseja realmente sair?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, sair!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    performLogout();
                }
            });
        } 
        else {
            performLogout();
        }
    };

    const authContextValue = {
        token,
        user,
        isAuthenticated: !!token && !!user,
        loading,
        login: handleLogin,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};