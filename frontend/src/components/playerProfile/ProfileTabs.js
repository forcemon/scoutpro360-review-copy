// frontend/src/components/playerProfile/ProfileTabs.js
import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import './ProfileTabs.css'; // Asegúrate de importar los estilos

// Importa FontAwesome y los iconos necesarios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faRunning, faBrain, faChartLine, faHistory,
    faFileAlt, faPhotoVideo, faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';

// Importa todos los componentes de contenido de las pestañas
import GeneralTabContent from './GeneralTabContent';
import PhysicalTabContent from './PhysicalTabContent';
import TechnicalTacticalTabContent from './TechnicalTacticalTabContent';
import StatsTabContent from './StatsTabContent';
import HistoryTabContent from './HistoryTabContent';
import ReportsTabContent from './ReportsTabContent';
import MediaTabContent from './MediaTabContent';
import CompareTabContent from './CompareTabContent';

// Definición de las pestañas disponibles con iconos importados
const TABS_CONFIG = [
  { id: 'general', label: 'Vista General', icon: faUser, component: GeneralTabContent },
  { id: 'physical', label: 'Físico', icon: faRunning, component: PhysicalTabContent },
  { id: 'technical', label: 'Técnico-Táctico', icon: faBrain, component: TechnicalTacticalTabContent }, // Usamos faBrain
  { id: 'stats', label: 'Estadísticas', icon: faChartLine, component: StatsTabContent },
  { id: 'history', label: 'Historial', icon: faHistory, component: HistoryTabContent },
  { id: 'reports', label: 'Informes', icon: faFileAlt, component: ReportsTabContent },
  { id: 'media', label: 'Multimedia', icon: faPhotoVideo, component: MediaTabContent },
  { id: 'compare', label: 'Comparar', icon: faExchangeAlt, component: CompareTabContent },
];

const ProfileTabs = ({ playerData, lastReport, lastReportLoading }) => {
  // Estado interno para manejar la pestaña activa
  const [activeTabId, setActiveTabId] = useState(TABS_CONFIG[0].id); // Inicia con la primera pestaña

  // Función para manejar el clic en una pestaña
  const handleTabClick = (tabId) => {
    console.log(`Cambiando a la pestaña: ${tabId}`); // Log para debugging
    setActiveTabId(tabId);
  };

  // Encuentra la configuración de la pestaña activa
  const activeTabData = TABS_CONFIG.find(tab => tab.id === activeTabId);
  // Obtiene el componente a renderizar para la pestaña activa
  const ActiveTabContentComponent = activeTabData ? activeTabData.component : null;

  return (
    <div className="profile-tabs-container">
      {/* Navegación de Pestañas */}
      <div className="tabs-nav">
        {TABS_CONFIG.map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {/* Renderiza el icono usando FontAwesomeIcon */}
            {tab.icon && <FontAwesomeIcon icon={tab.icon} className="tab-icon" />}
            <span className="tab-label">{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div className="tab-content">
        {/* Renderiza el componente correspondiente si existe */}
        {ActiveTabContentComponent ? (
            // Pasa playerData y report data al componente de contenido activo
            <ActiveTabContentComponent 
                playerData={playerData} 
                lastReport={lastReport} 
                lastReportLoading={lastReportLoading} 
            />
        ) : (
            <div>Contenido no encontrado</div> // Mensaje de fallback
        )}
      </div>
    </div>
  );
};

// Añadir PropTypes
ProfileTabs.propTypes = {
    playerData: PropTypes.object.isRequired, // playerData es esencial para las pestañas
    lastReport: PropTypes.object, // Can be null if no report or still loading
    lastReportLoading: PropTypes.bool,
};


export default ProfileTabs;
