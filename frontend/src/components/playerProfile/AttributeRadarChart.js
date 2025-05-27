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

    // --- Configuración de Atributos por Categoría (MODIFICADA) ---
    const attributeConfig = [
        { category: 'Físico', items: [ { key: 'velocidad', label: 'Velocidad' }, { key: 'agilidad', label: 'Agilidad' }, { key: 'fuerza', label: 'Fuerza' }, { key: 'resistencia', label: 'Resistencia' } ]},
        { category: 'Técnico', items: [ { key: 'control', label: 'Control Balón' }, { key: 'regate', label: 'Regate' }, { key: 'pase', label: 'Pase' }, { key: 'tiros_lejanos', label: 'Tiros Lejanos' }, { key: 'precision_tiro', label: 'Precisión Tiro'}, { key: 'talento', label: 'Talento' } ]},
        { category: 'Táctico/Mental', items: [ { key: 'posicionamiento', label: 'Posicionamiento' }, { key: 'vision_juego', label: 'Visión Juego' }, { key: 'trabajo_equipo', label: 'Trabajo Equipo' }, { key: 'anticipacion', label: 'Anticipación' }, { key: 'liderazgo', label: 'Liderazgo' }, { key: 'marcaje', label: 'Marcaje' }, { key: 'entradas', label: 'Entradas' } ]}
    ];

    function AttributeRadarChart({ playerData }) {
        if (!playerData) {
            return null; // O un componente de carga/estado vacío
        }
        const attributes = playerData; // Usar playerData directamente

        // Construir labels y datasets dinámicamente desde attributeConfig
        const allLabels = attributeConfig.reduce((acc, category) => {
            category.items.forEach(item => acc.push(item.label));
            return acc;
        }, []);

        const datasets = attributeConfig.map(category => {
            const data = allLabels.map(label => {
                const itemInCategory = category.items.find(it => it.label === label);
                return itemInCategory ? (attributes[itemInCategory.key] || 0) : null; // Usar 0 si el atributo es undefined en playerData para evitar errores en el chart
            });

            let backgroundColor, borderColor, pointBackgroundColor;
            switch (category.category.toLowerCase()) {
                case 'físico':
                    backgroundColor = 'rgba(255, 71, 87, 0.2)'; // Rojo
                    borderColor = 'rgb(255, 71, 87)';
                    pointBackgroundColor = 'rgb(255, 71, 87)';
                    break;
                case 'técnico':
                    backgroundColor = 'rgba(46, 134, 222, 0.2)'; // Azul
                    borderColor = 'rgb(46, 134, 222)';
                    pointBackgroundColor = 'rgb(46, 134, 222)';
                    break;
                case 'táctico/mental':
                    backgroundColor = 'rgba(38, 222, 129, 0.2)'; // Verde
                    borderColor = 'rgb(38, 222, 129)';
                    pointBackgroundColor = 'rgb(38, 222, 129)';
                    break;
                default:
                    backgroundColor = 'rgba(128, 128, 128, 0.2)'; // Gris por defecto
                    borderColor = 'rgb(128, 128, 128)';
                    pointBackgroundColor = 'rgb(128, 128, 128)';
            }

            return {
                label: category.category,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                pointBackgroundColor: pointBackgroundColor,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: borderColor,
                borderWidth: 2,
                spanGaps: false, // Importante para que los null no rompan la línea si se prefiere
                tension: 0.1
            };
        });

        const chartData = {
            labels: allLabels,
            datasets: datasets
        };

        const chartOptions = {
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

    