// frontend/src/components/common/TopBar.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext'; // Importa useAuth
import './TopBar.css';

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState('ScoutPro360');
  const { user, logout, isAuthenticated } = useAuth(); // Obtén el usuario, logout y estado de autenticación

  useEffect(() => {
    // Lógica para determinar pageTitle basada en location.pathname
    // (Esta lógica puede permanecer como la tenías)
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') setPageTitle('Dashboard');
    else if (path === '/players') setPageTitle('Explorar Jugadores');
    else if (path.startsWith('/players/')) setPageTitle('Perfil de Jugador');
    else if (path === '/reports') setPageTitle('Mis Informes');
    else if (path.startsWith('/reports/')) setPageTitle('Detalle de Informe');
    else if (path === '/comparison') setPageTitle('Comparativa');
    else setPageTitle('ScoutPro360');
  }, [location]);

  const handleLogout = async () => {
    await logout(); // Llama a la función logout del contexto
    navigate('/login'); // Redirige a la página de login
  };

  // Determinar nombre de usuario y avatar.
  // El UserProfileSerializer del backend devuelve 'username' (de User) y puede tener 'profile_image_url'
  const displayName = user?.username || "Usuario"; 
  // Si tu UserProfile tiene un campo 'profile_image_url' y está en user.profile:
  // const userAvatarUrl = user?.profile?.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff&size=40&bold=true`;
  // Si UserProfile es directamente el objeto 'user' y tiene 'image_url':
  const userAvatarUrl = user?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff&size=40&bold=true`;


  return (
    <div className="top-bar">
      <div className="page-title">{pageTitle}</div>

      {isAuthenticated && ( // Solo mostrar controles si el usuario está autenticado
        <div className="user-controls">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input type="text" placeholder="Buscar jugador, informe..." aria-label="Buscar jugador, informe" />
          </div>

          <button type="button" className="icon-button notifications-button" title="Notificaciones" aria-label="Notificaciones">
            <FontAwesomeIcon icon={faBell} />
            {/* <span className="notification-badge">3</span> */}
          </button>

          <div className="user-profile-section">
            <span className="user-name-display">{displayName}</span>
            <img
              src={userAvatarUrl}
              alt={`Perfil de ${displayName}`}
              className="profile-pic"
              title={displayName}
            />
            <button onClick={handleLogout} className="icon-button logout-button" title="Cerrar Sesión" aria-label="Cerrar sesión">
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TopBar;
