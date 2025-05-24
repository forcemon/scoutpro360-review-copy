// src/components/common/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
// Paso 1: Importar el componente y los iconos necesarios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faSearch, faClipboardList, faChartBar, faComment,
  faUsers, faCalendar, faUser, faCog, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css'; // Asegúrate que el CSS se importe

function Sidebar() {
  // Función de ejemplo para manejar clics en botones placeholder
  const handlePlaceholderClick = (itemName) => {
    console.log(`Clic en el placeholder: ${itemName}`);
    // Aquí podrías mostrar un mensaje "Próximamente" o realizar otra acción
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo">Scout<span className="accent">Pro360</span></div>
        {/* <div className="logo-subtitle">Plataforma profesional</div> */}
      </div>

      <div className="sidebar-menu">
        <div className="menu-section">
          <div className="menu-title">PRINCIPAL</div>
          {/* Paso 2: Reemplazar <i> con <FontAwesomeIcon> */}
          <NavLink to="/dashboard" className="menu-item">
              <FontAwesomeIcon icon={faHome} fixedWidth className="menu-icon" />
              <span>Dashboard</span>
          </NavLink>
          <NavLink to="/players" className="menu-item">
              <FontAwesomeIcon icon={faSearch} fixedWidth className="menu-icon" />
              <span>Explorar Jugadores</span>
          </NavLink>
          <NavLink to="/reports" className="menu-item">
              <FontAwesomeIcon icon={faClipboardList} fixedWidth className="menu-icon" />
              <span>Mis Informes</span>
          </NavLink>
          <NavLink to="/comparison" className="menu-item">
              <FontAwesomeIcon icon={faChartBar} fixedWidth className="menu-icon" />
              <span>Comparativa</span>
          </NavLink>
        </div>

        <div className="menu-section">
            <div className="menu-title">NETWORKING</div>
            {/* Reemplazar también en los botones */}
            <button type="button" className="menu-item" onClick={() => handlePlaceholderClick('Mensajes')}>
                <FontAwesomeIcon icon={faComment} fixedWidth className="menu-icon" />
                <span>Mensajes</span>
            </button>
            <button type="button" className="menu-item" onClick={() => handlePlaceholderClick('Contactos')}>
                <FontAwesomeIcon icon={faUsers} fixedWidth className="menu-icon" />
                <span>Contactos</span>
            </button>
            <button type="button" className="menu-item" onClick={() => handlePlaceholderClick('Eventos')}>
                <FontAwesomeIcon icon={faCalendar} fixedWidth className="menu-icon" />
                <span>Eventos</span>
            </button>
        </div>

        <div className="menu-section">
            <div className="menu-title">MI CUENTA</div>
             <button type="button" className="menu-item" onClick={() => handlePlaceholderClick('Perfil')}>
                 <FontAwesomeIcon icon={faUser} fixedWidth className="menu-icon" />
                 <span>Perfil</span>
             </button>
             <button type="button" className="menu-item" onClick={() => handlePlaceholderClick('Configuración')}>
                 <FontAwesomeIcon icon={faCog} fixedWidth className="menu-icon" />
                 <span>Configuración</span>
             </button>
             <button type="button" className="menu-item" onClick={() => handlePlaceholderClick('Cerrar Sesión')}>
                 <FontAwesomeIcon icon={faSignOutAlt} fixedWidth className="menu-icon" />
                 <span>Cerrar Sesión</span>
             </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;