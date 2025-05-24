// frontend/src/services/playerService.js
import api from './api'; // Importa la instancia configurada de Axios

/**
 * Obtiene la lista paginada de jugadores desde la API.
 * @param {object} params - Objeto con parámetros de query (page, page_size, ordering, filtros...).
 * @returns {Promise<object>} Promesa que resuelve con los datos de la respuesta de la API
 * (esperado: { count, next, previous, results }).
 */
export const fetchPlayers = async (params) => {
  console.log('[playerService] fetchPlayers llamado con params:', params);
  try {
    const response = await api.get('/players/', { params });
    console.log('[playerService] Respuesta completa de Axios (lista):', response);
    return response.data; // Devuelve solo los datos del backend
  } catch (error) {
    console.error('[playerService] Error en fetchPlayers:', error.response ? error.response.data : error.message);
    throw error;
  }
};

/**
 * Obtiene los detalles de un jugador específico desde la API.
 * @param {string|number} playerId - El ID del jugador.
 * @returns {Promise<object>} Promesa que resuelve con los datos del jugador.
 */
export const fetchPlayerDetail = async (playerId) => {
  console.log(`[playerService] fetchPlayerDetail llamado para ID: ${playerId}`);
  try {
    // --- ASEGURAR BARRA DIAGONAL FINAL ---
    const response = await api.get(`/players/${playerId}/`); // <-- Asegúrate de que la URL termina en /
    // --- FIN ASEGURAR BARRA DIAGONAL ---
    console.log('[playerService] Respuesta completa de Axios (detalle):', response);
    return response.data; // Devuelve solo los datos del backend
  } catch (error) {
    // Logueamos el error aquí también para más detalle si es necesario
    console.error(`[playerService] Error en fetchPlayerDetail para ID ${playerId}:`, error.response ? error.response.data : error.message, error); // Log completo del error
    // Relanzamos el error para que lo capture el componente
    throw error;
  }
};
