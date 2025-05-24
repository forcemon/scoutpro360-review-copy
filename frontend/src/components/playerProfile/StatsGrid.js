// src/components/playerProfile/StatsGrid.js
import React from 'react';
import PropTypes from 'prop-types';
// Quita FontAwesome si no lo usas aquí o no está instalado
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChartLine, faRunning, faBrain, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
// Asegúrate que la ruta al CSS sea correcta, si no, ajústala o elimínala.
import './StatsGrid.css';

// --- MAPEO COMPLETO DE ATRIBUTOS DEL MODELO Player ---
// Claves deben coincidir EXACTAMENTE con los nombres de campo en models.py y serializers.py
const attributeTranslations = {
  // Técnicos
  control: 'Control', regate: 'Regate', pase: 'Pase',
  precision_tiro: 'Precisión Tiro', potencia_tiro: 'Potencia Tiro',
  tiros_lejanos: 'Tiros Lejanos', tiros_libres: 'Tiros Libres',
  penales: 'Penales', remate_cabeza: 'Remate Cabeza', saques_banda: 'Saques Banda',
  // Físicos
  velocidad: 'Velocidad', agilidad: 'Agilidad', resistencia: 'Resistencia',
  fuerza: 'Fuerza',
  // Mentales/Tácticos
  anticipacion: 'Anticipación', posicionamiento: 'Posicionamiento',
  vision_juego: 'Visión Juego', trabajo_equipo: 'Trabajo Equipo',
  liderazgo: 'Liderazgo', marcaje: 'Marcaje', entradas: 'Entradas',
  talento: 'Talento',
  // Otros que puedas tener
};

// Función auxiliar para agrupar atributos
const groupAttributes = (playerData) => {
    const groups = {
        tecnicos: [],
        fisicos: [],
        mentales: [],
    };
    const techKeys = ['control', 'regate', 'pase', 'precision_tiro', 'potencia_tiro', 'tiros_lejanos', 'tiros_libres', 'penales', 'remate_cabeza', 'saques_banda'];
    const physKeys = ['velocidad', 'agilidad', 'resistencia', 'fuerza'];
    const mentalKeys = ['anticipacion', 'posicionamiento', 'vision_juego', 'trabajo_equipo', 'liderazgo', 'marcaje', 'entradas', 'talento'];

    for (const key in playerData) {
        if (attributeTranslations[key]) {
            const attribute = {
                name: attributeTranslations[key],
                value: playerData[key] ?? 'N/A', // Usa ?? para manejar null/undefined
                key: key
            };
            if (techKeys.includes(key)) groups.tecnicos.push(attribute);
            else if (physKeys.includes(key)) groups.fisicos.push(attribute);
            else if (mentalKeys.includes(key)) groups.mentales.push(attribute);
        }
    }
    // Ordenar alfabéticamente dentro de cada grupo
    Object.values(groups).forEach(group => group.sort((a, b) => a.name.localeCompare(b.name)));
    return groups;
};


/**
 * Muestra una cuadrícula con los atributos BASE del jugador (0-100).
 * @param {object} props
 * @param {object} props.playerData - Objeto que contiene los atributos del jugador.
 */
function StatsGrid({ playerData }) {
    if (!playerData) {
        // Español
        return <div>Cargando atributos...</div>;
    }

    // Agrupa los atributos usando la función auxiliar
    const groupedAttributes = groupAttributes(playerData);

    // Estilos básicos inline si no tienes StatsGrid.css
    const cardStyle = { background: '#2a2f37', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', color: '#e0e0e0' };
    const titleStyle = { color: '#eee', marginBottom: '1rem', fontSize: '1.1em', borderBottom: '1px solid #444', paddingBottom: '0.5rem' };
    const groupTitleStyle = { color: '#aaa', marginTop: '1rem', marginBottom: '0.5rem', fontSize: '0.9em', textTransform: 'uppercase' };
    const gridContainerStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' };
    const itemStyle = { background: '#313742', padding: '0.5rem 0.75rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    const nameStyle = { fontSize: '0.9em', color: '#ccc' };
    const valueStyle = { fontSize: '1em', fontWeight: 'bold', color: '#fff' };


    // Función para renderizar un grupo de atributos
    const renderGroup = (title, attributes) => (
        <div key={title}>
            <h4 style={groupTitleStyle}>{title}</h4>
            {attributes.length > 0 ? (
                <div className="grid-container" style={gridContainerStyle}>
                    {attributes.map((attr) => (
                        <div key={attr.key} className="stat-item" style={itemStyle}>
                            <span className="stat-name" style={nameStyle}>{attr.name}:</span>
                            <span className="stat-value" style={valueStyle}>{attr.value}</span>
                        </div>
                    ))}
                </div>
            ) : <p style={{color: '#888', fontSize: '0.9em'}}>No disponibles</p>}
        </div>
    );

    return (
        // Mantenemos la estructura original del card con clases (si existen) o aplicamos estilos inline
        <div className="card stats-grid-card" style={cardStyle}>
           <div className="card-title" style={titleStyle}>
                {/* <FontAwesomeIcon icon={faBrain} /> */} {/* Ícono opcional */}
                Atributos del Jugador {/* Español */}
            </div>
            {renderGroup('Técnicos', groupedAttributes.tecnicos)}
            {renderGroup('Físicos', groupedAttributes.fisicos)}
            {renderGroup('Mentales / Tácticos', groupedAttributes.mentales)}
        </div>
      );
}

StatsGrid.propTypes = {
    // Espera el objeto completo playerData
    playerData: PropTypes.object,
};

export default StatsGrid;
