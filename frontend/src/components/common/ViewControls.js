import React from 'react';
import PropTypes from 'prop-types';
import './ViewControls.css'; // Crear este archivo CSS

function ViewControls({
  // Props para ordenación
  sortBy,
  onSortChange,
  sortOptions = [], // Array de { value: 'valor', label: 'Texto Desplegable' }
  // Props opcionales para cambio de vista (Grid/List) - se pueden añadir después
  // viewMode,
  // onViewChange,
  // Prop opcional para mostrar info (ej: "Mostrando X de Y")
  resultCountText
}) {

  return (
    <div className="view-controls-container">
      {/* Información de resultados (si se proporciona) */}
      {resultCountText && (
        <div className="view-info">{resultCountText}</div>
      )}

      <div className="view-options">
         {/* Botones de cambio de vista (comentados por ahora) */}
         {/*
         <button
           className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
           onClick={() => onViewChange('grid')}
           title="Vista Cuadrícula"
         >
           <i className="fas fa-th-large"></i>
           <span>Cuadrícula</span>
         </button>
         <button
           className={`view-option ${viewMode === 'table' ? 'active' : ''}`}
           onClick={() => onViewChange('table')}
           title="Vista Lista"
         >
           <i className="fas fa-list"></i>
           <span>Lista</span>
         </button>
         */}

         {/* Dropdown de Ordenación */}
         <div className="sort-control">
             <label htmlFor="sort-select" className="sort-label">Ordenar por:</label>
             <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
             >
                 {sortOptions.map(option => (
                     <option key={option.value} value={option.value}>
                         {option.label}
                     </option>
                 ))}
             </select>
         </div>
      </div>
    </div>
  );
}

ViewControls.propTypes = {
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  sortOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  // viewMode: PropTypes.oneOf(['grid', 'table']),
  // onViewChange: PropTypes.func,
  resultCountText: PropTypes.string,
};

export default ViewControls;