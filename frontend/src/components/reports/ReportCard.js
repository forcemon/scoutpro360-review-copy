// frontend/src/components/reports/ReportCard.js
import React from 'react';
// import { useNavigate } from 'react-router-dom'; // Ya no se necesita si desactivamos nav
import './ReportCard.css'; // Asegúrate de tener estilos

// Componente para mostrar un informe como una tarjeta en una cuadrícula
const ReportCard = ({ report }) => {
  // const navigate = useNavigate(); // Ya no se necesita

  // Formateo básico de datos (ajusta según sea necesario)
  const reportDate = report.created_at ? new Date(report.created_at).toLocaleDateString() : 'Fecha desconocida';
  const authorName = report.author_info ? report.author_info.username : 'Autor desconocido';
  const summary = report.summary || (report.content ? `${report.content.substring(0, 80)}...` : 'Sin resumen.');
  // Asume una valoración numérica si existe, o la calcula de alguna forma
  const ratingValue = typeof report.overall_rating === 'number' ? report.overall_rating.toFixed(1) : 'N/A';

  // --- CORRECCIÓN: Desactivar navegación ---
  const handleCardClick = () => {
    console.log(`Clic en ReportCard ID: ${report.id}. Navegación a detalle desactivada.`);
    // Ya no navegamos a la ruta eliminada:
    // navigate(`/reports/${report.id}`);
  };
  // --- FIN CORRECCIÓN ---

  // Función simple para generar estrellas basado en el rating (ejemplo)
  const renderStars = (rating) => {
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return <span className="rating-stars-na">N/A</span>;
    const fullStars = Math.floor(numRating);
    const halfStar = numRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return (
      <span className="rating-stars">
        {'★'.repeat(fullStars)}
        {'☆'.repeat(halfStar)} {/* Podrías usar un ícono de media estrella */}
        {'☆'.repeat(emptyStars)} {/* Podrías usar un ícono de estrella vacía */}
      </span>
    );
  };


  return (
    // Envolvemos la tarjeta en un div con onClick en lugar de usar Link o navigate directamente
    <div className="report-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}> {/* Añade cursor pointer si quieres indicar que es clickeable */}
      <div className="report-card-header">
        <h3 className="report-card-title">{report.title || 'Informe sin título'}</h3>
        <span className="report-card-date">{reportDate}</span>
      </div>
      <p className="report-card-author">Por: {authorName}</p>
      <p className="report-card-summary">{summary}</p>
      {/* <div className="report-card-tags">
        {report.tags && report.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
      </div> */}
      <div className="report-card-footer">
        <div className="report-card-rating">
          {renderStars(ratingValue)}
          <span className="rating-value">{ratingValue}</span>
        </div>
        {/* Podrías añadir iconos de acciones si fueran necesarios, pero sin navegación */}
        {/* <div className="report-card-actions"> <i className="fas fa-ellipsis-h"></i> </div> */}
      </div>
    </div>
  );
};

export default ReportCard;
