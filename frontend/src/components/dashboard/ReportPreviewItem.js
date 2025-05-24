// src/components/dashboard/ReportPreviewItem.js
import React from 'react';
import PropTypes from 'prop-types';
import './ReportPreviewItem.css'; // Asegúrate que este CSS exista

function ReportPreviewItem({ thumbnailUrl, title, playerInfo, date, tags = [] }) { // Añadido prop 'tags'

  const getTagClass = (tagText) => {
      const tagLower = tagText.toLowerCase();
      if (tagLower.includes('técnico')) return 'technical';
      if (tagLower.includes('táctico')) return 'tactical';
      if (tagLower.includes('físico')) return 'physical';
      if (tagLower.includes('psico') || tagLower.includes('mental')) return 'psychological';
      if (tagLower.includes('completo')) return 'complete';
      return ''; // Clase por defecto o ninguna
  };

  return (
    <div className="report-item" title={`Informe: ${title} - ${playerInfo}`}>
      <div className="report-thumbnail">
        <img src={thumbnailUrl || `https://ui-avatars.com/api/?name=${title.substring(0,2)}&background=252a34&color=ffc107&bold=true&size=50`} alt={`Informe ${title}`} />
      </div>
      <div className="report-content">
        <div className="report-title">{title}</div>
        <div className="report-meta">
          <div className="report-player">{playerInfo}</div>
          <div className="report-date">{date}</div>
        </div>
         {/* Renderizar los tags */}
        {tags && tags.length > 0 && (
            <div className="report-tags">
                {tags.map((tag, index) => (
                    <span key={index} className={`report-tag ${getTagClass(tag)}`}>
                        {tag}
                    </span>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

ReportPreviewItem.propTypes = {
  thumbnailUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  playerInfo: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string), // Array de strings para los tags
};

export default ReportPreviewItem;