// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import DashboardPage from './pages/DashboardPage';
import PlayerListPage from './pages/PlayerListPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import MyReportsPage from './pages/MyReportsPage'; // El componente sigue siendo el mismo

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas principales que usan el Layout (Sidebar + Topbar) */}
        <Route path="/" element={<Layout />}>
          {/* Ruta índice que redirige al dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Rutas de las páginas */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="players" element={<PlayerListPage />} />
          <Route path="players/:playerId" element={<PlayerProfilePage />} />

          {/* --- CAMBIO DE RUTA --- */}
          {/* Ahora la página de informes se accede desde /reports */}
          <Route path="reports" element={<MyReportsPage />} />
          {/* La ruta anterior /my-reports ya no se usa */}
          {/* <Route path="my-reports" element={<MyReportsPage />} /> */}
          {/* --- FIN CAMBIO DE RUTA --- */}


          {/* Considera añadir una ruta catch-all para páginas no encontradas */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>

        {/* Aquí podrías añadir rutas que NO usen el Layout principal */}
        {/* Ejemplo: <Route path="/login" element={<LoginPage />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
