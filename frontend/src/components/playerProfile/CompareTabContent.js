// src/components/playerProfile/CompareTabContent.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import './CompareTabContent.css'; // We will create this CSS file next

function CompareTabContent({ playerData }) {

    // TODO: Implement comparison logic:
    // 1. UI to search and select another player.
    // 2. API call to fetch the second player's data.
    // 3. UI to display relevant data (attributes, stats) side-by-side.

    return (
        // Use global 'card' class and a specific one
        <div className="card compare-tab-card">
            <div className="card-title">
                <FontAwesomeIcon icon={faExchangeAlt} /> Comparar Jugador
            </div>
            <div className="compare-placeholder-content">
                <FontAwesomeIcon icon={faExchangeAlt} size="3x" className="placeholder-icon"/>
                <p>Funcionalidad de comparación de jugadores (Próximamente)</p>
                <p>
                    Aquí podrás seleccionar otro jugador de la base de datos
                    para comparar sus atributos, estadísticas y trayectoria
                    lado a lado con {playerData?.full_name || 'este jugador'}.
                </p>
                {/* Future UI would go here: Player selector, comparison view */}
                 <p className="data-source-note compare-tab-note">
                    Nota: Esta funcionalidad requiere lógica adicional en el frontend y posiblemente ajustes en la API para buscar y obtener datos de jugadores para comparar.
                </p>
            </div>
        </div>
    );
}

CompareTabContent.propTypes = {
    playerData: PropTypes.object,
};

export default CompareTabContent;
