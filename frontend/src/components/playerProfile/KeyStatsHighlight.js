// frontend/src/components/playerProfile/KeyStatsHighlight.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faBullseye, faRunning, faChartLine } from '@fortawesome/free-solid-svg-icons'; // Example icons
import './KeyStatsHighlight.css'; // We will create this CSS file next

const KeyStatsHighlight = ({ playerData }) => {
  if (!playerData) {
    return <div className="key-stats-highlight-card card loading">Cargando estadísticas clave...</div>;
  }

  // Access the placeholder stats from playerData
  const stats = [
    {
      label: 'Partidos Jugados (365 días)',
      value: playerData.partidos_jugados_365_dias !== undefined ? playerData.partidos_jugados_365_dias : 'N/A',
      icon: faRunning,
      unit: '',
    },
    {
      label: 'Goles (365 días)',
      value: playerData.goles_365_dias !== undefined ? playerData.goles_365_dias : 'N/A',
      icon: faFutbol,
      unit: '',
    },
    {
      label: 'Asistencias (365 días)',
      value: playerData.asistencias_365_dias !== undefined ? playerData.asistencias_365_dias : 'N/A',
      icon: faBullseye, // Example, consider faHandshake or similar for assists
      unit: '',
    },
    // Example for a potential xG stat - can be uncommented if xG_365_dias is added to serializer
    // {
    //   label: 'xG (Expected Goals) (365 días)',
    //   value: playerData.xG_365_dias !== undefined ? playerData.xG_365_dias.toFixed(2) : 'N/A',
    //   icon: faChartLine,
    //   unit: '',
    // },
  ];

  return (
    <div className="key-stats-highlight-card card">
      <div className="card-title">
        Estadísticas Clave (Últimos 365 días)
      </div>
      <div className="stats-container">
        {stats.map((stat) => (
          stat.value !== 'N/A' && ( // Only render if value is available
            <div key={stat.label} className="stat-item-highlight">
              <FontAwesomeIcon icon={stat.icon} className="stat-icon-highlight" />
              <div className="stat-value-highlight">
                {stat.value}
                {stat.unit ? <span className="stat-unit-highlight">{stat.unit}</span> : ''}
              </div>
              <div className="stat-label-highlight">{stat.label}</div>
            </div>
          )
        ))}
        {stats.every(stat => stat.value === 'N/A') && (
            <p className="no-stats-available">Estadísticas de rendimiento no disponibles.</p>
        )}
      </div>
    </div>
  );
};

KeyStatsHighlight.propTypes = {
  playerData: PropTypes.shape({
    partidos_jugados_365_dias: PropTypes.number,
    goles_365_dias: PropTypes.number,
    asistencias_365_dias: PropTypes.number,
    // xG_365_dias: PropTypes.number, // Uncomment if using
  }),
};

export default KeyStatsHighlight;
