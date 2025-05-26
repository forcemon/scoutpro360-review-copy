// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importa tus páginas
import DashboardPage from './pages/DashboardPage';
import PlayerListPage from './pages/PlayerListPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import MyReportsPage from './pages/MyReportsPage';
import ReportDetailPage from './pages/ReportDetailPage'; 

// Componentes de Autenticación
import LoginPage from './pages/auth/LoginPage';
import ProtectedLayout from './components/auth/ProtectedLayout'; // Asegúrate que esta ruta sea correcta

// Opcional: Páginas para errores o no autorizados
// import NotFoundPage from './pages/NotFoundPage'; 
// import UnauthorizedPage from './pages/UnauthorizedPage'; 

import './App.css'; // Estilos globales de App si los tienes

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública para Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Opcional: Ruta para no autorizado */}
        {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

        {/* Rutas Protegidas que usarán ProtectedLayout (que incluye el Layout principal con Sidebar y TopBar) */}
        <Route element={<ProtectedLayout />}>
          {/* Redirección de la ruta raíz "/" al dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} /> 
          {/* Si quieres que la ruta raíz "/" también funcione y no solo "/dashboard", puedes añadir:
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
          O hacer que el 'index' de arriba sea el único punto de entrada después del login.
          */}
          
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="players" element={<PlayerListPage />} />
          <Route path="players/:playerId" element={<PlayerProfilePage />} />
          <Route path="reports" element={<MyReportsPage />} />
          <Route path="reports/:reportId" element={<ReportDetailPage />} />
          
          {/* Aquí irían otras rutas protegidas que usan el Layout */}
          {/* Ejemplo: <Route path="settings" element={<SettingsPage />} /> */}

          {/* Opcional: Un catch-all para rutas no encontradas DENTRO del layout protegido */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
        
        {/* Opcional: Un catch-all general para rutas no encontradas FUERA de cualquier layout */}
        {/* <Route path="*" element={<div><h1>404 - Página No Encontrada</h1><Link to="/">Ir al inicio</Link></div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
