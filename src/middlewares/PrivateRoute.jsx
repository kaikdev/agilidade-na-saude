import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ children }) {
    const isAuthenticated = localStorage.getItem('authToken');

    return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;