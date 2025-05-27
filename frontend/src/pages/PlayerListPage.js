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

  const loadPlayers = useCallback(async () => {
    // Puedes mantener el console.log original o ajustarlo si prefieres
    console.log('[PlayerListPage] Iniciando loadPlayers. Estado actual (antes de fetch):', {
      // Muestra el estado actual *antes* de que esta ejecución de loadPlayers lo modifique
      // Es útil para depurar, pero no causa el bucle si 'loading' y 'error' no están en las deps de useCallback
      isLoading: loading, // Renombrado para claridad en el log
      currentError: error, // Renombrado para claridad en el log
      currentPage, filters, sortConfig
    });
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        page_size: PAGE_SIZE,
        ordering: `${sortConfig.direction === 'descending' ? '-' : ''}${sortConfig.key}`,
        ...filters,
      };
      Object.keys(params).forEach(key => (params[key] === undefined || params[key] === null || params[key] === '') && delete params[key]);

      console.log('[PlayerListPage] Llamando a playerService.fetchPlayers con params:', params);
      const data = await playerService.fetchPlayers(params);
      console.log('[PlayerListPage] Datos recibidos de fetchPlayers:', data);

      if (data && typeof data.count === 'number' && Array.isArray(data.results)) {
        setPlayers(data.results);
        setTotalPages(Math.ceil(data.count / PAGE_SIZE));
        console.log('[PlayerListPage] Estado actualizado (players, totalPages):', { players: data.results, totalPages: Math.ceil(data.count / PAGE_SIZE) });
      } else {
        console.error('[PlayerListPage] Error: La respuesta de la API no tiene la estructura de paginación esperada (count, results). Respuesta:', data);
        setError('Error: Respuesta inesperada del servidor.');
        setPlayers([]);
        setTotalPages(0);
      }

    } catch (err) {
      console.error('[PlayerListPage] Error en catch al llamar a fetchPlayers:', err);
      const errorMessage = err.response?.data?.detail || 'Error al cargar los jugadores. Intenta de nuevo más tarde.';
      setError(errorMessage);
      setPlayers([]);
      setTotalPages(0);
    } finally {
      console.log('[PlayerListPage] Ejecutando finally. Estableciendo loading = false.');
      setLoading(false);
    }
  // MODIFICACIÓN CLAVE: Eliminar 'loading' y 'error' del array de dependencias.
  // La función loadPlayers debe volver a calcularse solo si cambian los parámetros de la petición.
  }, [currentPage, filters, sortConfig]);

  useEffect(() => {
    console.log('[PlayerListPage] useEffect ejecutado. Llamando a loadPlayers.');
    loadPlayers();
  }, [loadPlayers]); // Esta dependencia está bien, ya que loadPlayers está memoizada por useCallback.

  const handlePageChange = (page) => {
    console.log('[PlayerListPage] handlePageChange llamado con page:', page);
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    console.log('[PlayerListPage] handleFilterChange llamado con newFilters:', newFilters);
    setCurrentPage(1);
    setFilters(newFilters);
  };

   const handleSortChange = (key) => {
    console.log('[PlayerListPage] handleSortChange llamado con key:', key);
    setCurrentPage(1);
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  console.log('[PlayerListPage] Renderizando JSX. Estado:', { loading, error, players, currentPage, totalPages });

  const renderContent = () => {
    if (loading) {
      console.log('[PlayerListPage] Renderizando: Estado Cargando...');
      return <div className="loading-message">Cargando jugadores...</div>;
    }
    if (error) {
      console.log('[PlayerListPage] Renderizando: Estado de Error.');
      return <div className="error-message">{error}</div>;
    }
    if (players.length === 0) {
      console.log('[PlayerListPage] Renderizando: No hay jugadores.');
      return <div className="no-players-message">No se encontraron jugadores con los filtros actuales.</div>;
    }
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
      <PlayerFilters onFilterChange={handleFilterChange} />
      <div className="player-list-content">
        {renderContent()}
      </div>
      {!loading && !error && totalPages > 1 && (
        (console.log('[PlayerListPage] Renderizando: Paginación.'),
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />)
      )}
    </div>
  );
};

export default PlayerListPage;
