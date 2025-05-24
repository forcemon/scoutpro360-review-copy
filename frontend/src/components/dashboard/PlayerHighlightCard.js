import React from 'react';
import PropTypes from 'prop-types';
import './PlayerHighlightCard.css'; // Importar CSS

// Recibe los datos del jugador como props
function PlayerHighlightCard({ id, name, position, age, team, imageUrl, rating, onClick }) {

  const handleCardClick = () => {
      // Si se proporciona una función onClick (para navegar al perfil, por ejemplo)
      if (onClick && id) {
          onClick(id);
      }
      // O podrías usar <Link> de react-router-dom si siempre navega
      // import { Link } from 'react-router-dom';
      // return <Link to={`/players/${id}`} className="player-highlight-card">...</Link>
  };

  return (
    <div className="player-highlight-card" onClick={handleCardClick} title={`Ver perfil de ${name}`}>
      <div className="player-highlight-image">
        <img src={imageUrl || `https://via.placeholder.com/300/333333/FFFFFF/?text=${name.substring(0,1)}`} alt={name} />
         {/* Mostrar valoración si existe */}
         {rating && <div className="player-highlight-rating">{rating.toFixed(1)}</div>}
      </div>
      <div className="player-highlight-info">
        <div className="player-highlight-name">{name}</div>
        <div className="player-highlight-position">{position}</div>
        <div className="player-highlight-details">
          <span>{age} años</span>
          <span>{team}</span>
        </div>
      </div>
    </div>
  );
}

PlayerHighlightCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ID para navegación
  name: PropTypes.string.isRequired,
  position: PropTypes.string,
  age: PropTypes.number,
  team: PropTypes.string,
  imageUrl: PropTypes.string,
  rating: PropTypes.number,
  onClick: PropTypes.func, // Función opcional para manejar el clic
};

export default PlayerHighlightCard;