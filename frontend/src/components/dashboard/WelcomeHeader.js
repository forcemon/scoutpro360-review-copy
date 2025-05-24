// src/components/dashboard/WelcomeHeader.js
import React from 'react';
// Paso 1: Importar FontAwesomeIcon y los iconos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import './WelcomeHeader.css'; // Importar CSS

function WelcomeHeader() {
  // Lógica para obtener el nombre de usuario y la fecha real iría aquí
  const userName = "Mauricio"; // Ejemplo
  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('es-ES', dateOptions); // Formato español

  return (
    <div className="welcome-section">
      <div className="welcome-text">
        <h1>Bienvenido, {userName}</h1>
        <p>{formattedDate}</p>
      </div>
      <div className="welcome-actions">
        {/* Estos botones podrían navegar a otras rutas o abrir modales */}
        <button type="button" className="action-button primary">
          {/* Paso 2: Usar FontAwesomeIcon */}
          <FontAwesomeIcon icon={faUserPlus} className="action-button-icon" />
          Nuevo Jugador
        </button>
        <button type="button" className="action-button secondary">
           {/* Paso 2: Usar FontAwesomeIcon */}
          <FontAwesomeIcon icon={faFileAlt} className="action-button-icon" />
          Crear Informe
        </button>
      </div>
    </div>
  );
}

// No se necesitan PropTypes si no recibe props externas

export default WelcomeHeader;