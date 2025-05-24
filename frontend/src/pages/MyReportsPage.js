import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importar Componentes
import FolderNavigation from '../components/reports/FolderNavigation';
import ReportFiltersPanel from '../components/reports/ReportFiltersPanel';
import ViewControls from '../components/common/ViewControls';
import Pagination from '../components/common/Pagination';
import ReportGrid from '../components/reports/ReportGrid';   // Para vista Grid
import ReportList from '../components/reports/ReportList';   // Para vista Lista
// import { fetchMyReports } from '../services/reportService'; // Futuro
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';

import './MyReportsPage.css';

const REPORTS_PER_PAGE = 12;

function MyReportsPage() {
  // --- MODIFICACIÓN: 'navigate' ahora se usará en handleReportClick ---
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFolder, setActiveFolder] = useState('Todos');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('-creation_date');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // Estado para controlar la vista

  const exampleFolders = [ /* ... datos carpetas ... */
      { id: 'Todos', name: 'Todos' }, { id: 'Creados', name: 'Creados por mí' },
      { id: 'Compartidos', name: 'Compartidos conmigo' }, { id: 'Favoritos', name: 'Favoritos' },
      { id: 'JovenesPromesas', name: 'Talento Joven' }, { id: 'ListaSeguimiento', name: 'Lista Seguimiento' },
  ];
  const reportSortOptions = [ /* ... opciones de ordenación ... */
      { value: '-creation_date', label: 'Más Recientes'}, { value: 'creation_date', label: 'Más Antiguos'},
      { value: '-rating', label: 'Mayor Valoración' }, { value: 'rating', label: 'Menor Valoración' },
      { value: 'title', label: 'Título (A-Z)'}, { value: '-title', label: 'Título (Z-A)'},
      { value: 'player__full_name', label: 'Jugador (A-Z)'}, { value: '-player__full_name', label: 'Jugador (Z-A)'},
  ];

  useEffect(() => {
    // ... (Lógica loadReports como antes, usando REPORTS_PER_PAGE) ...
    const loadReports = async () => {
        setIsLoading(true); setError(null);
        const apiParams = { folder: activeFolder === 'Todos' ? undefined : activeFolder, page: currentPage, ordering: sortBy, limit: REPORTS_PER_PAGE, ...filters, search: filters.player_name || undefined, report_type: filters.report_type || undefined, date_after: filters.start_date || undefined, date_before: filters.end_date || undefined, min_rating: filters.min_rating || undefined };
        Object.keys(apiParams).forEach(key => (apiParams[key] === undefined || apiParams[key] === '') && delete apiParams[key]);
        if (apiParams.search) delete apiParams.player_name;
        if(apiParams.min_rating) { apiParams.rating__gte = apiParams.min_rating; delete apiParams.min_rating; }
        console.log("Cargando informes con (simulado):", apiParams);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const allMockReports = [ /* ... Array completo informes ejemplo ... */
                { id: 'rep-1', player: { id: 102, full_name: 'Mateo González', image_url:`https://ui-avatars.com/api/?name=MG&b=252a34&c=fff&bold=true&size=50`}, title: 'Análisis Partido vs Boca Juniors', author: { username: 'agonzalez' }, creation_date: '2025-04-10T10:00:00Z', report_type: 'Partido', rating: '4.8', tags: ['Completo', 'Decisivo'] },
                { id: 'rep-2', player: { id: 104, full_name: 'Antoine Dubois', image_url:`https://ui-avatars.com/api/?name=AD&b=252a34&c=fff&bold=true&size=50`}, title: 'Evaluación Técnica Extremo', author: { username: 'csanchez' }, creation_date: '2025-04-08T15:30:00Z', report_type: 'Técnico', rating: '4.6', tags: ['Regate', 'Velocidad'] },
                { id: 'rep-3', player: { id: 106, full_name: 'Samuel Adebayo', image_url:`https://ui-avatars.com/api/?name=SA&b=252a34&c=fff&bold=true&size=50`}, title: 'Proyección y Potencial (Defensa)', author: { username: 'mlopez' }, creation_date: '2025-04-05T09:15:00Z', report_type: 'Potencial', rating: '4.4', tags: ['Físico', 'Mentalidad'] },
                { id: 'rep-4', player: { id: 101, full_name: 'Carlos Rodríguez', image_url:`https://ui-avatars.com/api/?name=CR&b=252a34&c=fff&bold=true&size=50`}, title: 'Seguimiento Físico Q1', author: { username: 'prodriguez' }, creation_date: '2025-03-28T11:00:00Z', report_type: 'Físico', rating: '4.0', tags: ['Resistencia', 'Test'] },
                { id: 'rep-5', player: { id: 111, full_name: 'David Silva Jr', image_url:`https://ui-avatars.com/api/?name=DS&b=252a34&c=fff&bold=true&size=50`}, title: 'Informe Partido Valencia Mestalla', author: { username: 'agonzalez' }, creation_date: '2025-03-22T18:00:00Z', report_type: 'Partido', rating: '4.1', tags: ['Visión', 'Pase'] },
            ];
            const filteredData = allMockReports.filter(r => { /* ... lógica filtro simulado ... */
                let pass = true; if (apiParams.report_type && r.report_type !== apiParams.report_type) pass = false; if (apiParams.search && r.player && !r.player.full_name.toLowerCase().includes(apiParams.search.toLowerCase())) pass = false; if (apiParams.rating__gte && (!r.rating || parseFloat(r.rating) < parseFloat(apiParams.rating__gte))) pass = false; return pass;
            });
            filteredData.sort((a,b) => { /* ... lógica ordenación simulado ... */
                if (sortBy === '-creation_date') return new Date(b.creation_date) - new Date(a.creation_date); if (sortBy === 'creation_date') return new Date(a.creation_date) - new Date(b.creation_date); if (sortBy === '-rating') return (b.rating || 0) - (a.rating || 0); if (sortBy === 'rating') return (a.rating || 0) - (b.rating || 0); if (sortBy === 'title') return a.title.localeCompare(b.title); if (sortBy === '-title') return b.title.localeCompare(a.title); if (sortBy === 'player__full_name') return (a.player?.full_name || '').localeCompare(b.player?.full_name || ''); if (sortBy === '-player__full_name') return (b.player?.full_name || '').localeCompare(a.player?.full_name || ''); return 0;
            });
            const totalFilteredReports = filteredData.length;
            const calculatedTotalPages = Math.ceil(totalFilteredReports / REPORTS_PER_PAGE);
            const paginatedData = filteredData.slice((currentPage - 1) * REPORTS_PER_PAGE, currentPage * REPORTS_PER_PAGE);
            setReports(paginatedData); setTotalReports(totalFilteredReports); setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        } catch (err) { /* ... manejo error ... */ }
        finally { setIsLoading(false); }
    };
    loadReports();
  }, [activeFolder, filters, sortBy, currentPage]);

  // --- Handlers ---
  const handleFolderSelect = (folderIdOrName) => { setActiveFolder(folderIdOrName); setCurrentPage(1); setFilters({}); };
  const handleNewFolder = () => { console.log("Abrir modal Nueva Carpeta"); };
  const handleFilterChange = (newFilters) => { setFilters(newFilters); setCurrentPage(1); };
  const handleSortChange = (newSortBy) => { setSortBy(newSortBy); setCurrentPage(1); };
  const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) { setCurrentPage(newPage); } };
  const handleViewChange = (newView) => { setViewMode(newView); }; // Se usa para cambiar estado

  // --- MODIFICACIÓN: 'handleReportClick' ahora se usará y usará 'navigate' ---
  const handleReportClick = (reportId) => {
      console.log(`Navegar al informe ID: ${reportId}`);
      // --- MODIFICACIÓN: Descomentado para usar navigate ---
      navigate(`/reports/${reportId}`);
  };

  // --- MODIFICACIÓN: Corregir texto de conteo y usar variables ---
  const getResultCountText = () => {
       if (isLoading) return 'Cargando...';
       if (error) return '';
       const startItem = totalReports === 0 ? 0 : (currentPage - 1) * REPORTS_PER_PAGE + 1;
       const endItem = Math.min(currentPage * REPORTS_PER_PAGE, totalReports);
       // CORREGIDO: Usar variables y quitar escapes innecesarios
       return `Mostrando ${startItem}-${endItem} de ${totalReports} informes`;
  };

  return (
    <div className="my-reports-page">
      <div className="page-header">
          <div className="header-title"><h1>Mis Informes</h1><p>Gestiona y organiza tus informes...</p></div>
          <div className="header-actions"><button className="header-button primary"><FontAwesomeIcon icon={faPlus} /> Nuevo Informe</button></div>
      </div>

      <FolderNavigation folders={exampleFolders} activeFolder={activeFolder} onFolderSelect={handleFolderSelect} onNewFolder={handleNewFolder} />
      <ReportFiltersPanel onFilterChange={handleFilterChange} />

      {/* Pasar viewMode y onViewChange a ViewControls */}
      <ViewControls
          resultCountText={getResultCountText()}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          sortOptions={reportSortOptions}
          viewMode={viewMode}
          onViewChange={handleViewChange}
      />

      <div className="reports-content-area">
        {isLoading && <div className="loading-indicator card"><FontAwesomeIcon icon={faSpinner} spin /> Cargando...</div>}
        {error && <div className="error-message card">{error}</div>}
        {!isLoading && !error && reports.length === 0 && <div className="no-results card">No hay informes...</div>}

        {/* Renderizado condicional Grid/Lista */}
        {!isLoading && !error && reports.length > 0 && (
           viewMode === 'grid' ? (
               // --- MODIFICACIÓN: Pasar onReportClick ---
               <ReportGrid reports={reports} onReportClick={handleReportClick} />
           ) : (
                // --- MODIFICACIÓN: Pasar onReportClick ---
               <ReportList reports={reports} onReportClick={handleReportClick} />
           )
        )}
      </div>

      {/* Paginación */}
      {!isLoading && !error && totalPages > 1 && (
         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
}

export default MyReportsPage;