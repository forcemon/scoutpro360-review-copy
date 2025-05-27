// frontend/src/components/playerProfile/TechnicalTacticalTabContent.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt, faUsers, faCrosshairs, faBrain, faFutbol
} from '@fortawesome/free-solid-svg-icons';
import './TechnicalTacticalTabContent.css';

// Componente auxiliar para renderizar un ítem de atributo
const AttributeItem = ({ label, value, rawValue, unit = '', type = 'technical' }) => { // Default type es 'technical' (azul)
  const percentage = typeof rawValue === 'number' ? rawValue : (typeof value === 'number' ? value : 0);
  const cappedPercentage = Math.max(0, Math.min(100, percentage));
  const typeClass = type === 'tactical' ? 'tactical' : 'technical'; // Clase para CSS

  return (
    // Añadimos la clase 'technical' o 'tactical' al item general también si se necesita para estilos
    <div className={`attribute-item ${typeClass}`}>
      <div className="attribute-name">{label}</div>
      <div className="attribute-bar">
        {/* La clase en attribute-fill determina el color */}
        <div className={`attribute-fill ${typeClass}`} style={{ width: `${cappedPercentage}%` }}></div>
      </div>
      <div className="attribute-value">{value}{unit ? ` ${unit}` : ''}</div>
    </div>
  );
};

AttributeItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rawValue: PropTypes.number,
  unit: PropTypes.string,
  type: PropTypes.oneOf(['technical', 'tactical']),
};


const TechnicalTacticalTabContent = ({ playerData }) => {
  if (!playerData) {
    return <div>Cargando datos técnico-tácticos...</div>;
  }

  // Extraer atributos relevantes
  const attrs = {
    control: playerData.control ?? 0,
    regate: playerData.regate ?? 0,
    // finalizacion: playerData.finalizacion ?? 0, // Removed
    pase: playerData.pase ?? 0, // Renamed from pase_corto
    tiros_lejanos: playerData.tiros_lejanos ?? 0, // Renamed from tiro_lejano
    posicionamiento: playerData.posicionamiento ?? 0,
    vision_juego: playerData.vision_juego ?? 0, // Renamed from vision
    trabajo_equipo: playerData.trabajo_equipo ?? 0, // Renamed from trabajo
    // decision: playerData.decision ?? 0, // Removed
    anticipacion: playerData.anticipacion ?? 0,
    fuerza: playerData.fuerza ?? 0, // Kept if used by formattedValues like agresividad
    // salto: playerData.salto ?? 0, // Removed
    // Added missing attributes
    entradas: playerData.entradas ?? 0,
    marcaje: playerData.marcaje ?? 0,
    liderazgo: playerData.liderazgo ?? 0, // Used for Liderazgo
    talento: playerData.talento ?? 0,
    precision_tiro: playerData.precision_tiro ?? 0,
    // New mental attributes
    compostura: playerData.compostura ?? 0,
    concentracion: playerData.concentracion ?? 0,
    agresividad: playerData.agresividad ?? 0, // Used for Agresividad
    potencia_tiro: playerData.potencia_tiro ?? 0,
  };

  // Valores formateados (estos pueden necesitar ajustes o venir del backend)
  // Placeholder calculations are suffixed with "(calc.)"
  const formattedValues = {
    entradasExitosas: playerData.entradas_exitosas_90min || `${(attrs.entradas / 10).toFixed(1)} /90 (calc.)`,
    intercepciones: playerData.intercepciones_90min || `${(attrs.marcaje / 10).toFixed(1)} /90 (calc.)`,
    duelosDefensivos: playerData.duelos_def_ganados_pct || `${(attrs.fuerza / 2).toFixed(0)}% (calc.)`,
    presionesExitosas: playerData.presiones_exitosas_90min || `${(attrs.trabajo_equipo / 20).toFixed(1)} /90 (calc.)`,
    precisionPasesLargos: playerData.precision_pases_largos_pct || `${(attrs.pase + 5).toFixed(0)}% (calc.)`,
    pasesProgresivos: playerData.pases_progresivos_90min || `${(attrs.vision_juego / 15).toFixed(1)} /90 (calc.)`,
    visionJuegoScout: playerData.vision_juego_scout || `${attrs.vision_juego} (calc.)`,
    movimientoSinBalon: playerData.movimiento_sin_balon_eval || (attrs.posicionamiento > 80 ? 'Excelente (calc.)' : 'Bueno (calc.)'),
    precisionTiros: playerData.precision_tiros_pct || `${attrs.precision_tiro}% (calc.)`,
    toquesAreaRival: playerData.toques_area_rival_90min || `${(attrs.posicionamiento / 12).toFixed(1)} /90 (calc.)`,
    habilidadPieDebil: playerData.habilidad_pie_debil_stars || `${Math.min(5, Math.max(1, Math.round(attrs.control / 20)))} ★ (calc.)`,
    // juegoAereoOf removed. compostura, concentracion, agresividad, liderazgo will use direct playerData values.
  };

  return (
    <div className="technical-tactical-tab-content card">
      <div className="card-title">
         <FontAwesomeIcon icon={faFutbol} />
         Habilidades Técnico-Tácticas
      </div>
      <div className="content-grid">
        {/* Columna Principal (Izquierda) */}
        <div className="main-column">
          <div className="section-header">
            <FontAwesomeIcon icon={faShieldAlt} /> Habilidades Defensivas
          </div>
          <AttributeItem label="Entradas Exitosas/90min" value={formattedValues.entradasExitosas} type="technical" rawValue={attrs.entradas} />
          <AttributeItem label="Intercepciones/90min" value={formattedValues.intercepciones} type="technical" rawValue={attrs.marcaje} />
          <AttributeItem label="Duelos Defensivos Ganados (%)" value={formattedValues.duelosDefensivos} type="technical" rawValue={parseInt(formattedValues.duelosDefensivos)} />
          <AttributeItem label="Presiones Exitosas/90min" value={formattedValues.presionesExitosas} type="technical" rawValue={attrs.trabajo_equipo} />

          <div className="section-header">
            <FontAwesomeIcon icon={faUsers} /> Juego Colectivo y Visión
          </div>
          <AttributeItem label="Precisión Pases Largos (%)" value={formattedValues.precisionPasesLargos} type="technical" rawValue={attrs.pase} />
          <AttributeItem label="Pases Progresivos/90min" value={formattedValues.pasesProgresivos} type="technical" rawValue={attrs.vision_juego} />
          <AttributeItem label="Visión de Juego (Evaluación Scout)" value={formattedValues.visionJuegoScout} type="technical" rawValue={attrs.vision_juego} />
          <AttributeItem label="Movimiento sin Balón" value={formattedValues.movimientoSinBalon} type="technical" rawValue={attrs.posicionamiento} />
        </div>

        {/* Columna Lateral (Derecha) */}
        <div className="side-column">
          <div className="section-header">
            <FontAwesomeIcon icon={faCrosshairs} /> Habilidades Ofensivas (Detalle)
          </div>
          {/* AttributeItem for "Precisión Tiros (%)" removed (was using attrs.finalizacion) */}
          {/* Using new precision_tiro directly if needed, or update formattedValues.precisionTiros's rawValue source */}
           <AttributeItem label="Precisión Tiros (%)" value={formattedValues.precisionTiros} type="technical" rawValue={attrs.precision_tiro} />
          <AttributeItem label="Toques en Área Rival/90min" value={formattedValues.toquesAreaRival} type="technical" rawValue={attrs.posicionamiento} />
          <AttributeItem label="Habilidad Pie Débil (1-5)" value={formattedValues.habilidadPieDebil} type="technical" rawValue={parseInt(formattedValues.habilidadPieDebil)*20} />
          {/* AttributeItem for "Juego Aéreo Ofensivo" removed (was using attrs.salto) */}

          <div className="section-header">
            <FontAwesomeIcon icon={faBrain} /> Aspectos Mentales
          </div>
          <AttributeItem label="Compostura" value={attrs.compostura} type="tactical" rawValue={attrs.compostura} />
          <AttributeItem label="Concentración" value={attrs.concentracion} type="tactical" rawValue={attrs.concentracion} />
          <AttributeItem label="Agresividad" value={attrs.agresividad} type="tactical" rawValue={attrs.agresividad} />
          <AttributeItem label="Liderazgo" value={attrs.liderazgo} type="tactical" rawValue={attrs.liderazgo} />
        </div>
      </div>
    </div>
  );
};

TechnicalTacticalTabContent.propTypes = {
  playerData: PropTypes.shape({
    control: PropTypes.number,
    regate: PropTypes.number,
    // finalizacion: PropTypes.number, // Removed
    pase: PropTypes.number, // Renamed
    tiros_lejanos: PropTypes.number, // Renamed
    posicionamiento: PropTypes.number,
    vision_juego: PropTypes.number, // Renamed
    trabajo_equipo: PropTypes.number, // Renamed
    // decision: PropTypes.number, // Removed
    anticipacion: PropTypes.number,
    fuerza: PropTypes.number, // Kept
    // salto: PropTypes.number, // Removed
    entradas: PropTypes.number, // Added
    marcaje: PropTypes.number, // Added
    liderazgo: PropTypes.number,
    talento: PropTypes.number,
    precision_tiro: PropTypes.number,
    potencia_tiro: PropTypes.number,
    // Added new mental attributes to PropTypes
    compostura: PropTypes.number,
    concentracion: PropTypes.number,
    agresividad: PropTypes.number,
    reports: PropTypes.array,
  }),
};

export default TechnicalTacticalTabContent;
