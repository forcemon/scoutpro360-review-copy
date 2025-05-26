// frontend/src/components/common/TopBar.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Añadir useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Añadir faSignOutAlt
import { useAuth } from '../../contexts/AuthContext'; // <--- IMPORTAR useAuth
import './TopBar.css';

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate(); // Para redirigir después del logout
  const [pageTitle, setPageTitle] = useState('ScoutPro360');
  const { user, logout, isAuthenticated } = useAuth(); // <--- OBTENER user y logout

  useEffect(() => {
    // (Lógica para setPageTitle se mantiene igual)
    switch (location.pathname) {
      case '/dashboard':
      case '/':
        setPageTitle('Dashboard');
        break;
      case '/players':
        setPageTitle('Explorar Jugadores');
        break;
      case '/reports':
        setPageTitle('Mis Informes');
        break;
      case '/comparison':
        setPageTitle('Comparativa de Jugadores');
        break;
      default:
        if (location.pathname.startsWith('/players/')) {
          setPageTitle('Perfil de Jugador');
        } else if (location.pathname.startsWith('/reports/')) {
            setPageTitle('Detalle de Informe');
        } else {
          setPageTitle('ScoutPro360');
        }
        break;
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir a login después de cerrar sesión
  };

  // Determinar nombre de usuario y avatar
  const userName = user?.username || "Usuario"; // Usa el username del contexto o un placeholder
  const userAvatarUrl = user?.profile_image_url || // Asume que el perfil podría tener una imagen
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff&size=40&bold=true`;

  return (
    <div className="top-bar">
      <div className="page-title">{pageTitle}</div>

      {isAuthenticated && ( // Solo mostrar controles de usuario si está autenticado
        <div className="user-controls">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input type="text" placeholder="Buscar jugador, informe..." aria-label="Buscar jugador, informe" />
          </div>

          <button type="button" className="icon-button notifications-button" title="Notificaciones" aria-label="Notificaciones">
            <FontAwesomeIcon icon={faBell} />
            {/* <span className="notification-badge">3</span> */} {/* Mostrar condicionalmente */}
          </button>

          <div className="user-profile-section">
            <span className="user-name-display">{userName}</span> {/* Mostrar nombre de usuario */}
            <img
              src={userAvatarUrl}
              alt={`Perfil de ${userName}`}
              className="profile-pic"
              title={userName}
            />
            <button onClick={handleLogout} className="icon-button logout-button" title="Cerrar Sesión">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopBar;