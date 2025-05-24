import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importar
import './QuickActionButton.css';

// Cambiamos 'iconClass' por 'icon' (objeto)
function QuickActionButton({ icon, text, onClick }) {
  return (
    <button type="button" className="quick-action-button" onClick={onClick} title={text}>
      {/* Renderizar usando FontAwesomeIcon */}
      <FontAwesomeIcon icon={icon} className="quick-action-icon" />
      <div className="quick-action-text">{text}</div>
    </button>
  );
}

QuickActionButton.propTypes = {
  icon: PropTypes.object.isRequired, // <-- Cambiado a objeto icono
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default QuickActionButton;