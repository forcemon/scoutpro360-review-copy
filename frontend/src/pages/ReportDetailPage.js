// src/pages/ReportDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link para volver o ir al jugador
import { fetchReportDetail } from '../services/reportService'; // Importar la nueva función
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Updated FontAwesome imports for stars
import { faStar, faStarHalfAlt, faSpinner, faArrowLeft, faUser, faCalendarAlt, faTag, faFileAlt, faUserCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import './ReportDetailPage.css'; // Crear este archivo CSS después

// Helper para formatear fecha (podría estar en utils)
const formatDate = (dateString, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString('es-ES', options); }
    catch (e) { return 'Fecha Inválida'; }
};

// NEW renderRatingStars function
const renderRatingStars = (rating) => { // rating here is the 0-100 value
    const numRating = parseFloat(rating);

    if (isNaN(numRating) || numRating < 0 || numRating > 100) {
        return <span className="rating-stars-na">N/A</span>;
    }

    // Normalize rating from 0-100 scale to 0-5 scale
    const ratingOn5Scale = (numRating / 100) * 5;

    // Round to nearest .0 or .5 for star display
    const roundedRating = Math.round(ratingOn5Scale * 2) / 2;

    const fullStars = Math.floor(roundedRating);
    const halfStar = roundedRating % 1 !== 0;
    // Ensure emptyStars is not negative
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));

    return (
      <span className="rating-stars">
        {[...Array(fullStars)].map((_, i) => <FontAwesomeIcon key={`full-${i}`} icon={faStar} />)}
        {halfStar && <FontAwesomeIcon key="half" icon={faStarHalfAlt} />}
        {[...Array(emptyStars)].map((_, i) => <FontAwesomeIcon key={`empty-${i}`} icon={faStarEmpty} />)}
      </span>
    );
};

function ReportDetailPage() {
    const { reportId } = useParams(); // Obtener ID del informe de la URL
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReportData = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log(`ReportDetailPage: Fetching data for report ID: ${reportId}`);
                const response = await fetchReportDetail(reportId);
                console.log("ReportDetailPage: Data received:", response.data);
                setReportData(response.data);
            } catch (err) {
                console.error("Error fetching report details:", err);
                let errorMsg = 'Error al cargar los detalles del informe.';
                 if (err.response?.status === 404) { errorMsg = `No se encontró un informe con ID ${reportId}.`; }
                 else if (err.response) { errorMsg = `Error del servidor (${err.response.status}).`; }
                 else if (err.request) { errorMsg = 'No se pudo conectar al servidor.'; }
                 else { errorMsg = `Error: ${err.message}`; }
                setError(errorMsg);
                setReportData(null);
            } finally {
                setLoading(false);
            }
        };

        if (reportId) {
            loadReportData();
        } else {
            setError("No se proporcionó un ID de informe.");
            setLoading(false);
        }
    }, [reportId]); // Volver a ejecutar si cambia el reportId

    // --- Renderizado condicional ---
    if (loading) {
        return (
            <div className="report-detail-loading">
                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                <p>Cargando informe...</p>
            </div>
        );
    }

    if (error) {
        return <div className="report-detail-error">Error: {error}</div>;
    }

    if (!reportData) {
        return <div className="report-detail-error">No se pudieron cargar los datos del informe.</div>;
    }

    // --- Renderizado principal del detalle ---
    const {
        title, summary, detailed_notes, // Use detailed_notes
        scout_username, // Changed from author_info
        report_date, // Already used for 'Evento'
        creation_date, // Already used for 'Creado'
        report_specialization_display, // Changed from report_type
        overall_rating, // Keep for rating logic
        potential_rating, // Keep
        match_observed, // Add if not already displayed
        player_name, // Add for display
        player, // Keep for 'Volver' link logic
        attachments = [], // Default to empty array
        tags_list = []
    } = reportData;

    return (
        <div className="report-detail-page card"> {/* Usar clase card como base */}
            {/* Botón Volver (opcional) */}
            <Link to={player ? `/players/${player}` : '/my-reports'} className="back-link">
                <FontAwesomeIcon icon={faArrowLeft} /> Volver {player ? 'al Perfil' : 'a Mis Informes'}
            </Link>

            {/* Cabecera del Informe */}
            <h1 className="report-detail-title">{title || 'Informe sin Título'}</h1>
            <div className="report-detail-meta">
                <span>
                    <FontAwesomeIcon icon={faUser} /> Autor: <strong>{scout_username || 'Desconocido'}</strong>
                </span>
                <span>
                    <FontAwesomeIcon icon={faCalendarAlt} /> Creado: {formatDate(creation_date)}
                </span>
                {report_date && (
                     <span>
                        <FontAwesomeIcon icon={faCalendarAlt} /> Evento: {formatDate(report_date)}
                    </span>
                )}
                {report_specialization_display && (
                     <span>
                        <FontAwesomeIcon icon={faFileAlt} /> Tipo: {report_specialization_display || 'No especificado'}
                    </span>
                )}
                {player_name && (
                     <span>
                        <FontAwesomeIcon icon={faUserCircle} /> Jugador: <strong>{player_name || 'No especificado'}</strong>
                    </span>
                )}
                {match_observed && (
                     <span>
                        <FontAwesomeIcon icon={faClipboardList} /> Partido Observado: <strong>{match_observed}</strong>
                    </span>
                )}
                 {overall_rating !== null && overall_rating !== undefined && (
                     <span className="report-detail-rating">
                        <FontAwesomeIcon icon={faStar} /> {/* Main icon for the label */}
                        Valoración General: {renderRatingStars(overall_rating)} 
                        ({(overall_rating / 20).toFixed(1)}/5) {/* Numeric 0-5 scale */}
                    </span>
                )}
                {potential_rating !== null && potential_rating !== undefined && (
                     <span className="report-detail-rating-potential"> {/* Changed class name */}
                        <FontAwesomeIcon icon={faStar} /> {/* Or another icon for potential */}
                        Potencial: {renderRatingStars(potential_rating)} 
                        ({(potential_rating / 20).toFixed(1)}/5)
                    </span>
                )}
            </div>

            {/* Cuerpo del Informe */}
            {summary && <div className="report-detail-section"><h2 className="section-title">Resumen Ejecutivo</h2><p>{summary}</p></div>}
            {detailed_notes && <div className="report-detail-section"><h2 className="section-title">Notas Detalladas</h2><p>{detailed_notes || 'No hay notas detalladas.'}</p></div>}
            
            {/* Display Attachments */}
            {attachments.length > 0 && (
                <div className="report-detail-section">
                    <h2 className="section-title">Archivos Adjuntos</h2>
                    <ul className="report-attachments-list">
                        {attachments.map((attachment, index) => (
                            <li key={attachment.id || index}>
                                <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faFileAlt} /> {/* Or a more specific icon based on file type if known */}
                                    {attachment.description || attachment.file_url.split('/').pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Etiquetas */}
            {tags_list.length > 0 && (
                <div className="report-detail-section">
                    <h2 className="section-title">Etiquetas</h2>
                    <div className="report-detail-tags">
                        {tags_list.map((tag, index) => (
                            <span key={index} className="report-tag-detail">
                                <FontAwesomeIcon icon={faTag} /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* TODO: Añadir botones de acción (Editar, Eliminar, Compartir, etc.) si es necesario */}

        </div>
    );
}

export default ReportDetailPage;
