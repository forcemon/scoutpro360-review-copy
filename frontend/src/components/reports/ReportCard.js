// frontend/src/components/reports/ReportCard.js
import React from 'react';
// Add these imports if not already present
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import './ReportCard.css';

const ReportCard = ({ report, onReportClick }) => { // Added onReportClick
  const reportDate = report.report_date ? new Date(report.report_date).toLocaleDateString() : (report.creation_date ? new Date(report.creation_date).toLocaleDateString() : 'Fecha desconocida'); // Used report_date first
  const authorName = report.scout_username || (report.author_info ? report.author_info.username : 'Autor desconocido'); // Used scout_username
  const summary = report.summary || (report.content ? `${report.content.substring(0, 80)}...` : 'Sin resumen.');
  const ratingValue = report.overall_rating;

  // Construct displayTitle
  const displayTitle = report.match_observed 
                     ? `${report.match_observed} (${report.report_specialization_display || 'General'})`
                     : `${report.report_specialization_display || 'Informe'} para ${report.player_name || 'Jugador Desconocido'}`;

  // Use the passed onReportClick prop if available
  const handleCardClick = () => {
    if (onReportClick) {
      onReportClick(report.id);
    } else {
      console.log(`Clic en ReportCard ID: ${report.id}. No action defined.`);
    }
  };

  const renderStars = (rating) => {
    const numRating = parseFloat(rating);

    if (isNaN(numRating) || numRating < 0 || numRating > 100) {
        return <span className="rating-stars-na">N/A</span>;
    }

    const ratingOn5Scale = (numRating / 100) * 5;
    const roundedRating = Math.round(ratingOn5Scale * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const halfStar = roundedRating % 1 !== 0;
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));

    return (
      <span className="rating-stars">
        {[...Array(fullStars)].map((_, i) => <FontAwesomeIcon key={`full-${i}`} icon={faStar} />)}
        {halfStar && <FontAwesomeIcon key="half" icon={faStarHalfAlt} />}
        {[...Array(emptyStars)].map((_, i) => <FontAwesomeIcon key={`empty-${i}`} icon={faStarEmpty} />)}
      </span>
    );
  };

  return (
    <div className="report-card" onClick={handleCardClick} style={{ cursor: onReportClick ? 'pointer' : 'default' }}>
      <div className="report-card-header">
        <h3 className="report-card-title">{displayTitle}</h3>
        <span className="report-card-date">{reportDate}</span>
      </div>
      <p className="report-card-author">Por: {authorName}</p>
      <p className="report-card-summary">{summary}</p>
      <div className="report-card-footer">
        <div className="report-card-rating">
          {renderStars(ratingValue)}
          <span className="rating-value">{typeof ratingValue === 'number' ? (ratingValue / 20).toFixed(1) : 'N/A'} / 5</span>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes if not already present for onReportClick
import PropTypes from 'prop-types';

ReportCard.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    // title: PropTypes.string, // Removed as it's no longer directly used for display
    match_observed: PropTypes.string,
    report_specialization_display: PropTypes.string,
    player_name: PropTypes.string,
    created_at: PropTypes.string, 
    report_date: PropTypes.string, 
    author_info: PropTypes.shape({ username: PropTypes.string }), // Kept if still part of underlying data
    scout_username: PropTypes.string, 
    summary: PropTypes.string,
    content: PropTypes.string, // Kept if used for summary fallback
    overall_rating: PropTypes.number,
  }).isRequired,
  onReportClick: PropTypes.func,
};

export default ReportCard;
