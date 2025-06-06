import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserProfile = useCallback(async (userId, userToken, userRole) => {
        if (!userId || !userToken || !userRole) {
            return null;
        }

        let apiUrl = '';
        
        if (userRole === 'admin') {
            apiUrl = `${API_BASE_URL}/api/admin/${userId}`;
        } 
        else if (userRole === 'user') {
            apiUrl = `${API_BASE_URL}/api/users/${userId}`;
        } 
        else {
            console.error('Role de usuário desconhecido ao buscar perfil:', userRole);
            return null;
        }

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            return response.data;
        } 
        catch (error) {
            console.error(`Erro na requisição do perfil para ${userRole} (${apiUrl}):`, error.response?.data || error.message);

            return null;
        }
    }, []);

    const decodeAndSetUser = useCallback(async (currentToken) => {
        if (!currentToken) {
            setUser(null);
            return null;
        }

        try {
            const decoded = jwtDecode(currentToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                Swal.fire({ 
                    icon: 'warning', 
                    title: 'Sessão Expirada', 
                    text: 'Sua sessão expirou. Faça login novamente.', 
                    showConfirmButton: false, 
                    timer: 3000 
                });
                setUser(null);
                return null;
            }

            const apiResponse = await fetchUserProfile(decoded.id, currentToken, decoded.role);

            if (apiResponse) {
                let profileDetails = {};

                if (decoded.role === 'admin') {
                    if (apiResponse.success && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
                        const adminDataFromApi = apiResponse.data[0];
                        profileDetails = {
                            name: adminDataFromApi.name,
                            email: adminDataFromApi.email,
                            crm: adminDataFromApi.crm,
                            specialty: adminDataFromApi.specialty,
                            presentation: adminDataFromApi.presentation,
                        };

                        if (adminDataFromApi.user_id !== decoded.id) {
                            console.warn("Atenção: ID do token não corresponde ao user_id da resposta /api/admin/:id.");
                        }
                    } 
                    else {
                        console.error('Estrutura de resposta inesperada para perfil de admin:', apiResponse);

                        Swal.fire({
                            icon: 'error',
                            title: 'Falha ao Carregar Perfil',
                            text: 'Não foi possível carregar os detalhes do seu perfil. Tente fazer login novamente.',
                            showConfirmButton: false, timer: 3500
                        });

                        setUser(null); return null;
                    }
                } 
                else if (decoded.role === 'user') {
                    profileDetails = {
                        name: apiResponse.name,
                        email: apiResponse.email,
                        birth_date: apiResponse.birth_date,
                    };
                }

                const userToSet = {
                    ...profileDetails,
                    id: decoded.id,
                    role: decoded.role
                };
                
                if (!userToSet.name) {
                    console.warn('Nome do usuário não foi definido após buscar perfil.', userToSet);
                }

                setUser(userToSet);
                return userToSet;

            } 
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Falha ao Carregar Perfil',
                    text: 'Não foi possível carregar os detalhes do seu perfil. Tente fazer login novamente.',
                    showConfirmButton: false, timer: 3500
                });
                
                setUser(null);
                return null;
            }

        } catch (error) {
            console.error("Erro ao decodificar token ou erro inesperado:", error);
            Swal.fire({
                icon: 'error',
                title: 'Token Inválido ou Erro',
                text: 'Ocorreu um problema com sua sessão. Faça login novamente.',
                showConfirmButton: false, timer: 3000
            });
            setUser(null);
            return null;
        }
    }, [fetchUserProfile]);

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const storedToken = localStorage.getItem('authToken');

            if (storedToken) {
                const userProfile = await decodeAndSetUser(storedToken);
                if (userProfile) {
                    setToken(storedToken);
                } 
                else {
                    localStorage.removeItem('authToken');
                    setToken(null);
                }
            } 
            else {
                setToken(null);
                setUser(null);
            }
            setLoading(false);
        };

        initializeAuth();
    }, [decodeAndSetUser]);


    const handleLogin = useCallback(async (newToken) => {
        setLoading(true);
        localStorage.setItem('authToken', newToken);
        setToken(newToken);

        const fullUser = await decodeAndSetUser(newToken);

        if (fullUser) {
            if (fullUser.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } 
            else if (fullUser.role === 'user') {
                navigate('/dashboard', { replace: true });
            } 
            else {
                console.warn("Role desconhecido após login, redirecionando para home:", fullUser.role);
                navigate('/', { replace: true });
            }
        } 
        else {
            localStorage.removeItem('authToken');
            setToken(null);

            navigate('/', { replace: true });
        }
        setLoading(false);
    }, [decodeAndSetUser, navigate]);

    const handleLogout = useCallback((confirm = true, message = 'Você foi desconectado com sucesso.') => {
        const performLogout = () => {
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
            setLoading(false);

            navigate('/', { replace: true });

            Swal.fire({
                icon: 'success',
                title: 'Deslogado!',
                text: message,
                showConfirmButton: false,
                timer: 2000
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
        } else {
            performLogout();
        }
    }, [navigate]);

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