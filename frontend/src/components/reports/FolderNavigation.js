import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faPlus, faStar } from '@fortawesome/free-solid-svg-icons'; // Importar iconos
import './FolderNavigation.css'; // Crear este CSS

function FolderNavigation({ folders = [], activeFolder, onFolderSelect, onNewFolder }) {

  // Iconos por defecto o basados en nombre (ejemplo simple)
  const getFolderIcon = (folderName) => {
      if (folderName.toLowerCase().includes('favoritos')) return faStar;
      return faFolder;
  }

  return (
    <div className="folders-section"> {/* Contenedor como en el mockup */}
      <div className="folders-title">
        <FontAwesomeIcon icon={faFolder} /> {/* Icono general */}
        <span>Categorías / Carpetas</span>
      </div>
      <div className="folders-list">
        {/* Mapear las carpetas pasadas como props */}
        {folders.map((folder) => (
          <button
            key={folder.id || folder.name} // Usar ID si existe, sino nombre
            className={`folder-item ${activeFolder === (folder.id || folder.name) ? 'active' : ''}`}
            onClick={() => onFolderSelect(folder.id || folder.name)}
            type="button"
          >
            <FontAwesomeIcon icon={getFolderIcon(folder.name)} className="folder-icon"/>
            <span>{folder.name}</span>
            {/* Podrías añadir un contador de informes aquí si lo tuvieras: folder.count */}
          </button>
        ))}
        {/* Botón para crear nueva carpeta */}
        <button className="folder-item new-folder" onClick={onNewFolder} type="button">
          <FontAwesomeIcon icon={faPlus} />
          <span>Nueva Carpeta</span>
        </button>
      </div>
    </div>
  );
}

FolderNavigation.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // ID opcional
      name: PropTypes.string.isRequired,
      // count: PropTypes.number // Opcional: número de informes
  })),
  activeFolder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onFolderSelect: PropTypes.func.isRequired,
  onNewFolder: PropTypes.func, // Función para manejar clic en "Nueva Carpeta"
};

export default FolderNavigation;