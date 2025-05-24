// frontend/src/layouts/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import TopBar from '../components/common/TopBar'; // <-- RESTAURADO: Volvemos a importar TopBar
import './Layout.css'; // Puedes quitar los bordes si quieres, o dejarlos

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content"> {/* Contenedor principal (borde rojo si aún está) */}

        {/* --- TopBar RESTAURADA --- */}
        <TopBar />
        {/* --- Fin de TopBar restaurada --- */}

        {/* El contenido de la página se renderiza aquí */}
        <main className="page-content"> {/* Contenedor del contenido (borde azul si aún está) */}
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;
