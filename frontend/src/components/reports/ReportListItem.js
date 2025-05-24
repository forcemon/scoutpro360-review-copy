import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import './ReportListItem.css'; // Crear este CSS

// --- MODIFICACIÓN: Añadir prop onReportClick ---
function ReportListItem({ report, onReportClick }) {
  const navigate = useNavigate(); // Ahora se usa abajo

  const handleRowClick = () => {
    console.log("Navegar al informe ID (lista):", report.id);
    // --- MODIFICACIÓN: Usar navigate o llamar a prop ---
     if (onReportClick) {
        onReportClick(report.id); // Llamar a la función pasada por el padre
    } else {
       // Comportamiento por defecto si no se pasa onReportClick (opcional)
       // --- MODIFICACIÓN: Descomentado para usar navigate ---
       navigate(`/reports/${report.id}`);
    }
    // O podrías navegar al jugador si es necesario:
    // if (report.player?.id) navigate(`/players/${report.player.id}`);
  };

  const getTagClass = (tagText = '') => {
      const tagLower = tagText.toLowerCase().trim();
      if (tagLower.includes('técnico')) return 'technical';
      if (tagLower.includes('táctico')) return 'tactical';
      if (tagLower.includes('físico')) return 'physical';
      if (tagLower.includes('psico') || tagLower.includes('mental')) return 'psychological';
      if (tagLower.includes('completo') || tagLower.includes('partido')) return 'complete';
      if (tagLower.includes('potencial')) return 'potential';
      return 'default';
  };

  const renderRatingStars = (rating) => {
    // ... (misma función renderRatingStars que en ReportCard) ...
    if (rating === null || rating === undefined || rating === '') return <span className="no-rating">N/A</span>;
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return <span className="no-rating">Inv.</span>;
    const roundedRating = Math.round(numRating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const halfStar = roundedRating % 1 !== 0;
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));
    return (
      <>
        {[...Array(fullStars)].map((_, i) => <FontAwesomeIcon key={`full-${i}`} icon={faStar} />)}
        {halfStar && <FontAwesomeIcon key="half" icon={faStarHalfAlt} />}
        {[...Array(emptyStars)].map((_, i) => <FontAwesomeIcon key={`empty-${i}`} icon={faStarEmpty} />)}
      </>
    );
  };

  const formatDate = (dateString) => {
      // ... (misma función formatDate que en ReportCard) ...
      if (!dateString) return '--';
      try { return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric'}); }
      catch (e) { return '--'; }
  }

  function getInitials(name) {
      // ... (misma función getInitials que en ReportCard) ...
       if (name && typeof name === 'string' && name.length > 0) {
          const names = name.split(' ');
          if (names.length > 1) { return (names[0][0] + names[names.length - 1][0]).toUpperCase(); }
          return name.substring(0, 2).toUpperCase();
      } return '??';
  }

  const player = report?.player;
  const author = report?.author;
  const tags = report?.tags_list || (report?.tags?.split(',').map(t => t.trim()).filter(t => t) || []);
  const playerImageUrl = player?.image_url || `https://ui-avatars.com/api/?name=${getInitials(player?.full_name)}&background=313742&color=e0e0e0&bold=true&size=40`;

  if (!report || !report.id) return null;

  return (
     // --- MODIFICACIÓN: Usar handleRowClick ---
    <div className="report-list-item" onClick={handleRowClick}>
      {/* Columna Imagen */}
      <div className="list-report-cell cell-image">
        <div className="list-report-image">
          <img src={playerImageUrl} alt={player?.full_name || 'Jugador'} />
        </div>
      </div>

      {/* Columna Informe (Título y Jugador) */}
      <div className="list-report-cell cell-title-player">
        <div className="list-report-title" title={report.title || ''}>{report.title || 'Informe sin título'}</div>
        <div className="list-report-player">{player?.full_name || 'Informe General'}</div>
      </div>

      {/* Columna Tipo (Tags) */}
      <div className="list-report-cell cell-tags">
        <div className="list-report-tags">
            {tags.slice(0, 2).map((tag, index) => ( // Mostrar máx 2 tags en lista
                <span key={index} className={`list-report-tag ${getTagClass(tag)}`}>
                    {tag}
                </span>
            ))}
             {tags.length > 2 && <span className="list-report-tag more-tags">+{tags.length - 2}</span>}
        </div>
      </div>

      {/* Columna Autor */}
      <div className="list-report-cell cell-author">{author?.username || 'N/A'}</div>

      {/* Columna Fecha */}
      <div className="list-report-cell cell-date">{formatDate(report.creation_date)}</div>

      {/* Columna Valoración */}
      <div className="list-report-cell cell-rating">
        <div className="list-report-rating">
            <span className="list-report-stars">{renderRatingStars(report.rating)}</span>
            {/* Opcional: mostrar valor numérico */}
            {/* <span className="list-report-numeric">{report.rating ? parseFloat(report.rating).toFixed(1) : ''}</span> */}
        </div>
      </div>
    </div>
  );
}

ReportListItem.propTypes = {
  report: PropTypes.object.isRequired, // Definir shape más detallado si es necesario
  // --- MODIFICACIÓN: Añadir propType para onReportClick ---
  onReportClick: PropTypes.func,
};

export default ReportListItem;