// src/components/playerProfile/DetailedAttributes.js
// ACTUALIZADO para usar datos reales de playerData

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faFutbol, faBrain } from '@fortawesome/free-solid-svg-icons';
import './DetailedAttributes.css';

// Helper para obtener la clase CSS de la categoría
const getCategoryClass = (category) => {
    switch (category?.toLowerCase()) {
        case 'físico': return 'physical';
        case 'técnico': return 'technical';
        case 'táctico/mental': return 'tactical';
        default: return '';
    }
};

// Helper para obtener el icono de la categoría
const getCategoryIcon = (category) => {
     switch (category?.toLowerCase()) {
        case 'físico': return faBolt;
        case 'técnico': return faFutbol;
        case 'táctico/mental': return faBrain;
        default: return null;
    }
};

function DetailedAttributes({ playerData }) {

    // --- USANDO DATOS REALES DE PLAYERDATA ---
    // Asume que los nombres de campo coinciden con los definidos en models.py
    // Se usan valores por defecto (ej: 0 para barras) si el dato no viene.
    const attributes = {
        // Físicos
        velocidad: playerData?.velocidad ?? 0,
        agilidad: playerData?.agilidad ?? 0,
        fuerza: playerData?.fuerza ?? 0,
        resistencia: playerData?.resistencia ?? 0,
        salto: playerData?.salto ?? 0,
        // Técnicos (usar nombres de campo sin tildes como en models.py)
        control: playerData?.control ?? 0,
        regate: playerData?.regate ?? 0,
        finalizacion: playerData?.finalizacion ?? 0,
        pase_corto: playerData?.pase_corto ?? 0,
        tiro_lejano: playerData?.tiro_lejano ?? 0,
        // Tácticos/Mentales (usar nombres de campo sin tildes)
        posicionamiento: playerData?.posicionamiento ?? 0,
        vision: playerData?.vision ?? 0,
        trabajo: playerData?.trabajo ?? 0,
        decision: playerData?.decision ?? 0,
        anticipacion: playerData?.anticipacion ?? 0,
    };
    // --- FIN DATOS REALES ---

    // --- Agrupar Atributos por Categoría (igual que antes) ---
    const attributeConfig = [
        { category: 'Físico', items: [
            { key: 'velocidad', label: 'Velocidad' }, { key: 'agilidad', label: 'Agilidad' },
            { key: 'fuerza', label: 'Fuerza' }, { key: 'resistencia', label: 'Resistencia' },
            { key: 'salto', label: 'Salto' }
        ]},
        { category: 'Técnico', items: [
            { key: 'control', label: 'Control Balón' }, { key: 'regate', label: 'Regate' },
            { key: 'finalizacion', label: 'Finalización' }, { key: 'pase_corto', label: 'Pases Cortos' },
            { key: 'tiro_lejano', label: 'Tiros Lejanos' }
        ]},
        { category: 'Táctico/Mental', items: [
            { key: 'posicionamiento', label: 'Posicionamiento' }, { key: 'vision', label: 'Visión Juego' },
            { key: 'trabajo', label: 'Ritmo Trabajo' }, { key: 'decision', label: 'Decisiones' },
            { key: 'anticipacion', label: 'Anticipación' }
        ]}
    ];
    // --- Fin Agrupación ---

    return (
        // Se usa la clase 'card' global
        <div className="card detailed-attributes-card">
            <div className="card-title">
                <i className="fas fa-tasks"></i> {/* Icono del mockup */}
                Atributos Detallados
            </div>
            <div className="attributes-grid">
                {attributeConfig.map((group) => {
                    const categoryClass = getCategoryClass(group.category);
                    const categoryIcon = getCategoryIcon(group.category);
                    return (
                        <div key={group.category} className={`attribute-category ${categoryClass}`}>
                            <h3>
                                {categoryIcon && <FontAwesomeIcon icon={categoryIcon} />}
                                {group.category}
                            </h3>
                            {group.items.map((attr) => {
                                const value = attributes[attr.key]; // Valor ya tiene fallback a 0 arriba
                                return (
                                    <div key={attr.key} className={`attribute-item ${categoryClass}`}>
                                        <div className="attribute-name">{attr.label}</div>
                                        <div className="attribute-bar">
                                            <div
                                                className={`attribute-fill ${categoryClass}`}
                                                style={{ width: `${value}%` }} // Ancho basado en el valor
                                            ></div>
                                        </div>
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

DetailedAttributes.propTypes = {
    playerData: PropTypes.object, // Se espera que contenga los campos de atributos
};

export default DetailedAttributes;