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
import ProtectedLayout from './pages/auth/ProtectedLayout'; // <<< ESTA LÍNEA ES CRUCIAL

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública para Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Protegidas que usarán ProtectedLayout */}
        <Route element={<ProtectedLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} /> 
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="players" element={<PlayerListPage />} />
          <Route path="players/:playerId" element={<PlayerProfilePage />} />
          <Route path="reports" element={<MyReportsPage />} />
          <Route path="reports/:reportId" element={<ReportDetailPage />} />
          {/* <Route path="*" element={<NotFoundPage />} /> // Opcional */}
        </Route>
        
        {/* <Route path="*" element={<div><h1>404 - Página No Encontrada</h1></div>} /> // Opcional */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
