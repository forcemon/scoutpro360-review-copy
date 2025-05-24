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
    finalizacion: playerData.finalizacion ?? 0,
    pase_corto: playerData.pase_corto ?? 0,
    tiro_lejano: playerData.tiro_lejano ?? 0,
    posicionamiento: playerData.posicionamiento ?? 0,
    vision: playerData.vision ?? 0,
    trabajo: playerData.trabajo ?? 0,
    decision: playerData.decision ?? 0,
    anticipacion: playerData.anticipacion ?? 0,
    fuerza: playerData.fuerza ?? 0,
    salto: playerData.salto ?? 0,
     // Añade aquí más atributos si existen en playerData y son necesarios
     // para calcular 'rawValue' o 'value' en algún AttributeItem.
     // Por ejemplo, si tuvieras 'entradas', 'intercepciones' como 0-100:
     // entradas: playerData.entradas ?? 0,
     // intercepciones: playerData.intercepciones ?? 0,
  };

  // Valores formateados (estos pueden necesitar ajustes o venir del backend)
  const formattedValues = {
    entradasExitosas: playerData.entradas_exitosas_90min || `${(attrs.trabajo / 50).toFixed(1)}`,
    intercepciones: playerData.intercepciones_90min || `${(attrs.anticipacion / 100).toFixed(1)}`,
    duelosDefensivos: playerData.duelos_def_ganados_pct || `${(attrs.fuerza / 2).toFixed(0)}%`,
    presionesExitosas: playerData.presiones_exitosas_90min || `${(attrs.trabajo / 20).toFixed(1)}`,
    precisionPasesLargos: playerData.precision_pases_largos_pct || `${(attrs.pase_corto + 5).toFixed(0)}%`,
    pasesProgresivos: playerData.pases_progresivos_90min || `${(attrs.vision / 15).toFixed(1)}`,
    visionJuegoScout: playerData.vision_juego_scout || attrs.vision,
    movimientoSinBalon: playerData.movimiento_sin_balon_eval || (attrs.posicionamiento > 80 ? 'Excelente' : 'Bueno'),
    precisionTiros: playerData.precision_tiros_pct || `${(attrs.finalizacion / 1.8).toFixed(0)}%`,
    toquesAreaRival: playerData.toques_area_rival_90min || `${(attrs.posicionamiento / 12).toFixed(1)}`,
    habilidadPieDebil: playerData.habilidad_pie_debil_stars || `${Math.min(5, Math.max(1, Math.round(attrs.control / 20)))} ★`,
    juegoAereoOf: playerData.juego_aereo_of_eval || attrs.salto,
    compostura: playerData.compostura_eval || (attrs.decision > 75 ? 'Buena' : 'Normal'),
    concentracion: playerData.concentracion_eval || (attrs.decision > 80 ? 'Alta' : 'Buena'),
    agresividad: playerData.agresividad_eval || (attrs.fuerza > 70 ? 'Controlada' : 'Normal'),
    liderazgoPotencial: playerData.liderazgo_potencial_eval || (attrs.trabajo > 80 ? 'Medio' : 'Bajo'),
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
          {/* --- TIPO CORREGIDO: technical (azul) --- */}
          <AttributeItem label="Entradas Exitosas/90min" value={formattedValues.entradasExitosas} type="technical" rawValue={attrs.trabajo} /> {/* Asumiendo que 'trabajo' refleja esto para la barra */}
          <AttributeItem label="Intercepciones/90min" value={formattedValues.intercepciones} type="technical" rawValue={attrs.anticipacion} /> {/* Anticipación es mental, pero intercepción es acción técnica? Depende interpretación. Pongamos technical */}
          <AttributeItem label="Duelos Defensivos Ganados (%)" value={formattedValues.duelosDefensivos} type="technical" rawValue={parseInt(formattedValues.duelosDefensivos)} />
          <AttributeItem label="Presiones Exitosas/90min" value={formattedValues.presionesExitosas} type="technical" rawValue={attrs.trabajo} /> {/* Trabajo es mental, pero presión es acción */}
          {/* --- FIN CORRECCIÓN --- */}

          <div className="section-header">
            <FontAwesomeIcon icon={faUsers} /> Juego Colectivo y Visión
          </div>
          {/* --- TIPO CORREGIDO: technical (azul) --- */}
          <AttributeItem label="Precisión Pases Largos (%)" value={formattedValues.precisionPasesLargos} type="technical" rawValue={parseInt(formattedValues.precisionPasesLargos)} />
          <AttributeItem label="Pases Progresivos/90min" value={formattedValues.pasesProgresivos} type="technical" rawValue={attrs.vision * 1.2} /> {/* Vision es mental, pase es técnico. Usamos vision para barra? */}
          <AttributeItem label="Visión de Juego (Evaluación Scout)" value={formattedValues.visionJuegoScout} type="technical" rawValue={attrs.vision} /> {/* Vision es mental, pero lo ponemos azul aquí */}
          <AttributeItem label="Movimiento sin Balón" value={formattedValues.movimientoSinBalon} type="technical" rawValue={attrs.posicionamiento} /> {/* Posicionamiento es táctico, pero lo ponemos azul */}
           {/* --- FIN CORRECCIÓN --- */}
        </div>

        {/* Columna Lateral (Derecha) */}
        <div className="side-column">
          <div className="section-header">
            <FontAwesomeIcon icon={faCrosshairs} /> Habilidades Ofensivas (Detalle)
          </div>
           {/* --- TIPO CORREGIDO: technical (azul) --- */}
          <AttributeItem label="Precisión Tiros (%)" value={formattedValues.precisionTiros} type="technical" rawValue={attrs.finalizacion} />
          <AttributeItem label="Toques en Área Rival/90min" value={formattedValues.toquesAreaRival} type="technical" rawValue={attrs.posicionamiento} /> {/* Posicionamiento es táctico, pero lo ponemos azul */}
          <AttributeItem label="Habilidad Pie Débil (1-5)" value={formattedValues.habilidadPieDebil} type="technical" rawValue={parseInt(formattedValues.habilidadPieDebil)*20} />
          <AttributeItem label="Juego Aéreo Ofensivo" value={formattedValues.juegoAereoOf} type="technical" rawValue={attrs.salto} />
           {/* --- FIN CORRECCIÓN --- */}

          <div className="section-header">
            <FontAwesomeIcon icon={faBrain} /> Aspectos Mentales
          </div>
          {/* --- TIPO CORRECTO: tactical (verde) --- */}
          <AttributeItem label="Compostura" value={formattedValues.compostura} type="tactical" rawValue={attrs.decision} />
          <AttributeItem label="Concentración" value={formattedValues.concentracion} type="tactical" rawValue={attrs.decision} />
          <AttributeItem label="Agresividad" value={formattedValues.agresividad} type="tactical" rawValue={attrs.fuerza} />
          <AttributeItem label="Liderazgo (Potencial)" value={formattedValues.liderazgoPotencial} type="tactical" rawValue={attrs.trabajo} />
          {/* --- FIN CORRECCIÓN --- */}
        </div>
      </div>
    </div>
  );
};

TechnicalTacticalTabContent.propTypes = {
  playerData: PropTypes.shape({
    control: PropTypes.number,
    regate: PropTypes.number,
    finalizacion: PropTypes.number,
    pase_corto: PropTypes.number,
    tiro_lejano: PropTypes.number,
    posicionamiento: PropTypes.number,
    vision: PropTypes.number,
    trabajo: PropTypes.number,
    decision: PropTypes.number,
    anticipacion: PropTypes.number,
    fuerza: PropTypes.number,
    salto: PropTypes.number,
    reports: PropTypes.array,
    // Añadir aquí otros campos formateados si vienen del backend
  }),
};

export default TechnicalTacticalTabContent;
