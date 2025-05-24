import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importar
import './StatSummaryCard.css';

// Cambiamos 'iconClass' por 'icon' (objeto)
function StatSummaryCard({ value, label, icon, iconBgClass, trendValue, trendDirection }) {
  // Determinar icono de tendencia
  const trendIconClass = trendDirection === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';

  return (
    <div className="stat-summary-card">
      {/* Renderizar usando FontAwesomeIcon si 'icon' existe */}
      {icon && (
          <div className={`stat-icon ${iconBgClass || ''}`}>
              <FontAwesomeIcon icon={icon} />
          </div>
      )}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trendValue && (
        <div className={`stat-trend ${trendDirection}`}>
           {/* Usar <i> para icono de tendencia simple */}
          <i className={trendIconClass}></i> {trendValue}
        </div>
      )}
    </div>
  );
}

StatSummaryCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired, // <-- Cambiado a objeto icono
  iconBgClass: PropTypes.string,
  trendValue: PropTypes.string,
  trendDirection: PropTypes.oneOf(['up', 'down']),
};

export default StatSummaryCard;