// frontend/src/components/auth/ProtectedLayout.js
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Correcto: AuthContext está en src/contexts/
import Layout from '../../layouts/Layout'; // Correcto: Layout está en src/layouts/

const ProtectedLayout = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoadingAuth } = useAuth();
    const location = useLocation();

    if (isLoadingAuth) {
        return <div>Cargando y verificando sesión...</div>; 
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user?.profile?.role && !allowedRoles.includes(user.profile.role)) {
        console.warn(`Acceso denegado: Rol de usuario ${user.profile.role} no está en roles permitidos: ${allowedRoles.join(', ')} para ${location.pathname}`);
        return <Navigate to="/dashboard" state={{ unauthorized: true, from: location }} replace />; 
    }
    
    return (
        <Layout>
            <Outlet /> 
        </Layout>
    );
};

// Componente auxiliar si necesitas proteger rutas individuales sin el Layout completo
export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, isLoadingAuth } = useAuth();
    const location = useLocation();

    if (isLoadingAuth) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (allowedRoles && user?.profile?.role && !allowedRoles.includes(user.profile.role)) {
         return <Navigate to="/dashboard" state={{ unauthorized: true, from: location }} replace />;
    }

    return children;
};

export default ProtectedLayout;
