import React from 'react';
import PropTypes from 'prop-types';
import ReportCard from './ReportCard'; // Importamos el componente de tarjeta que ya tenemos

// Nota: No necesitamos un CSS específico para este componente si
// MyReportsPage.css ya define los estilos para ".reports-grid"

// --- MODIFICACIÓN: Añadir prop onReportClick ---
function ReportGrid({ reports = [], onReportClick }) {
  // Podríamos añadir un mensaje si no hay informes, pero MyReportsPage ya lo maneja
  if (!reports || reports.length === 0) {
    return null;
  }

  return (
    // Usamos la clase CSS definida en MyReportsPage.css
    <div className="reports-grid">
      {reports.map(report => (
        // --- MODIFICACIÓN: Pasar onReportClick a ReportCard ---
        <ReportCard
            key={report.id}
            report={report}
            onReportClick={onReportClick} // Pasar la función recibida
        />
      ))}
    </div>
  );
}

ReportGrid.propTypes = {
  reports: PropTypes.arrayOf(PropTypes.object).isRequired,
  // --- MODIFICACIÓN: Añadir propType ---
  onReportClick: PropTypes.func,
};

export default ReportGrid;