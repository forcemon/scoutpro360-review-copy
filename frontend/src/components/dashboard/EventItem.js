// src/components/dashboard/EventItem.js
import React from 'react';
import PropTypes from 'prop-types';
// Paso 1: Importar componente e icono
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './EventItem.css'; // Importar CSS

function EventItem({ day, month, title, location, type }) {
  return (
    // Usamos un div como contenedor principal en lugar de 'a' si no es un enlace directo
    <div className="event-item" title={`${title} - ${day}/${month}`}>
      <div className="event-date">
        <div className="event-date-day">{day}</div>
        <div className="event-date-month">{month}</div>
      </div>
      <div className="event-content">
        <div className="event-title">{title}</div>
        <div className="event-details">
          {location && ( // Renderizar solo si hay ubicación
            <span className="event-location"> {/* Envolver en span para estilos */}
              {/* Paso 2: Usar FontAwesomeIcon */}
              <FontAwesomeIcon icon={faMapMarkerAlt} className="event-location-icon" />
              {' '}{/* Espacio entre icono y texto */}
              {location}
            </span>
          )}
          {/* Añadir clase CSS basada en el tipo */}
          {type && <span className={`event-type ${type}`}>{type}</span>}
        </div>
      </div>
    </div>
  );
}

EventItem.propTypes = {
  day: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired, // ej: 'ABR'
  title: PropTypes.string.isRequired,
  location: PropTypes.string, // La ubicación es opcional
  type: PropTypes.oneOf(['match', 'tournament', 'scouting', 'meeting']), // Tipos posibles
};

export default EventItem;