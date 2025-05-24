// src/components/common/TopBar.js
import React, { useState, useEffect } from 'react'; // Importa hooks necesarios
import { useLocation } from 'react-router-dom'; // Importa useLocation para leer la ruta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import './TopBar.css'; // Importa los estilos correspondientes

function TopBar() {
  const location = useLocation(); // Hook para obtener información de la ruta actual
  const [pageTitle, setPageTitle] = useState('ScoutPro360'); // Estado local para el título

  // Efecto que se ejecuta cuando cambia la ruta (location)
  useEffect(() => {
    // Determina el título basado en la ruta actual (pathname)
    switch (location.pathname) {
      case '/dashboard':
      case '/': // Considera la ruta raíz como el Dashboard también
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
      // Puedes añadir más casos para otras rutas principales
      // case '/settings':
      //   setPageTitle('Configuración');
      //   break;
      default:
        // Lógica para rutas dinámicas como el perfil de jugador
        if (location.pathname.startsWith('/players/')) {
          // Podrías extraer el ID y mostrar "Perfil de [Nombre Jugador]" si tuvieras acceso a los datos aquí,
          // pero por ahora usamos un título genérico.
          setPageTitle('Perfil de Jugador');
        } else {
          setPageTitle('ScoutPro360'); // Título por defecto si no coincide ninguna ruta
        }
        break;
    }
  }, [location]); // El efecto depende de 'location', se re-ejecuta si cambia

  // Datos de usuario (ejemplo - reemplazar con datos reales del estado global o contexto)
  const userName = "Mauricio Saenz";
  // Genera iniciales o usa una URL de imagen real
  const userAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff&size=40&bold=true`;

  return (
    <div className="top-bar">
      {/* Título de la página actual obtenido del estado */}
      <div className="page-title">{pageTitle}</div>

      <div className="user-controls">
        {/* Barra de búsqueda global */}
        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" /> {/* Añadida clase para posible espaciado */}
          <input type="text" placeholder="Buscar jugador, informe..." aria-label="Buscar jugador, informe" />
        </div>

        {/* Icono de Notificaciones (Funcionalidad futura) */}
        <button type="button" className="icon-button notifications-button" title="Notificaciones" aria-label="Notificaciones">
          <FontAwesomeIcon icon={faBell} />
          {/* Badge de ejemplo - mostrar condicionalmente si hay notificaciones */}
          <span className="notification-badge">3</span>
        </button>

        {/* Controles/Perfil de Usuario */}
        <div className="user-profile-section">
           <img
            src={userAvatarUrl}
            alt={`Perfil de ${userName}`}
            className="profile-pic"
            title={userName} // Tooltip con el nombre
           />
           {/* Aquí podrías añadir un dropdown menu al hacer clic en la imagen */}
        </div>
      </div>
    </div>
  );
}

// Ya no se necesitan PropTypes para pageTitle porque se gestiona internamente

export default TopBar;