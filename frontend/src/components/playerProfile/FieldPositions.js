// frontend/src/components/playerProfile/FieldPositions.js
import React from 'react';
import PropTypes from 'prop-types';
// Re-activada la importación del CSS. Asegúrate que la ruta sea correcta.
import './FieldPositions.css';

// --- COORDINADAS ACTUALIZADAS BASADAS EN LA IMAGEN PROPORCIONADA ---
// Mapeo de claves de posición a coordenadas [top%, left%]
// Estimadas a partir de la imagen 11111111.PNG
const positionCoordinates = {
  // Clave: { top: Y%, left: X% }
  'GK': { top: 50, left: 5 },   // 1
  'CB': { top: 50, left: 18 },  // Promedio de 2 y 3
  'LB': { top: 15, left: 25 },  // 4
  'RB': { top: 85, left: 25 },  // 5
  'LWB': { top: 20, left: 45 }, // 10
  'RWB': { top: 80, left: 45 }, // 11
  'CDM': { top: 50, left: 35 }, // 6
  'CM': { top: 50, left: 50 },  // 7
  'LM': { top: 30, left: 50 },  // 8 (Alto-Centro Izq)
  'RM': { top: 70, left: 50 },  // 9 (Bajo-Centro Der)
  'CAM': { top: 50, left: 65 }, // 12
  'LW': { top: 15, left: 75 },  // 13
  'RW': { top: 85, left: 75 },  // 14
  'CF': { top: 40, left: 85 },  // 15 (Alto-Adelante Der)
  'ST': { top: 60, left: 85 },  // 16 (Bajo-Adelante Der)

  '': null // Ignorar claves vacías
};
// --- FIN COORDINADAS ACTUALIZADAS ---

// Mapeo para nombres legibles (usado para el tooltip)
const positionNames = {
    'GK': 'Goalkeeper (GK)', 'CB': 'Centre Back (CB)', 'LB': 'Left Back (LB)',
    'RB': 'Right Back (RB)', 'LWB': 'Left Wing Back (LWB)', 'RWB': 'Right Wing Back (RWB)',
    'CDM': 'Defensive Midfielder (CDM)', 'CM': 'Central Midfielder (CM)', 'LM': 'Left Midfielder (LM)',
    'RM': 'Right Midfielder (RM)', 'CAM': 'Attacking Midfielder (CAM)', 'LW': 'Left Winger (LW)',
    'RW': 'Right Winger (RW)', 'CF': 'Centre Forward (CF)', 'ST': 'Striker (ST)',
};

/**
 * Visualiza las posiciones del jugador en un campo.
 * @param {object} props
 * @param {string} [props.position1Key] - Clave de la posición principal (ej: 'ST').
 * @param {string} [props.position2Key] - Clave de la posición secundaria.
 * @param {string} [props.position3Key] - Clave de la posición terciaria.
 */
const FieldPositions = ({ position1Key, position2Key, position3Key }) => {

  // Obtener datos (coordenadas y nombre) para cada posición válida
  const positionsData = [position1Key, position2Key, position3Key]
    .map((key) => {
      if (!key) return null;
      const coords = positionCoordinates[key];
      if (coords) {
        return {
          key: key,
          coords: coords,
          name: positionNames[key] || key,
          type: (key === position1Key && key !== '') ? 'primary' : 'secondary'
        };
      }
      console.warn(`[FieldPositions] No se encontraron coordenadas para la clave: "${key}"`);
      return null;
    })
    .filter(pos => pos !== null);

  // Se confía en que FieldPositions.css define las clases necesarias
  return (
    <div className="card field-positions-card">
      <div className="card-title">
        Posiciones en Campo
      </div>
      <div className="field-container">
        {/* SVG del campo */}
        <svg viewBox="0 0 105 68" preserveAspectRatio="xMidYMid meet" className="field-svg">
          {/* ... (código SVG del campo sin cambios) ... */}
           <rect x="0" y="0" width="105" height="68" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3"/>
          <line x1="52.5" y1="0" x2="52.5" y2="68" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3"/>
          <circle cx="52.5" cy="34" r="9.15" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3"/>
          <circle cx="52.5" cy="34" r="0.5" fill="rgba(255, 255, 255, 0.3)" />
          <rect x="0" y="13.85" width="16.5" height="40.3" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3"/>
          <rect x="0" y="24.85" width="5.5" height="18.3" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3"/>
          <path d="M 16.5,24.85 A 9.15,9.15 0 0 1 16.5,43.15" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3"/>
          <circle cx="11" cy="34" r="0.3" fill="rgba(255, 255, 255, 0.3)" />
          <rect x="88.5" y="13.85" width="16.5" height="40.3" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3"/>
          <rect x="99.5" y="24.85" width="5.5" height="18.3" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3"/>
          <path d="M 88.5,24.85 A 9.15,9.15 0 0 0 88.5,43.15" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3"/>
          <circle cx="94" cy="34" r="0.3" fill="rgba(255, 255, 255, 0.3)" />
          <path d="M 0,0.7 A 0.7,0.7 0 0 1 0.7,0" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3"/>
          <path d="M 0,67.3 A 0.7,0.7 0 0 0 0.7,68" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3"/>
          <path d="M 104.3,0 A 0.7,0.7 0 0 1 105,0.7" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3"/>
          <path d="M 104.3,68 A 0.7,0.7 0 0 0 105,67.3" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.3"/>
        </svg>

        {/* Renderizar los puntos de posición (usan clases CSS para estilo) */}
        {positionsData.map((pos, index) => (
          <div
            key={pos.key + index}
            className={`position-dot ${pos.type}`}
            // El estilo inline solo aplica las coordenadas calculadas
            style={{
                top: `${pos.coords.top}%`,
                left: `${pos.coords.left}%`
             }}
            title={pos.name} // Tooltip con el nombre completo
          >
            {pos.key} {/* Muestra la clave (ej: ST) en el campo */}
          </div>
        ))}
      </div>

      {/* Leyenda (usa clases CSS) */}
      <div className="position-legend">
        <div className="legend-item">
          <div className="legend-dot primary"></div>
          <span>Principal</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot secondary"></div>
          <span>Secundaria / Terciaria</span>
        </div>
      </div>
    </div>
  );
};

// PropTypes sin cambios
FieldPositions.propTypes = {
  position1Key: PropTypes.string,
  position2Key: PropTypes.string,
  position3Key: PropTypes.string,
};

export default FieldPositions;
