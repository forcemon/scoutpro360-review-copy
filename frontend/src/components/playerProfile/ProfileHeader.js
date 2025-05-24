// src/components/playerProfile/ProfileHeader.js
import React from 'react';
import PropTypes from 'prop-types';
// Asegúrate que la ruta al CSS sea correcta y que defina estilos para .player-tags, .player-tag
import './ProfileHeader.css';

// Placeholder para imagen si no viene URL
const defaultImageUrl = `https://via.placeholder.com/100/313742/FFFFFF/?text=??`;

function ProfileHeader({ playerData }) {
    if (!playerData) return null; // No renderizar si no hay datos

    // --- ACCESO A DATOS ACTUALIZADO ---
    const name = playerData.name || 'Nombre Desconocido';
    // Muestra hasta 2 posiciones legibles
    const position1 = playerData.position1_display || '';
    const position2 = playerData.position2_display || '';
    const displayPositions = [position1, position2].filter(Boolean).join(' / ');

    const club = playerData.team?.name || 'Club Desconocido';
    const nationality = playerData.nationality || 'N/A';
    const age = playerData.calculated_age ? `${playerData.calculated_age} años` : 'Edad N/A';
    const preferredFootDisplay = {
        'Right': 'Derecho', 'Left': 'Izquierdo', 'Both': 'Ambidiestro'
    }[playerData.preferred_foot] || 'N/A';
    const height = playerData.height ? `${playerData.height} cm` : 'Altura N/A';
    const weight = playerData.weight ? `${playerData.weight} kg` : 'Peso N/A';
    const marketValue = playerData.market_value !== null && playerData.market_value !== undefined
        ? `${parseFloat(playerData.market_value).toLocaleString()} ${playerData.market_value_currency || ''}`.trim()
        : 'N/A';
    const contractEnd = playerData.contract_until
        ? `Contrato hasta: ${new Date(playerData.contract_until).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}`
        : 'Contrato N/A';
    const imageUrl = playerData.image_url || defaultImageUrl.replace('??', name.substring(0,2).toUpperCase());

    // --- Procesar Fortalezas/Debilidades como Tags ---
    // Asume que strengths/weaknesses son strings, separadas por coma o newline.
    // Mostraremos las fortalezas como ejemplo, limita el número si es necesario.
    const strengthsTags = playerData.strengths
        ? playerData.strengths.split(/,|\n/).map(s => s.trim()).filter(Boolean).slice(0, 5) // Limita a 5 tags
        : [];
    // Podrías hacer lo mismo para weaknesses si quieres mostrarlas también o en lugar de strengths
    // const weaknessesTags = playerData.weaknesses ? playerData.weaknesses.split(/,|\n/).map(w => w.trim()).filter(Boolean).slice(0, 5) : [];
    const displayTags = strengthsTags;
    // --- Fin Procesar Tags ---

    return (
        // Usa las clases CSS definidas en ProfileHeader.css
        <div className="profile-header">
            <img
                src={imageUrl}
                alt={name}
                className="player-photo"
                onError={(e) => { e.target.onerror = null; e.target.src = defaultImageUrl.replace('??', name.substring(0,2).toUpperCase()); }}
            />
            <div className="player-info">
                <h1>{name}</h1>
                {/* Muestra hasta 2 posiciones */}
                <div className="position">{displayPositions}</div>
                 {/* Labels en Español */}
                <p>{club} | Nacionalidad: {nationality} | Edad: {age}</p>
                <p>Pie Preferido: {preferredFootDisplay} | Altura: {height} | Peso: {weight}</p>

                {/* --- Sección de Tags/Habilidades Añadida --- */}
                {displayTags.length > 0 && (
                    <div className="player-tags"> {/* Usa esta clase para estilizar el contenedor */}
                        {displayTags.map((tag, index) => (
                            // Usa esta clase para estilizar cada tag
                            <div key={index} className="player-tag">{tag}</div>
                        ))}
                    </div>
                )}
                 {/* --- Fin Sección Tags --- */}

            </div>
            <div className="player-meta">
                 {/* Label en Español */}
                <div className="market-value-label">Valor Mercado (Est.):</div>
                <div className="market-value">{marketValue}</div>
                <div className="contract-info">{contractEnd}</div>
            </div>
        </div>
    );
}

// PropTypes actualizados
ProfileHeader.propTypes = {
    playerData: PropTypes.shape({
        id: PropTypes.any,
        name: PropTypes.string,
        position1_display: PropTypes.string,
        position2_display: PropTypes.string,
        team: PropTypes.shape({ name: PropTypes.string }),
        nationality: PropTypes.string,
        calculated_age: PropTypes.number,
        preferred_foot: PropTypes.string,
        height: PropTypes.number,
        weight: PropTypes.number,
        market_value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        market_value_currency: PropTypes.string,
        contract_until: PropTypes.string,
        image_url: PropTypes.string,
        strengths: PropTypes.string, // Añadido
        weaknesses: PropTypes.string, // Añadido
    }),
};

export default ProfileHeader;
