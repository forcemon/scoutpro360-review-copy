// src/components/playerProfile/GeneralTabContent.js
import React from 'react';
import PropTypes from 'prop-types';

// Importa los componentes que SÍ existen y se usan aquí
import AttributeRadarChart from './AttributeRadarChart'; // Asumiendo que este existe
import FieldPositions from './FieldPositions';
// import StatsGrid from './StatsGrid'; // Replaced by KeyStatsHighlight
import KeyStatsHighlight from './KeyStatsHighlight'; // Added import
import LastReportPreview from './LastReportPreview'; // Asumiendo que este existe
import RecentHistory from './RecentHistory'; // Asumiendo que este existe

import './GeneralTabContent.css'; // Verifica la ruta

/**
 * Contenedor para la pestaña general. Renderiza otros componentes pasándoles playerData.
 * Mantiene la estructura original de dos columnas.
 * @param {object} props
 * @param {object} props.playerData - Datos completos del jugador.
 * @param {object} props.lastReport - El último informe del jugador.
 * @param {boolean} props.lastReportLoading - Estado de carga del último informe.
 */
function GeneralTabContent({ playerData, lastReport, lastReportLoading }) {
    // Este componente actúa como contenedor, pasa los datos a los hijos
    if (!playerData) {
        return <div>Cargando datos...</div>; // Mensaje simple de carga
    }

    return (
        <div className="general-tab-content">
            <div className="content-grid">
                {/* Columna Principal */}
                <div className="main-column">
                    {/* Renderiza los componentes que van en esta columna */}
                    {/* Asegúrate que estos componentes esperen 'playerData' o props específicas */}
                    <AttributeRadarChart playerData={playerData} />
                    {/* Pasa las claves de posición a FieldPositions */}
                    <FieldPositions
                        position1Key={playerData.position1}
                        position2Key={playerData.position2}
                        position3Key={playerData.position3}
                    />
                </div>

                {/* Columna Lateral */}
                <div className="side-column">
                    {/* Renderiza los componentes que van aquí */}
                    <KeyStatsHighlight playerData={playerData} /> 
                    <LastReportPreview 
                        report={lastReport} 
                        isLoading={lastReportLoading} 
                    />
                    <RecentHistory playerData={playerData} />
                </div>
            </div>
        </div>
    );
}

GeneralTabContent.propTypes = {
    // Espera el objeto completo playerData
    playerData: PropTypes.object,
    lastReport: PropTypes.object,
    lastReportLoading: PropTypes.bool,
};

export default GeneralTabContent;
