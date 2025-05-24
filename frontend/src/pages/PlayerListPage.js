// frontend/src/pages/PlayerListPage.js
import React, { useState, useEffect, useCallback } from 'react';
import PlayerTable from '../components/players/PlayerTable';
import PlayerFilters from '../components/players/PlayerFilters';
import Pagination from '../components/common/Pagination';
import * as playerService from '../services/playerService';
import './PlayerListPage.css';

const PAGE_SIZE = 15;

const PlayerListPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  console.log('[PlayerListPage] Componente renderizado/actualizado.');

  // Usamos useCallback para evitar que esta función se recree en cada render
  // a menos que cambien sus dependencias reales (currentPage, filters, sortConfig).
  // eslint-disable-next-line react-hooks/exhaustive-deps // Deshabilitamos la regla aquí: sabemos que no debemos incluir loading/error para evitar bucles.
  const loadPlayers = useCallback(async () => {
    console.log('[PlayerListPage] Iniciando loadPlayers. Estado actual:', { loading, error, currentPage, filters, sortConfig });
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        page_size: PAGE_SIZE,
        ordering: `${sortConfig.direction === 'descending' ? '-' : ''}${sortConfig.key}`,
        ...filters,
      };
      // Limpia params de claves con valor undefined, null o vacío si el backend no los maneja bien
      Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null || params[key] === '') && delete params[key]);

      console.log('[PlayerListPage] Llamando a playerService.fetchPlayers con params:', params);
      const data = await playerService.fetchPlayers(params);
      console.log('[PlayerListPage] Datos recibidos de fetchPlayers:', data);

      // Verificar si la respuesta 'data' existe y tiene las propiedades 'results' y 'count'
      // Es normal que 'results' sea un array vacío si no hay coincidencias.
      if (data && typeof data.count === 'number' && Array.isArray(data.results)) {
        setPlayers(data.results); // Establece los jugadores (puede ser un array vacío)
        setTotalPages(Math.ceil(data.count / PAGE_SIZE)); // Calcula páginas basado en count
        console.log('[PlayerListPage] Estado actualizado (players, totalPages):', { players: data.results, totalPages: Math.ceil(data.count / PAGE_SIZE) });
      } else {
        // Si la estructura REALMENTE no es la esperada (falta count o results)
        console.error('[PlayerListPage] Error: La respuesta de la API no tiene la estructura de paginación esperada (count, results). Respuesta:', data);
        setError('Error: Respuesta inesperada del servidor.');
        setPlayers([]); // Limpia por seguridad
        setTotalPages(0);
      }

    } catch (err) {
      console.error('[PlayerListPage] Error en catch al llamar a fetchPlayers:', err);
      // Podríamos intentar obtener más detalles del error si el backend los envía
      const errorMessage = err.response?.data?.detail || 'Error al cargar los jugadores. Intenta de nuevo más tarde.';
      setError(errorMessage);
      setPlayers([]);
      setTotalPages(0);
    } finally {
      console.log('[PlayerListPage] Ejecutando finally. Estableciendo loading = false.');
      setLoading(false);
    }
  }, [currentPage, filters, sortConfig]); // Las dependencias correctas son estas

  // useEffect que llama a loadPlayers cuando cambian sus dependencias
  useEffect(() => {
    console.log('[PlayerListPage] useEffect ejecutado. Llamando a loadPlayers.');
    loadPlayers();
  }, [loadPlayers]); // La dependencia aquí es la función memoizada loadPlayers

  const handlePageChange = (page) => {
    console.log('[PlayerListPage] handlePageChange llamado con page:', page);
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    console.log('[PlayerListPage] handleFilterChange llamado con newFilters:', newFilters);
    setCurrentPage(1); // Resetea a la página 1 cuando cambian los filtros
    setFilters(newFilters);
  };

   const handleSortChange = (key) => {
    console.log('[PlayerListPage] handleSortChange llamado con key:', key);
    setCurrentPage(1); // Resetea a la página 1 al cambiar ordenación
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  console.log('[PlayerListPage] Renderizando JSX. Estado:', { loading, error, players, currentPage, totalPages });

  // Función para decidir qué renderizar en el área de contenido
  const renderContent = () => {
    if (loading) {
      console.log('[PlayerListPage] Renderizando: Estado Cargando...');
      // Muestra algo mientras carga
      return <div className="loading-message">Cargando jugadores...</div>;
    }
    // Muestra el error si existe
    if (error) {
      console.log('[PlayerListPage] Renderizando: Estado de Error.');
      return <div className="error-message">{error}</div>;
    }
    // Si no carga, no hay error, y no hay jugadores
    if (players.length === 0) {
      console.log('[PlayerListPage] Renderizando: No hay jugadores.');
      return <div className="no-players-message">No se encontraron jugadores con los filtros actuales.</div>;
    }
    // Si no carga, no hay error, y SÍ hay jugadores
    console.log('[PlayerListPage] Renderizando: Tabla de Jugadores.');
    return (
      <PlayerTable
        players={players}
        sortConfig={sortConfig}
        onSort={handleSortChange}
      />
    );
  };

  return (
    <div className="player-list-page">
      <h1 className="page-title">Explorar Jugadores</h1>
      {/* Componente de filtros */}
      <PlayerFilters onFilterChange={handleFilterChange} />

      {/* Área donde se muestra la tabla, el mensaje de carga, error o "no encontrado" */}
      <div className="player-list-content">
        {renderContent()}
      </div>

      {/* Paginación: se muestra solo si no está cargando, no hay error y hay más de 1 página */}
      {!loading && !error && totalPages > 1 && (
        console.log('[PlayerListPage] Renderizando: Paginación.'),
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PlayerListPage;
