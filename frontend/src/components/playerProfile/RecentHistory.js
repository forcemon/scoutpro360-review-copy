// src/components/playerProfile/RecentHistory.js
import React from 'react';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom'; // Link no se usa, se elimina la importación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory } from '@fortawesome/free-solid-svg-icons';
import './RecentHistory.css'; // Crear este archivo CSS después

// Helper para generar logo placeholder basado en nombre
const generateLogoUrl = (name) => {
    const initials = name ? name.substring(0, 3).toUpperCase() : 'N/A';
    return `https://via.placeholder.com/40/313742/FFFFFF/?text=${initials}`;
};

function RecentHistory({ playerData }) {

    // --- IMPORTANTE: Usando Datos de Ejemplo Temporalmente ---
    // El historial completo de clubes requeriría un modelo relacionado en el backend
    // (ej: PlayerClubHistory) que no existe actualmente.
    // Usamos el club actual de playerData y añadimos otros de ejemplo.
    const currentClub = playerData?.team?.name || 'Club Actual Desc.'; // Corregido para acceder a team.name
    const placeholderHistory = [
        {
            name: currentClub,
            period: '2023 - Actual', // Asumir un periodo para el actual
            logo: generateLogoUrl(currentClub),
            stats: 'PJ: ? Goles: ?' // Stats necesitarían venir de otra fuente
        },
        {
            name: 'SC Atlético', // Ejemplo
            period: '2020 - 2023',
            logo: generateLogoUrl('SCA'),
            stats: '87 PJ / 38 Goles' // Ejemplo
        },
         {
            name: 'CD Sevilla Juvenil', // Ejemplo
            period: '2018 - 2020',
            logo: generateLogoUrl('CDS'),
            stats: 'Juvenil' // Ejemplo
        },
        // ... más historial si se quisiera mostrar más
    ];

    // TODO: Reemplazar placeholderHistory con datos reales cuando el backend los proporcione
    // const history = playerData?.club_history || placeholderHistory;
    const history = placeholderHistory;
    // --- Fin Datos de Ejemplo ---

    // Limitar a mostrar solo los N más recientes en esta preview
    const historyToShow = history.slice(0, 2); // Mostrar máximo 2 aquí

    return (
        // Se usa la clase 'card' global
        <div className="card recent-history-card">
           <div className="card-title">
                <FontAwesomeIcon icon={faHistory} />
                Historial Reciente
            </div>
           <div className="team-history-list">
              {historyToShow.length > 0 ? (
                    historyToShow.map((item, index) => (
                      <div key={item.name + '-' + index} className="team-item-preview"> {/* Usar key más robusta si hay IDs */}
                          <div className="team-logo-preview">
                              <img src={item.logo || generateLogoUrl(item.name)} alt={`${item.name} logo`}/>
                          </div>
                          <div className="team-info-preview">
                             <div className="team-name-preview">{item.name}</div>
                             <div className="team-period-preview">{item.period}</div>
                          </div>
                          <div className="team-stats-preview">{item.stats}</div>
                      </div>
                    ))
              ) : (
                  <p className="no-history-info">No hay historial disponible.</p>
              )}
           </div>
           {/* Enlace opcional a la pestaña/sección de historial completo */}
           {/* Podría ser un enlace interno a #tab-historial si se implementa con scroll
               o un Link de react-router si es una página separada */}
           {history.length > historyToShow.length && (
               <p className="view-full-history">
                   {/* <Link to={`/players/${playerData?.id}/history`}>Ver historial completo</Link> */}
                   {/* O si es un tab en la misma página: */}
                   {/* <a href="#history-section-id">Ver historial completo</a> */}
                   <span style={{fontSize: '12px', color: 'var(--secondary-text)'}}> (Historial completo en su pestaña)</span>
               </p>
           )}
        </div>
      );
}

RecentHistory.propTypes = {
    playerData: PropTypes.shape({
        // current_club: PropTypes.string, // El modelo Player ahora tiene 'team'
        team: PropTypes.shape({ name: PropTypes.string }), // Acceder a través de team
        // Se esperaría algo como:
        // club_history: PropTypes.arrayOf(PropTypes.shape({
        //     name: PropTypes.string,
        //     period_start: PropTypes.string,
        //     period_end: PropTypes.string,
        //     logo_url: PropTypes.string,
        //     matches_played: PropTypes.number,
        //     goals: PropTypes.number,
        // }))
    }),
};

export default RecentHistory;