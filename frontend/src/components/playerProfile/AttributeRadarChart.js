    // src/components/playerProfile/AttributeRadarChart.js
    // REVERTIDO: Vuelve a usar datos de ejemplo internos temporalmente

    import React from 'react';
    import PropTypes from 'prop-types';
    import { Radar } from 'react-chartjs-2';
    import {
        Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip,
    } from 'chart.js';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
    import { faBolt, faFutbol, faBrain } from '@fortawesome/free-solid-svg-icons';

    import './AttributeRadarChart.css';

    // Registrar componentes Chart.js
    ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

    // --- Helpers para Categorías (sin cambios) ---
    const getCategoryClass = (category) => { /* ... (como antes) ... */
        switch (category?.toLowerCase()) {
            case 'físico': return 'physical';
            case 'técnico': return 'technical';
            case 'táctico/mental': return 'tactical';
            default: return '';
        }
    };
    const getCategoryIcon = (category) => { /* ... (como antes) ... */
         switch (category?.toLowerCase()) {
            case 'físico': return faBolt;
            case 'técnico': return faFutbol;
            case 'táctico/mental': return faBrain;
            default: return null;
        }
    };

    // --- Configuración de Atributos por Categoría (sin cambios) ---
    const attributeConfig = [ /* ... (como antes) ... */
        { category: 'Físico', items: [ { key: 'velocidad', label: 'Velocidad' }, { key: 'agilidad', label: 'Agilidad' }, { key: 'fuerza', label: 'Fuerza' }, { key: 'resistencia', label: 'Resistencia' }, { key: 'salto', label: 'Salto' } ]},
        { category: 'Técnico', items: [ { key: 'control', label: 'Control Balón' }, { key: 'regate', label: 'Regate' }, { key: 'finalizacion', label: 'Finalización' }, { key: 'pase_corto', label: 'Pases Cortos' }, { key: 'tiro_lejano', label: 'Tiros Lejanos' } ]},
        { category: 'Táctico/Mental', items: [ { key: 'posicionamiento', label: 'Posicionamiento' }, { key: 'vision', label: 'Visión Juego' }, { key: 'trabajo', label: 'Ritmo Trabajo' }, { key: 'decision', label: 'Decisiones' }, { key: 'anticipacion', label: 'Anticipación' } ]}
    ];


    function AttributeRadarChart({ playerData }) { // Recibe playerData pero no lo usa para los datos por ahora

        // --- REVERTIDO A DATOS DE EJEMPLO ---
        const placeholderAttributes = {
            velocidad: 92, agilidad: 85, fuerza: 75, resistencia: 80, salto: 78,
            control: 88, regate: 90, finalizacion: 86, pase_corto: 78, tiro_lejano: 82,
            posicionamiento: 80, vision: 75, trabajo: 85, decision: 79, anticipacion: 81
        };
        const attributes = placeholderAttributes; // Usar los placeholders
        // --- FIN REVERSIÓN ---


        // --- Configuración del Gráfico Radar (usa 'attributes') ---
        const labels = [ /* ... (labels como antes) ... */
             'Velocidad', 'Agilidad', 'Fuerza', 'Resistencia', 'Salto', 'Control', 'Regate',
             'Finalización', 'Pase Corto', 'Tiro Lejano', 'Posicionamiento', 'Visión',
             'Trabajo', 'Decisión', 'Anticipación'
         ];
        const chartData = { /* ... (datasets como antes, usando 'attributes') ... */
            labels: labels,
            datasets: [
                 { label: 'Físico', data: [ attributes.velocidad, attributes.agilidad, attributes.fuerza, attributes.resistencia, attributes.salto, null, null, null, null, null, null, null, null, null, null ], backgroundColor: 'rgba(255, 71, 87, 0.2)', borderColor: 'rgb(255, 71, 87)', pointBackgroundColor: 'rgb(255, 71, 87)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(255, 71, 87)', borderWidth: 2, spanGaps: false, tension: 0.1 },
                 { label: 'Técnico', data: [ null, null, null, null, null, attributes.control, attributes.regate, attributes.finalizacion, attributes.pase_corto, attributes.tiro_lejano, null, null, null, null, null ], backgroundColor: 'rgba(46, 134, 222, 0.2)', borderColor: 'rgb(46, 134, 222)', pointBackgroundColor: 'rgb(46, 134, 222)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(46, 134, 222)', borderWidth: 2, spanGaps: false, tension: 0.1 },
                 { label: 'Táctico/Mental', data: [ null, null, null, null, null, null, null, null, null, null, attributes.posicionamiento, attributes.vision, attributes.trabajo, attributes.decision, attributes.anticipacion ], backgroundColor: 'rgba(38, 222, 129, 0.2)', borderColor: 'rgb(38, 222, 129)', pointBackgroundColor: 'rgb(38, 222, 129)', pointBorderColor: '#fff', pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgb(38, 222, 129)', borderWidth: 2, spanGaps: false, tension: 0.1 }
            ]
         };
        const chartOptions = { /* ... (opciones del radar como antes) ... */
            maintainAspectRatio: false, scales: { r: { beginAtZero: true, min: 0, max: 100, ticks: { stepSize: 20, color: 'rgba(160, 160, 160, 0.8)', backdropColor: 'rgba(0, 0, 0, 0)', font: { size: 10 } }, grid: { color: 'rgba(160, 160, 160, 0.2)' }, angleLines: { color: 'rgba(160, 160, 160, 0.2)' }, pointLabels: { color: 'rgba(224, 224, 224, 0.8)', font: { size: 11 } } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: '#fff', bodyColor: '#fff', borderColor: 'rgba(255, 255, 255, 0.3)', borderWidth: 1, displayColors: true, padding: 10, filter: function (tooltipItem) { return tooltipItem.raw !== null; }, callbacks: { label: function(context) { let label = context.dataset.label || ''; if (label) { label += ': '; } if (context.parsed.r !== null) { label += context.parsed.r; } return label; } } } }, interaction: { mode: 'index', intersect: false },
         };
        // --- Fin Configuración Radar ---


        return (
            <div className="card attribute-chart-and-details-card">
                <div className="card-title">
                    <i className="fas fa-chart-pie"></i> Perfil de Atributos Clave
                </div>
                <div className="radar-chart-container">
                    <Radar data={chartData} options={chartOptions} />
                </div>
                <div className="attributes-legend">
                    <div className="legend-item physical"> <FontAwesomeIcon icon={faBolt} /> Físico </div>
                    <div className="legend-item technical"> <FontAwesomeIcon icon={faFutbol} /> Técnico </div>
                    <div className="legend-item tactical"> <FontAwesomeIcon icon={faBrain} /> Táctico/Mental </div>
                </div>

                {/* Sección de Barras de Atributos (usa 'attributes') */}
                <div className="attributes-grid">
                    {attributeConfig.map((group) => {
                        const categoryClass = getCategoryClass(group.category);
                        const categoryIcon = getCategoryIcon(group.category);
                        const validItems = group.items.filter(attr => attributes[attr.key] !== undefined && attributes[attr.key] !== null);
                        if (validItems.length === 0) return null;
                        return (
                            <div key={group.category} className={`attribute-category ${categoryClass}`}>
                                <h3> {categoryIcon && <FontAwesomeIcon icon={categoryIcon} />} {group.category} </h3>
                                {validItems.map((attr) => {
                                    const value = attributes[attr.key];
                                    return (
                                        <div key={attr.key} className={`attribute-item ${categoryClass}`}>
                                            <div className="attribute-name">{attr.label}</div>
                                            <div className="attribute-bar"> <div className={`attribute-fill ${categoryClass}`} style={{ width: `${value}%` }} ></div> </div>
                                            <div className="attribute-value">{value}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    AttributeRadarChart.propTypes = {
        playerData: PropTypes.object,
    };

    export default AttributeRadarChart;

    