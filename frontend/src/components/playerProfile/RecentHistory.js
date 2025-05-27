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
    let historyEvents = [];

    if (playerData) {
        // Current Team Info
        if (playerData.team_name) { // team_name is directly available from PlayerSerializer
            const currentTeamPeriod = playerData.contract_until ? `Hasta ${new Date(playerData.contract_until).toLocaleDateString()}` : 'Actual';
            // Assuming team_details might contain the logo, if not, team_logo_url would be a direct prop.
            // For now, let's assume PlayerSerializer provides team_details.logo_url if available.
            // If PlayerSerializer provides team_logo_url directly on playerData, that's simpler.
            // Given PlayerSerializer structure, team_details might not be standard for the direct current team.
            // Let's try to get logo from playerData.team_details if it exists (it's not in current PlayerSerializer for current team),
            // or a hypothetical playerData.team_logo_url. Fallback to generateLogoUrl.
            // The most robust from current PlayerSerializer is `playerData.team.logo_url` if `team` was an object, but it's set to `team_name`.
            // So, if `playerData.team` itself is an object:
            const teamLogo = playerData.team?.logo_url || generateLogoUrl(playerData.team_name);

            historyEvents.push({
                name: playerData.team_name,
                period: currentTeamPeriod,
                logo: teamLogo, 
                stats: 'Club Actual',
                type: 'current'
            });
        }

        // Loan Information
        if (playerData.contract_status === 'LOANED_OUT' && playerData.loan_destination_team_details) {
            historyEvents.push({
                name: `Cedido a: ${playerData.loan_destination_team_details.name}`,
                period: playerData.contract_until ? `Hasta ${new Date(playerData.contract_until).toLocaleDateString()}` : 'Préstamo',
                logo: playerData.loan_destination_team_details.logo_url || generateLogoUrl(playerData.loan_destination_team_details.name),
                stats: 'En Préstamo',
                type: 'loan_out'
            });
        }

        if (playerData.contract_status === 'LOANED_IN' && playerData.loan_origin_team_details) {
            historyEvents.push({
                name: `Cedido de: ${playerData.loan_origin_team_details.name}`,
                period: 'Actual (Préstamo)', // Or specific loan end date if available
                logo: playerData.loan_origin_team_details.logo_url || generateLogoUrl(playerData.loan_origin_team_details.name),
                stats: 'En Préstamo (Aquí)',
                type: 'loan_in'
            });
        }
    }
    
    const history = historyEvents; // Use the dynamically constructed events

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
        team_name: PropTypes.string, // Direct from PlayerSerializer
        team: PropTypes.shape({ // If team object is passed (not typical for team_name scenario)
            logo_url: PropTypes.string,
        }),
        contract_until: PropTypes.string,
        contract_status: PropTypes.string,
        loan_destination_team_details: PropTypes.shape({
            name: PropTypes.string,
            logo_url: PropTypes.string,
        }),
        loan_origin_team_details: PropTypes.shape({
            name: PropTypes.string,
            logo_url: PropTypes.string,
        }),
        // id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Example if needed by Link
    }),
};

export default RecentHistory;