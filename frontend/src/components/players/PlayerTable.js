// frontend/src/components/players/PlayerTable.js
import React from 'react';
import PlayerTableRow from './PlayerTableRow';
import './PlayerTable.css';

/**
 * Componente para renderizar la tabla de jugadores.
 * Encabezados actualizados y en español.
 * @param {object} props - Propiedades del componente.
 * @param {Array} props.players - Array de objetos de jugadores a mostrar.
 * @param {boolean} props.loading - Indicador de si los datos están cargando.
 * @param {string|null} props.error - Mensaje de error si lo hubo.
 */
function PlayerTable({ players, loading, error }) {
  if (loading) {
    return <div className="loading-message">Cargando jugadores...</div>;
  }

  if (error) {
    return <div className="error-message">Error al cargar jugadores: {error}</div>;
  }

  if (!players || players.length === 0) {
    return <div className="no-data-message">No se encontraron jugadores.</div>;
  }

  return (
    <div className="player-table-container">
      <table className="player-table">
        <thead>
          <tr>
            {/* Encabezados en Español */}
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Equipo</th>
            <th>Posición Principal</th>
            <th>Nacionalidad</th>
            <th>Edad</th>
            {/* Se eliminó Rating ya que no está en el modelo actual */}
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <PlayerTableRow key={player.id} player={player} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerTable;
