// src/components/common/DashboardCardWrapper.js
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// Paso 1: Importar el componente FontAwesomeIcon y el icono necesario
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './DashboardCardWrapper.css'; // Asegúrate de que el CSS exista

// Paso 2: Cambiar prop 'iconClass' por 'icon'
function DashboardCardWrapper({ title, icon, actionText, actionLink, children }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          {/* Paso 3: Renderizar usando FontAwesomeIcon y la prop 'icon' */}
          {icon && <FontAwesomeIcon icon={icon} className="card-title-icon" />}
          <span>{title}</span>
        </div>
        {actionText && actionLink && (
          <Link to={actionLink} className="dashboard-card-action">
            {actionText} <FontAwesomeIcon icon={faChevronRight} />
          </Link>
        )}
      </div>
      <div className="dashboard-card-body">
        {children}
      </div>
    </div>
  );
}

DashboardCardWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  // Paso 4: Actualizar PropTypes para 'icon' como objeto
  icon: PropTypes.object, // Espera el objeto icono importado
  actionText: PropTypes.string,
  actionLink: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default DashboardCardWrapper;