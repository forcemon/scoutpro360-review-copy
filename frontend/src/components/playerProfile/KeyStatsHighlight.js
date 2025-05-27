// frontend/src/components/playerProfile/KeyStatsHighlight.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faBullseye, faRunning, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './KeyStatsHighlight.css';

const KeyStatsHighlight = ({ playerData }) => {
  if (!playerData) {
    return <div className="key-stats-highlight-card card loading">Cargando estadísticas clave...</div>;
  }

  const stats = [
    {
      label: 'Partidos Jugados',
      value: playerData.partidos_jugados_365 !== undefined ? playerData.partidos_jugados_365 : 'N/A',
      icon: faRunning,
      unit: '',
    },
    {
      label: 'Goles',
      value: playerData.goles_365 !== undefined ? playerData.goles_365 : 'N/A',
      icon: faFutbol,
      unit: '',
    },
    {
      label: 'Asistencias',
      value: playerData.asistencias_365 !== undefined ? playerData.asistencias_365 : 'N/A',
      icon: faBullseye,
      unit: '',
    },
    {
      label: 'xG por 90 min',
      value: playerData.xg_per_90_365 !== undefined ? parseFloat(playerData.xg_per_90_365).toFixed(2) : 'N/A',
      icon: faChartLine,
      unit: '',
    },
  ];

  const allStatsNA = stats.every(stat => stat.value === 'N/A');

  return (
    <div className="key-stats-highlight-card card">
      <div className="card-title highlighted-title">
        <FontAwesomeIcon icon={faChartLine} />
        Estadísticas Clave (Últimos 365 días)
      </div>
      <div className="stats-container">
        {allStatsNA ? (
          <p className="no-stats-available">Estadísticas de rendimiento no disponibles.</p>
        ) : (
          stats.map((stat) => (
            stat.value !== 'N/A' && (
              <div key={stat.label} className="stat-item-highlight">
                <FontAwesomeIcon icon={stat.icon} className="stat-icon-highlight" />
                <div className="stat-value-highlight">
                  {stat.value}
                  {stat.unit ? <span className="stat-unit-highlight">{stat.unit}</span> : ''}
                </div>
                <div className="stat-label-highlight">{stat.label}</div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
};

KeyStatsHighlight.propTypes = {
  playerData: PropTypes.shape({
    partidos_jugados_365: PropTypes.number,
    goles_365: PropTypes.number,
    asistencias_365: PropTypes.number,
    xg_per_90_365: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default KeyStatsHighlight;
