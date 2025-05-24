import React from 'react';
import PropTypes from 'prop-types';
import ReportListItem from './ReportListItem';
import './ReportList.css'; // Crear este CSS

// --- MODIFICACIÓN: Añadir prop onReportClick ---
function ReportList({ reports = [], onReportClick }) {
  return (
    <div className="reports-list-container card"> {/* Usar clase card */}
      {/* Cabecera de la Lista */}
      <div className="list-header">
        <div className="list-header-item h-image"></div> {/* Para imagen */}
        <div className="list-header-item h-info">Informe</div>
        <div className="list-header-item h-tags">Tipo/Tags</div>
        <div className="list-header-item h-author">Autor</div>
        <div className="list-header-item h-date">Fecha</div>
        <div className="list-header-item h-rating">Valoración</div>
      </div>

      {/* Cuerpo de la Lista */}
      <div className="list-body">
        {reports.map(report => (
          // --- MODIFICACIÓN: Pasar onReportClick a ReportListItem ---
          <ReportListItem
            key={report.id}
            report={report}
            onReportClick={onReportClick} // Pasar la función recibida
          />
        ))}
      </div>
    </div>
  );
}

ReportList.propTypes = {
  reports: PropTypes.arrayOf(PropTypes.object).isRequired,
  // --- MODIFICACIÓN: Añadir propType ---
  onReportClick: PropTypes.func,
};

export default ReportList;