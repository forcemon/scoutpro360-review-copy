// frontend/src/components/auth/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './layouts/Layout';

// Este componente protegerá las rutas que usan el Layout principal
const ProtectedLayout = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoadingAuth } = useAuth();
    const location = useLocation();

    if (isLoadingAuth) {
        return <div>Cargando aplicación...</div>; // O un spinner global
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Opcional: Comprobación de roles
    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        console.warn(`Acceso denegado: Rol de usuario ${user.role} no está en roles permitidos: ${allowedRoles.join(', ')} para ${location.pathname}`);
        return <Navigate to="/unauthorized" replace />; // Necesitarás una página /unauthorized
    }
    
    // Si está autenticado (y los roles coinciden si se especifican), renderiza el Layout con el Outlet para las sub-rutas
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

// Un componente más genérico si solo necesitas proteger una ruta específica sin el Layout
export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, isLoadingAuth } = useAuth();
    const location = useLocation();

    if (isLoadingAuth) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
         return <Navigate to="/unauthorized" replace />;
    }

    return children;
};


export default ProtectedLayout; // Exporta ProtectedLayout por defecto