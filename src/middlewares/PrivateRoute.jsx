import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, role: requiredRole }) {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <main className="main-dashboard"><div className="title-user"><h3>Verificando autenticação...</h3></div></main>
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && (!user || user.role !== requiredRole)) {
        if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user?.role === 'user') return <Navigate to="/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;