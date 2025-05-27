import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importar Componentes
import FolderNavigation from '../components/reports/FolderNavigation';
import ReportFiltersPanel from '../components/reports/ReportFiltersPanel';
import ViewControls from '../components/common/ViewControls';
import Pagination from '../components/common/Pagination';
import ReportGrid from '../components/reports/ReportGrid';   // Para vista Grid
import ReportList from '../components/reports/ReportList';   // Para vista Lista
import { fetchReports } from '../services/reportService'; // Cambiado para usar fetchReports
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
        setIsLoading(true); 
        setError(null);
        
        const apiParams = {
            page: currentPage,
            limit: REPORTS_PER_PAGE,
            ordering: sortBy,
            search: filters.player_name || undefined, // player_name from filters maps to general search
            report_specialization: filters.report_type || undefined,
            report_date__gte: filters.start_date || undefined,
            report_date__lte: filters.end_date || undefined,
            overall_rating__gte: filters.min_rating || undefined,
            // folder: activeFolder === 'Todos' ? undefined : activeFolder, // Temporarily removed as per instructions
        };

        // Clean up undefined/empty params
        Object.keys(apiParams).forEach(key => (apiParams[key] === undefined || apiParams[key] === '') && delete apiParams[key]);

        console.log("Cargando informes con API:", apiParams);

        try {
            const response = await fetchReports(apiParams);
            setReports(response.data.results);
            setTotalReports(response.data.count);
            const calculatedTotalPages = Math.ceil(response.data.count / REPORTS_PER_PAGE);
            setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
        } catch (err) {
            console.error("Error al cargar informes:", err);
            setError(err.message || 'Error al cargar informes. Intente de nuevo más tarde.');
            setReports([]); // Clear reports on error
            setTotalReports(0);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    };
    loadReports();
  }, [activeFolder, filters, sortBy, currentPage]); // activeFolder might be removed if not used

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