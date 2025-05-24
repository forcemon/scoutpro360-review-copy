// frontend/src/components/playerProfile/ReportsTabContent.js
import React from 'react';
// import { useNavigate } from 'react-router-dom'; // Ya no se necesita useNavigate
import ReportListItem from '../reports/ReportListItem'; // Asumiendo que tienes este componente
import './ReportsTabContent.css';

// Componente para mostrar la lista de informes en la pestaña del perfil
const ReportsTabContent = ({ reports }) => {
  // const navigate = useNavigate(); // Ya no se necesita

  // Función para manejar el clic en un informe (AHORA NO HACE NADA O SOLO LOG)
  const handleReportClick = (reportId) => {
    console.log(`Clic en informe con ID: ${reportId}. Navegación deshabilitada.`);
    // Ya no navegamos:
    // navigate(`/reports/${reportId}`);
  };

  // Verifica si hay informes para mostrar
  if (!reports || reports.length === 0) {
    return <div className="no-reports-message">No hay informes disponibles para este jugador.</div>;
  }

  return (
    <div className="reports-tab-content">
      {/* <h3 className="reports-tab-title">Informes de Scouting</h3> */}
      <div className="report-list-profile"> {/* Usa una clase específica si necesitas estilos diferentes aquí */}
        {reports.map((report) => (
          <ReportListItem
            key={report.id}
            report={report}
            // Pasa la función de manejo de clic (aunque ahora no navega)
            // o simplemente no la pases si ReportListItem no la necesita
            onClick={() => handleReportClick(report.id)}
          />
        ))}
      </div>
      {/* Podrías añadir un botón para "Ver todos los informes" si la lista es muy larga */}
      {/* O un botón para "Crear nuevo informe" */}
    </div>
  );
};

export default ReportsTabContent;
