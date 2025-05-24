// frontend/src/components/players/PlayerTableRow.js
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './PlayerTableRow.css'; // Asegúrate que este archivo CSS exista y esté correcto

// URL de imagen placeholder (puedes cambiarla si tienes una local)
const placeholderImageUrl = `https://ui-avatars.com/api/?name=??&background=313742&color=e0e0e0&bold=true&size=40`;

function PlayerTableRow({ player }) {
  const navigate = useNavigate();

  // Navega al perfil del jugador al hacer clic en la fila
  const handleRowClick = () => {
    if (player && player.id) {
        navigate(`/players/${player.id}`);
    } else {
        console.error("Intento de navegar sin ID de jugador válido:", player);
    }
  };

  // Función para obtener iniciales (mantenida del original)
  const getInitials = (name) => {
      if (name && typeof name === 'string' && name.length > 0) {
          const names = name.split(' ');
          if (names.length > 1) {
              return (names[0][0] + names[names.length - 1][0]).toUpperCase();
          }
          return name.substring(0, 2).toUpperCase();
      }
      return '??';
  };

  // --- ACCESO A DATOS ACTUALIZADO ---
  // Usa los nombres de campo del backend corregido
  const playerName = player?.name || 'Jugador Desconocido'; // Usar 'name'
  const playerInitials = getInitials(player?.name);
  const playerClub = player?.team?.name || 'N/A'; // Acceder a team.name
  const playerAge = player?.calculated_age ?? 'N/A'; // Usar 'calculated_age'
  const playerPosition = player?.position1_display || 'N/A'; // Usa el nombre legible de la API
  const playerNationality = player?.nationality || 'N/A';
  const playerImageUrl = player?.image_url || placeholderImageUrl.replace('??', playerInitials); // Usar 'image_url'

  // No renderizar nada si no hay objeto player válido
  if (!player || !player.id) {
      console.warn("Intentando renderizar PlayerTableRow sin datos de jugador válidos.");
      return null;
  }

  return (
      // Estructura de celdas adaptada a los encabezados de PlayerTable.js
      <tr className="player-table-row" onClick={handleRowClick} title={`Ver perfil de ${playerName}`}>
          <td className="player-cell-image">
              <img
                  src={playerImageUrl}
                  alt={playerName}
                  className="player-thumbnail"
                  onError={(e) => { e.target.onerror = null; e.target.src=placeholderImageUrl.replace('??', playerInitials) }}
              />
          </td>
          <td className="player-cell-name">{playerName}</td>
          <td className="player-cell-club">{playerClub}</td>
          <td className="player-cell-position">{playerPosition}</td>
          <td className="player-cell-nationality">{playerNationality}</td>
          <td className="player-cell-age">{playerAge}</td>
          {/* Se eliminó la celda de Rating */}
      </tr>
  );
}

// PropTypes actualizados para reflejar el modelo del backend
PlayerTableRow.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image_url: PropTypes.string,
    name: PropTypes.string,
    calculated_age: PropTypes.number,
    position1_display: PropTypes.string, // Nombre legible de la API
    team: PropTypes.shape({ name: PropTypes.string }),
    nationality: PropTypes.string,
  }),
};

export default PlayerTableRow;
