import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <main className="main-dashboard">Verificando Autenticação...</main>;
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;