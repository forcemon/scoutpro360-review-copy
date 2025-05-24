import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faUndo } from '@fortawesome/free-solid-svg-icons';
import './ReportFiltersPanel.css'; // Crear este archivo CSS

// Opciones de tipo de informe (idealmente vendrían de una constante compartida o API)
const reportTypeOptions = [
    { value: '', label: 'Cualquier Tipo' },
    { value: 'Técnico', label: 'Técnico' },
    { value: 'Táctico', label: 'Táctico' },
    { value: 'Físico', label: 'Físico' },
    { value: 'Psicológico', label: 'Psicológico' },
    { value: 'Partido', label: 'Partido' },
    { value: 'Potencial', label: 'Potencial' },
    { value: 'Completo', label: 'Completo' },
    { value: 'Otro', label: 'Otro' },
];

// Opciones de valoración
 const ratingOptions = [
    { value: '', label: 'Cualquier Valoración' },
    { value: '5', label: '⭐⭐⭐⭐⭐ (5)' },
    { value: '4', label: '⭐⭐⭐⭐+ (4+)' },
    { value: '3', label: '⭐⭐⭐+ (3+)' },
    { value: '2', label: '⭐⭐+ (2+)' },
    { value: '1', label: '⭐+ (1+)' },
];


function ReportFiltersPanel({ onFilterChange }) {
  // Estados locales para cada filtro
  const [playerName, setPlayerName] = useState('');
  const [reportType, setReportType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minRating, setMinRating] = useState('');

  const handleApplyFilters = () => {
    const filters = {
      player_name: playerName, // El backend podría esperar este nombre
      report_type: reportType,
      start_date: startDate || null,
      end_date: endDate || null,
      min_rating: minRating || null,
    };
    // Eliminar filtros vacíos o nulos
    Object.keys(filters).forEach(key => (filters[key] === '' || filters[key] === null) && delete filters[key]);
    console.log('Aplicando filtros de informes:', filters);
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setPlayerName('');
    setReportType('');
    setStartDate('');
    setEndDate('');
    setMinRating('');
    console.log('Reseteando filtros de informes');
    onFilterChange({});
  };

  return (
    <div className="filter-section card reports-filter"> {/* Clase específica */}
      <div className="filter-grid reports-filter-grid">
        <div className="filter-group">
          <label htmlFor="playerNameSearch" className="filter-label">Buscar por Jugador</label>
          <input
            type="text"
            id="playerNameSearch"
            className="filter-input"
            placeholder="Nombre del jugador..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="reportTypeSelect" className="filter-label">Tipo de Informe</label>
          <select
            id="reportTypeSelect"
            className="filter-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            {reportTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

         <div className="filter-group">
          <label className="filter-label">Fecha del Informe</label>
          <div className="filter-range">
              <input
                  type="date" // Usar input de tipo date
                  className="filter-range-input"
                  title="Fecha Desde"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="filter-range-separator">a</span>
               <input
                  type="date" // Usar input de tipo date
                  className="filter-range-input"
                  title="Fecha Hasta"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
              />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="minRatingSelect" className="filter-label">Valoración Mínima</label>
          <select
            id="minRatingSelect"
            className="filter-select"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
          >
            {ratingOptions.map(opt => (
                 <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
         {/* Podrías añadir filtro por Autor si lo necesitas */}
      </div>

      <div className="filter-actions">
        <button type="button" className="filter-button reset" onClick={handleResetFilters}>
            <FontAwesomeIcon icon={faUndo} /> Restablecer
        </button>
        <button type="button" className="filter-button apply" onClick={handleApplyFilters}>
            <FontAwesomeIcon icon={faFilter} /> Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

ReportFiltersPanel.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
};

export default ReportFiltersPanel;