// src/components/playerProfile/StatsTabContent.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faFutbol, faRandom, faSortAmountUp, faTrophy, faMedal, faStar } from '@fortawesome/free-solid-svg-icons'; // Importar iconos necesarios
import './StatsTabContent.css'; // Crear este archivo CSS después

// Placeholder data (¡Backend necesita proveer esto!)
const placeholderDetailedStats = {
    offensive: [
        { label: 'Goles/90min', value: 0.56 }, { label: 'Asist./90min', value: 0.27 },
        { label: 'Regates/90min', value: 3.2 }, { label: 'Tiros/90min', value: 3.8 },
        { label: 'Tiros Puerta/90min', value: 1.9 }, { label: 'xG/90min', value: 0.76 },
    ],
    creation: [
        { label: 'Pases/90min', value: 25.8 }, { label: 'Precisión Pases', value: '85%' },
        { label: 'Pases Clave/90min', value: 1.5 }, { label: 'Centros/90min', value: 2.3 },
        { label: 'xA/90min', value: 0.23 }, { label: 'Conducción Prog./90min', value: 4.2 },
    ]
};

const placeholderRankings = [
    { label: 'Goles', rank: 3, total: 58, percentile: 91 },
    { label: 'xG', rank: 5, total: 58, percentile: 87 },
    { label: 'Regates Completados', rank: 2, total: 58, percentile: 94 },
    { label: 'Velocidad Promedio', rank: 1, total: 58, percentile: 97 },
    { label: 'Contribución Defensiva', rank: 38, total: 58, percentile: 35 },
];

const placeholderAchievements = {
    titles: [
        { icon: faTrophy, title: 'Copa Nacional 2024', subtitle: 'SC Atlético' },
        { icon: faMedal, title: 'Campeón Liga Juvenil 2020', subtitle: 'CD Sevilla Juvenil' }, // Usar faMedal o similar
    ],
    awards: [
        { icon: faStar, title: 'Mejor Jugador Joven', subtitle: '2023/24 • Liga Nacional' }, // Usar faStar o similar
        { icon: faStar, title: 'Máximo Goleador Sub-21', subtitle: '2023/24 • Liga Nacional' },
    ]
};
// --- Fin Placeholder Data ---

function StatsTabContent({ playerData }) {

    // TODO: Reemplazar placeholders con datos reales de playerData cuando el backend los provea.
    // Esto requerirá cambios significativos en el backend (modelos, cálculos, etc.)

    return (
        // Usamos clase 'card' global y una específica
        <div className="card stats-tab-card">
            <div className="card-title">
                <FontAwesomeIcon icon={faChartBar} /> Estadísticas Detalladas y Logros
            </div>

            {/* --- Sección Estadísticas Detalladas --- */}
            <div className="section-header stats-header"> {/* Clase opcional para estilo */}
                 <FontAwesomeIcon icon={faFutbol} /> Ofensivas
            </div>
            <div className="detailed-stats-grid">
                {placeholderDetailedStats.offensive.map(stat => (
                     <div key={stat.label} className="detailed-stat-card">
                         <div className="detailed-stat-value">{stat.value}</div>
                         <div className="detailed-stat-label">{stat.label}</div>
                     </div>
                 ))}
            </div>

             <div className="section-header stats-header">
                 <FontAwesomeIcon icon={faRandom} /> Creación y Distribución
             </div>
             <div className="detailed-stats-grid">
                 {placeholderDetailedStats.creation.map(stat => (
                     <div key={stat.label} className="detailed-stat-card">
                         <div className="detailed-stat-value">{stat.value}</div>
                         <div className="detailed-stat-label">{stat.label}</div>
                     </div>
                 ))}
             </div>
             {/* --- Fin Estadísticas Detalladas --- */}


            <div className="content-grid stats-lower-grid"> {/* Grid para Ranking y Logros */}
                {/* Columna Principal (Ranking) */}
                <div className="main-column">
                    <div className="card ranking-card"> {/* Puede ser un card anidado o solo la sección */}
                        <div className="card-title ranking-title">
                            <FontAwesomeIcon icon={faSortAmountUp} /> Ranking Comparativo
                        </div>
                        {/* TODO: Contexto del ranking debería venir del backend */}
                        <p className="ranking-context">Ranking entre Delanteros de la Liga (Ejemplo)</p>
                        <div className="ranking-list">
                             {placeholderRankings.map(item => (
                                 <div key={item.label} className="ranking-item">
                                     <div className="ranking-label">{item.label}</div>
                                     <div className="ranking-bar-container">
                                         <div
                                             className="ranking-bar-fill"
                                             style={{ width: `${item.percentile}%` }} // Usar percentil para la barra
                                             title={`${item.percentile}% Percentil`}
                                         ></div>
                                     </div>
                                     <div className="ranking-value">{item.rank}º / {item.total}</div>
                                 </div>
                             ))}
                         </div>
                     </div>
                </div>

                {/* Columna Lateral (Logros) */}
                <div className="side-column">
                     <div className="card achievements-card"> {/* Card anidado o sección */}
                         <div className="card-title achievements-title">
                             <FontAwesomeIcon icon={faTrophy} /> Logros y Récords
                         </div>

                         <div className="section-header achievements-sub-header">
                             <FontAwesomeIcon icon={faMedal} /> Títulos
                         </div>
                         <div className="achievements-list">
                             {placeholderAchievements.titles.map((item, index) => (
                                 <div key={`title-${index}`} className="achievement-item trophy-item">
                                     <div className="achievement-icon trophy-icon">
                                         <FontAwesomeIcon icon={item.icon} />
                                     </div>
                                     <div className="achievement-info trophy-info">
                                         <div className="achievement-title trophy-title">{item.title}</div>
                                         <div className="achievement-subtitle trophy-subtitle">{item.subtitle}</div>
                                     </div>
                                 </div>
                             ))}
                         </div>

                         <div className="section-header achievements-sub-header">
                             <FontAwesomeIcon icon={faStar} /> Premios Individuales
                         </div>
                          <div className="achievements-list">
                             {placeholderAchievements.awards.map((item, index) => (
                                 <div key={`award-${index}`} className="achievement-item award-item">
                                     <div className="achievement-icon award-icon">
                                         <FontAwesomeIcon icon={item.icon} />
                                     </div>
                                     <div className="achievement-info award-info">
                                         <div className="achievement-title award-title">{item.title}</div>
                                         <div className="achievement-subtitle award-subtitle">{item.subtitle}</div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                </div>
            </div>
             <p className="data-source-note stats-tab-note">
                Nota: Las estadísticas detalladas, rankings y logros son ejemplos. Se requiere una integración avanzada con fuentes de datos y lógica en el backend para mostrar información real.
            </p>
        </div>
    );
}

StatsTabContent.propTypes = {
    playerData: PropTypes.object, // Apenas se usa por ahora
};

export default StatsTabContent;