// frontend/src/pages/PlayerEditPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPlayerDetail, updatePlayer } from '../services/playerService'; // Import updatePlayer

const PlayerEditPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const [playerData, setPlayerData] = useState(null);
  const [formData, setFormData] = useState({
    name: '', // Assuming 'name' is the field for player's name
    salto_horizontal_m: '',
    velocidad_max_kmh: '',
    yoyo_ir1_level: '',
    compostura: 0,
    concentracion: 0,
    goles_365: 0,
    partidos_jugados_365: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false); // For submit button state

  useEffect(() => {
    const loadPlayerData = async () => {
      if (!playerId) {
        setError("ID de jugador inválido.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlayerDetail(playerId);
        setPlayerData(data);
        // Initialize formData with existing player attributes
        setFormData({
          name: data.name || '',
          salto_horizontal_m: data.salto_horizontal_m || '',
          velocidad_max_kmh: data.velocidad_max_kmh || '',
          yoyo_ir1_level: data.yoyo_ir1_level || '',
          compostura: data.compostura || 0,
          concentracion: data.concentracion || 0,
          goles_365: data.goles_365 || 0,
          partidos_jugados_365: data.partidos_jugados_365 || 0,
        });
      } catch (err) {
        console.error('[PlayerEditPage] Error fetching player data:', err);
        setError('No se pudieron cargar los datos del jugador para editar.');
      } finally {
        setLoading(false);
      }
    };
    loadPlayerData();
  }, [playerId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted for update:", formData);
    setSaving(true);
    setError(null);
    try {
      await updatePlayer(playerId, formData); // Call updatePlayer service
      console.log('[PlayerEditPage] Player data updated successfully.');
      navigate(`/players/${playerId}`); // Navigate back to profile page on success
    } catch (err) {
      console.error('[PlayerEditPage] Error updating player data:', err.response ? err.response.data : err.message);
      let detailedError = 'Error al guardar los cambios. Intente nuevamente.';
      if (err.response && err.response.data) {
        // Attempt to create a more detailed error message from backend response
        const errors = err.response.data;
        const messages = Object.keys(errors)
          .map(key => `${key}: ${errors[key].join ? errors[key].join(', ') : errors[key]}`)
          .join('; ');
        if (messages) detailedError += ` Detalles: ${messages}`;
      }
      setError(detailedError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Cargando datos del jugador para editar...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!playerData) {
    return <div className="error-message">No se encontraron datos para este jugador.</div>;
  }

  return (
    <div className="player-edit-page" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Editar Jugador: {playerData.name}</h1>
      <form onSubmit={handleSubmit}>
        {/* General Field */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Nombre del Jugador:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <h2>Atributos Físicos</h2>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="salto_horizontal_m" style={{ display: 'block', marginBottom: '5px' }}>Salto Horizontal (m):</label>
          <input
            type="text" // Use text for decimal to allow typing '.', parse as float on submit/change
            id="salto_horizontal_m"
            name="salto_horizontal_m"
            value={formData.salto_horizontal_m}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="velocidad_max_kmh" style={{ display: 'block', marginBottom: '5px' }}>Velocidad Máxima (km/h):</label>
          <input
            type="text" // Use text for decimal
            id="velocidad_max_kmh"
            name="velocidad_max_kmh"
            value={formData.velocidad_max_kmh}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="yoyo_ir1_level" style={{ display: 'block', marginBottom: '5px' }}>Yo-Yo IR1 Nivel:</label>
          <input
            type="text"
            id="yoyo_ir1_level"
            name="yoyo_ir1_level"
            value={formData.yoyo_ir1_level}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <h2>Atributos Mentales</h2>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="compostura" style={{ display: 'block', marginBottom: '5px' }}>Compostura (0-100):</label>
          <input
            type="number"
            id="compostura"
            name="compostura"
            value={formData.compostura}
            onChange={handleChange}
            min="0" max="100"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="concentracion" style={{ display: 'block', marginBottom: '5px' }}>Concentración (0-100):</label>
          <input
            type="number"
            id="concentracion"
            name="concentracion"
            value={formData.concentracion}
            onChange={handleChange}
            min="0" max="100"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <h2>Estadísticas Clave (Últimos 365 días)</h2>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="goles_365" style={{ display: 'block', marginBottom: '5px' }}>Goles (365 días):</label>
          <input
            type="number"
            id="goles_365"
            name="goles_365"
            value={formData.goles_365}
            onChange={handleChange}
            min="0"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="partidos_jugados_365" style={{ display: 'block', marginBottom: '5px' }}>Partidos Jugados (365 días):</label>
          <input
            type="number"
            id="partidos_jugados_365"
            name="partidos_jugados_365"
            value={formData.partidos_jugados_365}
            onChange={handleChange}
            min="0"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: saving ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: saving ? 'not-allowed' : 'pointer' 
          }}
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
        <button 
          type="button" 
          onClick={() => navigate(`/players/${playerId}`)} 
          disabled={saving}
          style={{ 
            marginLeft: '10px', 
            padding: '10px 15px', 
            backgroundColor: saving ? '#ccc' : '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: saving ? 'not-allowed' : 'pointer' 
          }}
        >
          Cancelar
        </button>
      </form>
      {/* Display general error messages from submit */}
      {error && !loading && <div className="error-message" style={{ marginTop: '15px', color: 'red' }}>{error}</div>}
    </div>
  );
};

export default PlayerEditPage;
