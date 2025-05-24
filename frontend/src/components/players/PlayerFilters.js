import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PlayerFilters.css'; // Asegúrate que este archivo exista

function PlayerFilters({ onFilterChange }) {
  // Estados locales para cada filtro
  const [nameSearch, setNameSearch] = useState('');
  const [position, setPosition] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [nationality, setNationality] = useState('');
  // Añadir más estados para otros filtros (liga, valor, etc.) si los necesitas

  const handleApplyFilters = () => {
    const filters = {
      name: nameSearch,
      position: position,
      minAge: minAge || null,
      maxAge: maxAge || null,
      nationality: nationality,
      // Añadir otros filtros aquí
    };
    // Eliminar filtros vacíos o nulos antes de enviar
    Object.keys(filters).forEach(key => (filters[key] === '' || filters[key] === null) && delete filters[key]);
    console.log('Aplicando filtros:', filters); // Log para depuración
    onFilterChange(filters); // Llama a la función del padre
  };

  const handleResetFilters = () => {
    setNameSearch('');
    setPosition('');
    setMinAge('');
    setMaxAge('');
    setNationality('');
    // Resetear otros estados
    console.log('Reseteando filtros');
    onFilterChange({}); // Enviar objeto vacío para quitar filtros
  };

  return (
    // Usamos la clase card para el estilo base del contenedor de filtros
    <div className="filter-section card">
      <div className="filter-grid"> {/* Grid para organizar los filtros */}

        <div className="filter-group">
          <label htmlFor="nameSearch" className="filter-label">Nombre Jugador</label>
          <input
            type="text"
            id="nameSearch"
            className="filter-input"
            placeholder="Ej: Javier Martínez"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="position" className="filter-label">Posición</label>
          <select
            id="position"
            className="filter-select"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            <option value="">Cualquiera</option>
            <option value="POR">Portero (POR)</option>
            <option value="DFC">Defensa Central (DFC)</option>
            <option value="LD">Lateral Derecho (LD)</option>
            <option value="LI">Lateral Izquierdo (LI)</option>
            <option value="MCD">Mediocentro Defensivo (MCD)</option>
            <option value="MC">Mediocentro (MC)</option>
            <option value="MCO">Mediocentro Ofensivo (MCO)</option>
            <option value="ED">Extremo Derecho (ED)</option>
            <option value="EI">Extremo Izquierdo (EI)</option>
            <option value="SD">Segundo Delantero (SD)</option>
            <option value="DC">Delantero Centro (DC)</option>
          </select>
        </div>

         <div className="filter-group">
          <label className="filter-label">Rango de Edad</label>
          <div className="filter-range">
              <input
                  type="number"
                  className="filter-range-input"
                  placeholder="Min"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  min="14" max="50"
              />
              <span className="filter-range-separator">a</span>
               <input
                  type="number"
                  className="filter-range-input"
                  placeholder="Max"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  min="14" max="50"
              />
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="nationality" className="filter-label">Nacionalidad</label>
          <input
            type="text"
            id="nationality"
            className="filter-input"
            placeholder="Ej: España, Argentina"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
          />
        </div>

        {/* Aquí podrías añadir más filtros: Liga, Valor Mercado, etc. */}

      </div>

      {/* Botones de acción para los filtros */}
      <div className="filter-actions">
        <button type="button" className="filter-button reset" onClick={handleResetFilters}>
            <i className="fas fa-undo"></i> Restablecer
        </button>
        <button type="button" className="filter-button apply" onClick={handleApplyFilters}>
            <i className="fas fa-filter"></i> Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

PlayerFilters.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
};

export default PlayerFilters;