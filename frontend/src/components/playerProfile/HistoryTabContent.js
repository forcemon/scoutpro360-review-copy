// src/components/playerProfile/HistoryTabContent.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faFlag, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import './HistoryTabContent.css'; // Crear este archivo CSS después

// --- IMPORTANTE: Usando Datos de Ejemplo Temporalmente ---
// El backend necesita nuevos modelos (ej: ClubHistory, NationalTeamHistory, InjuryRecord)
// y formas de obtener/almacenar estos datos para mostrar información real.

const placeholderClubHistory = [
     { id: 1, period: '2023 - Actual', title: 'FC Innovatech', subtitle: 'Primera División', content: 'Traspaso récord desde SC Atlético...', stats: [{ label: 'Partidos', value: 45 }, { label: 'Goles', value: 25 }, { label: 'Asist.', value: 12 }, { label: 'Mins', value: '3,865' }] },
     { id: 2, period: '2020 - 2023', title: 'SC Atlético', subtitle: 'Primera División', content: 'Debut profesional a los 18 años...', stats: [{ label: 'Partidos', value: 87 }, { label: 'Goles', value: 38 }, { label: 'Asist.', value: 15 }, { label: 'Mins', value: '6,120' }] },
     { id: 3, period: '2018 - 2020', title: 'CD Sevilla Juvenil', subtitle: 'División de Honor Juvenil', content: 'Formado en la cantera...', stats: [] }, // Sin stats de ejemplo para juvenil
];

const placeholderNationalHistory = [
    { id: 1, period: '2023 - Actual', title: 'España Sub-21', content: 'Convocado regularmente...', stats: [{ label: 'Partidos', value: 15 }, { label: 'Goles', value: 8 }] },
    { id: 2, period: '2021 - 2023', title: 'España Sub-19', content: 'Participó en el Europeo...', stats: [{ label: 'Partidos', value: 22 }, { label: 'Goles', value: 11 }] }, // Ejemplo stats
];

const placeholderInjuryHistory = [
    { id: 1, type: 'Distensión Isquiotibial', date: 'Feb 2024', duration: '3 semanas', games_missed: 4 },
    { id: 2, type: 'Esguince de Tobillo', date: 'Nov 2022', duration: '4 semanas', games_missed: 5 },
     { id: 3, type: 'Sobrecarga Muscular', date: 'Sep 2021', duration: '1 semana', games_missed: 1 },
];
// --- Fin Datos de Ejemplo ---


function HistoryTabContent({ playerData }) {

    // TODO: Reemplazar placeholders con datos reales de playerData cuando el backend los provea.
    const clubHistory = placeholderClubHistory;
    const nationalHistory = placeholderNationalHistory;
    const injuryHistory = placeholderInjuryHistory;

    return (
        // Usamos clase 'card' global y una específica
        <div className="card history-tab-card">
            {/* Usamos content-grid para layout general */}
            <div className="content-grid history-grid">
                {/* Columna Principal */}
                <div className="main-column">
                    {/* Trayectoria Deportiva (Clubes) */}
                    <div className="history-section club-history">
                        <div className="card-title history-section-title"> {/* Título como card-title */}
                            <FontAwesomeIcon icon={faHistory} /> Trayectoria Deportiva (Clubes)
                        </div>
                        <div className="timeline">
                            <div className="timeline-line"></div>
                            {clubHistory.length > 0 ? clubHistory.map(item => (
                                <div key={`club-${item.id}`} className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-date">{item.period}</div>
                                    <div className="timeline-card">
                                        <div className="timeline-title">{item.title}</div>
                                        {item.subtitle && <div className="timeline-subtitle">{item.subtitle}</div>}
                                        {item.content && <div className="timeline-content">{item.content}</div>}
                                        {item.stats && item.stats.length > 0 && (
                                            <div className="timeline-stats">
                                                {item.stats.map(stat => (
                                                    <div key={stat.label} className="timeline-stat">
                                                        <strong>{stat.value}</strong> {stat.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) : <p className="no-history">No hay historial de clubes disponible.</p>}
                        </div>
                    </div>

                    {/* Selecciones Nacionales */}
                    <div className="history-section national-history">
                        <div className="card-title history-section-title">
                            <FontAwesomeIcon icon={faFlag} /> Selecciones Nacionales
                        </div>
                         <div className="timeline">
                             <div className="timeline-line"></div>
                             {nationalHistory.length > 0 ? nationalHistory.map(item => (
                                <div key={`nat-${item.id}`} className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-date">{item.period}</div>
                                    <div className="timeline-card">
                                        <div className="timeline-title">{item.title}</div>
                                        {item.content && <div className="timeline-content">{item.content}</div>}
                                        {item.stats && item.stats.length > 0 && (
                                            <div className="timeline-stats">
                                                {item.stats.map(stat => (
                                                    <div key={stat.label} className="timeline-stat">
                                                        <strong>{stat.value}</strong> {stat.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                             )) : <p className="no-history">No hay historial de selecciones disponible.</p>}
                         </div>
                    </div>
                </div>

                {/* Columna Lateral */}
                <div className="side-column">
                    {/* Historial de Lesiones */}
                     <div className="history-section injury-history card"> {/* Añadir clase card aquí */}
                         <div className="card-title history-section-title"> {/* Título como card-title */}
                             <FontAwesomeIcon icon={faHeartBroken} /> Historial de Lesiones
                         </div>
                         <div className="injury-list">
                             {injuryHistory.length > 0 ? injuryHistory.map(item => (
                                <div key={`injury-${item.id}`} className="injury-card"> {/* Sub-card para cada lesión */}
                                     <div className="injury-header">
                                         <div className="injury-type">{item.type}</div>
                                         <div className="injury-date">{item.date}</div>
                                     </div>
                                     <div className="injury-details">
                                         Duración: {item.duration} <br />
                                         Partidos perdidos: {item.games_missed}
                                     </div>
                                 </div>
                             )) : <p className="no-history center">Sin lesiones significativas registradas.</p>}
                         </div>
                     </div>
                      <p className="data-source-note history-tab-note">
                        Nota: La trayectoria detallada y el historial de lesiones son ejemplos. Se requiere implementar modelos y obtener datos en el backend.
                     </p>
                </div>
            </div>
        </div>
    );
}

HistoryTabContent.propTypes = {
    playerData: PropTypes.object, // Apenas se usa por ahora
};

export default HistoryTabContent;
