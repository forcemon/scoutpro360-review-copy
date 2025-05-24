// src/pages/ReportDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link para volver o ir al jugador
import { fetchReportDetail } from '../services/reportService'; // Importar la nueva función
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faUser, faCalendarAlt, faTag, faStar, faFileAlt } from '@fortawesome/free-solid-svg-icons'; // Importar iconos
import './ReportDetailPage.css'; // Crear este archivo CSS después

// Helper para formatear fecha (podría estar en utils)
const formatDate = (dateString, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString('es-ES', options); }
    catch (e) { return 'Fecha Inválida'; }
};

// Helper para renderizar estrellas (podría estar en utils)
const renderRatingStars = (rating) => {
    if (rating === null || rating === undefined) return null;
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return null;
    const fullStars = Math.floor(numRating);
    const halfStar = numRating % 1 >= 0.5; // Considerar .5 como media estrella
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));
    return (
      <>
        {[...Array(fullStars)].map((_, i) => <FontAwesomeIcon key={`full-${i}`} icon={faStar} />)}
        {halfStar && <FontAwesomeIcon key="half" icon={faStar} className="fa-star-half-alt-manual" />} {/* Simular media estrella */}
        {[...Array(emptyStars)].map((_, i) => <FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="fa-star-empty-manual" />)} {/* Simular estrella vacía */}
      </>
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
        title, summary, strengths, weaknesses, potential_notes,
        author_info, creation_date, report_date, report_type, rating,
        tags_list = [], player // Obtener ID del jugador si viene
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
                    <FontAwesomeIcon icon={faUser} /> Autor: <strong>{author_info?.username || 'Desconocido'}</strong>
                </span>
                <span>
                    <FontAwesomeIcon icon={faCalendarAlt} /> Creado: {formatDate(creation_date)}
                </span>
                {report_date && (
                     <span>
                        <FontAwesomeIcon icon={faCalendarAlt} /> Evento: {formatDate(report_date)}
                    </span>
                )}
                {report_type && (
                     <span>
                        <FontAwesomeIcon icon={faFileAlt} /> Tipo: {report_type}
                    </span>
                )}
                 {rating && (
                     <span className="report-detail-rating">
                        <FontAwesomeIcon icon={faStar} /> Valoración: {renderRatingStars(rating)} ({parseFloat(rating).toFixed(1)})
                    </span>
                )}
            </div>

            {/* Cuerpo del Informe */}
            {summary && <div className="report-detail-section"><h2 className="section-title">Resumen Ejecutivo</h2><p>{summary}</p></div>}
            {strengths && <div className="report-detail-section"><h2 className="section-title">Fortalezas</h2><p>{strengths}</p></div>}
            {weaknesses && <div className="report-detail-section"><h2 className="section-title">Debilidades</h2><p>{weaknesses}</p></div>}
            {potential_notes && <div className="report-detail-section"><h2 className="section-title">Notas de Potencial</h2><p>{potential_notes}</p></div>}

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
