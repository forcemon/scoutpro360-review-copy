// frontend/src/components/auth/ProtectedLayout.js
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Corregida la ruta
import Layout from '../../layouts/Layout'; // Tu Layout principal

const ProtectedLayout = ({ allowedRoles }) => {
    const { isAuthenticated, user, isLoadingAuth } = useAuth();
    const location = useLocation();

    if (isLoadingAuth) {
        // Muestra un estado de carga mientras se verifica la autenticación
        // Esto es crucial para evitar renderizados prematuros o redirecciones incorrectas
        return <div>Cargando y verificando sesión...</div>; // Puedes usar un spinner global aquí
    }

    if (!isAuthenticated) {
        // Si no está autenticado, redirige a login, guardando la ubicación original
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Opcional: Comprobación de roles si 'allowedRoles' se proporciona a la ruta
    // Asegúrate que la estructura de 'user' y dónde se almacena el rol ('user.profile.role' o 'user.role') sea correcta.
    // El UserProfileSerializer en el backend devuelve el perfil anidado.
    if (allowedRoles && user?.profile?.role && !allowedRoles.includes(user.profile.role)) {
        console.warn(`Acceso denegado: Rol de usuario ${user.profile.role} no está en roles permitidos: ${allowedRoles.join(', ')} para ${location.pathname}`);
        // Considera crear una página /unauthorized o redirigir a una página segura como /dashboard
        return <Navigate to="/dashboard" state={{ unauthorized: true, from: location }} replace />; 
    }
    
    // Si está autenticado (y los roles coinciden), renderiza el Layout principal que contendrá las rutas hijas
    return (
        <Layout>
            <Outlet /> {/* Aquí se renderizarán las rutas anidadas (DashboardPage, PlayerListPage, etc.) */}
        </Layout>
    );
};

export default ProtectedLayout;
