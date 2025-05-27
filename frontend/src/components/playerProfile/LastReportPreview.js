// frontend/src/components/playerProfile/LastReportPreview.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './LastReportPreview.css'; // Asegúrate de tener estilos básicos

// Componente para mostrar una vista previa del último informe
const LastReportPreview = ({ report }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Si no hay informe, muestra un mensaje
  if (!report) {
    return (
      <div className="last-report-preview placeholder">
        <p>No hay informes recientes disponibles.</p>
        {/* Podrías añadir un botón para crear uno */}
      </div>
    );
  }

  // Formatea la fecha si es necesario (ejemplo básico)
  const reportDate = report.report_date ? new Date(report.report_date).toLocaleDateString() : 'Fecha desconocida'; // Updated prop
  const authorName = report.scout_username || 'Autor desconocido'; // Updated prop

  const handleViewMoreClick = () => {
    if (report && report.id) {
        navigate(`/reports/${report.id}`);
    } else {
        console.log('ID de informe no disponible para navegación.');
    }
  };

  return (
    <div className="last-report-preview">
      {/* <h4 className="preview-title">Último Informe</h4> */}
      <div className="report-header-preview">
        <span className="report-title-preview">{report.title || 'Informe sin título'}</span>
        <span className="report-date-preview">{reportDate}</span>
      </div>
      <p className="report-author-preview">Por: {authorName}</p>
      <p className="report-summary-preview">
        {/* Muestra un resumen corto, puede venir del backend o cortar el 'content' */}
        {report.summary || (report.content ? `${report.content.substring(0, 100)}...` : 'Sin resumen disponible.')}
      </p>
      <div className="report-footer-preview">
        {/* Reemplaza el Link con un botón o div no funcional */}
        <button onClick={handleViewMoreClick} className="view-more-button">
          Ver más
        </button>
        {/* O si prefieres un div con estilo de enlace: */}
        {/* <div onClick={handleViewMoreClick} className="view-more-link-styled">
          Ver más
        </div> */}
      </div>
    </div>
  );
};

export default LastReportPreview;
