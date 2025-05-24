import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importar para iconos
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'; // Importar iconos
import './Pagination.css'; // Asegúrate que este CSS exista

function Pagination({ currentPage, totalPages, onPageChange }) {

  // --- Lógica para generar los números de página a mostrar ---
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Máximo de números directos (ej: 1 ... 4 5 6 ... 10)
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) { // Si caben casi todos, mostrarlos
      for (let i = 1; i <= totalPages; i++) { pageNumbers.push(i); }
    } else {
      pageNumbers.push(1); // Siempre mostrar página 1
      let startPage = Math.max(2, currentPage - halfPagesToShow);
      let endPage = Math.min(totalPages - 1, currentPage + halfPagesToShow);
      if (currentPage - halfPagesToShow <= 2) { endPage = Math.min(totalPages - 1, maxPagesToShow); }
      if (currentPage + halfPagesToShow >= totalPages - 1) { startPage = Math.max(2, totalPages - maxPagesToShow); }
      if (startPage > 2) { pageNumbers.push('...'); } // Puntos suspensivos iniciales
      for (let i = startPage; i <= endPage; i++) { pageNumbers.push(i); } // Rango central
      if (endPage < totalPages - 1) { pageNumbers.push('...'); } // Puntos suspensivos finales
      pageNumbers.push(totalPages); // Siempre mostrar última página
    }
    return pageNumbers;
  };
  // --- Fin de la lógica ---

  const pages = getPageNumbers();

  // No mostrar nada si solo hay 1 página o menos
  if (totalPages <= 1) { return null; }

  return (
    <nav className="pagination-container" aria-label="Paginación">
      {/* Botón Anterior */}
      <button
        type="button" // Añadir type="button"
        className={`pagination-item arrow ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        <FontAwesomeIcon icon={faChevronLeft} /> {/* Usar componente de icono */}
      </button>

      {/* Números de Página */}
      {pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="pagination-item ellipsis">...</span>
        ) : (
          <button
            type="button" // Añadir type="button"
            key={page}
            className={`pagination-item number ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            // Deshabilitar botón de página actual para claridad
            disabled={page === currentPage}
          >
            {page}
          </button>
        )
      ))}

      {/* Botón Siguiente */}
      <button
        type="button" // Añadir type="button"
        className={`pagination-item arrow ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        <FontAwesomeIcon icon={faChevronRight} /> {/* Usar componente de icono */}
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;