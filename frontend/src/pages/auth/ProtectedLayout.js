// frontend/src/components/auth/ProtectedLayout.js
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Sube dos niveles para contexts/
import Layout from '../../layouts/Layout'; // Sube dos niveles para layouts/

const ProtectedLayout = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoadingAuth } = useAuth();
    const location = useLocation();

    if (isLoadingAuth) {
        // Muestra un estado de carga mientras se verifica la autenticación
        return <div>Cargando y verificando sesión...</div>; // Puedes mejorar esto con un spinner
    }

    if (!isAuthenticated) {
        // Si no está autenticado, redirige a login, guardando la ubicación original
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Opcional: Comprobación de roles
    // Asegúrate que user.profile.role sea la ruta correcta al rol del usuario en tu objeto 'user' del AuthContext
    // El UserProfileSerializer del backend debería devolver el perfil anidado si así está configurado.
    // Si el rol está directamente en user.role, cambia user?.profile?.role a user?.role
    if (allowedRoles && user?.profile?.role && !allowedRoles.includes(user.profile.role)) {
        console.warn(`Acceso denegado: Rol de usuario ${user.profile.role} no está en roles permitidos: ${allowedRoles.join(', ')} para ${location.pathname}`);
        // Considera crear una página /unauthorized o redirigir a una página segura como /dashboard
        return <Navigate to="/dashboard" state={{ unauthorized: true, from: location }} replace />; 
    }
    
    // Si está autenticado (y los roles coinciden, si se especifican), renderiza el Layout principal 
    // que a su vez renderizará la ruta hija (DashboardPage, PlayerListPage, etc.) vía <Outlet />
    return (
        <Layout>
            <Outlet /> 
        </Layout>
    );
};

// Puedes mantener esta exportación si necesitas proteger rutas individuales sin el Layout completo.
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

export default ProtectedLayout; // Exporta ProtectedLayout por defecto
