import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importar
import './ActivityFeedItem.css';

// Cambiamos 'iconClass' por 'icon' (objeto)
function ActivityFeedItem({ icon, iconBgClass, text, time }) {
  return (
    <div className="activity-item">
      <div className={`activity-icon ${iconBgClass || ''}`}>
        {/* Renderizar usando FontAwesomeIcon */}
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="activity-content">
        <div className="activity-text" dangerouslySetInnerHTML={{ __html: text }}></div>
        <div className="activity-time">{time}</div>
      </div>
    </div>
  );
}

ActivityFeedItem.propTypes = {
  icon: PropTypes.object.isRequired, // <-- Cambiado a objeto icono
  iconBgClass: PropTypes.string,
  text: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

export default ActivityFeedItem;