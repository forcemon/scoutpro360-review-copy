// frontend/src/components/playerProfile/PhysicalTabContent.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faDumbbell, faHeartbeat, faBalanceScaleRight } from '@fortawesome/free-solid-svg-icons';
import './PhysicalTabContent.css'; // Importar los nuevos estilos

// Componente auxiliar para renderizar un ítem de atributo con barra
const AttributeItem = ({ label, value, rawValue, unit = '', icon }) => {
  const percentage = typeof rawValue === 'number' ? rawValue : (typeof value === 'number' && !unit ? value : 0); // Use value for bar if no unit and rawValue is not present
  const cappedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="attribute-item physical"> {/* Añadimos clase 'physical' */}
      {icon && <FontAwesomeIcon icon={icon} className="attribute-icon" />}
      <div className="attribute-name">{label}</div>
      <div className="attribute-bar">
        <div className="attribute-fill physical" style={{ width: `${cappedPercentage}%` }}></div>
      </div>
      <div className="attribute-value">{value}{unit ? `${unit}` : ''}</div>
    </div>
  );
};

AttributeItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rawValue: PropTypes.number, 
  unit: PropTypes.string,
  icon: PropTypes.object, 
};


const PhysicalTabContent = ({ playerData }) => {
  if (!playerData) {
    return <div>Cargando datos físicos...</div>;
  }

  const physicalAttrs = {
    velocidad: playerData.velocidad ?? 0,
    agilidad: playerData.agilidad ?? 0,
    fuerza: playerData.fuerza ?? 0,
    resistencia: playerData.resistencia ?? 0,
    // 'salto' is not explicitly in the model as a general 0-100 attribute.
    // We will rely on specific jump metrics like salto_horizontal_m 
    // and potentially a future salto_vertical_cm if added to the model.
  };

  const formattedValues = {
    velocidadMax: playerData.velocidad_max_kmh ? `${playerData.velocidad_max_kmh}` : 'N/A',
    aceleracion: playerData.aceleracion_0_20m_secs ? `${playerData.aceleracion_0_20m_secs}` : 'N/A',
    agilidadTest: playerData.agilidad_t_test_secs ? `${playerData.agilidad_t_test_secs}` : 'N/A',
    cambioDireccion: playerData.cambio_direccion_5105_secs ? `${playerData.cambio_direccion_5105_secs}` : 'N/A',
    // Salto Vertical (CMJ) - Placeholder as specific CMJ data field isn't in Player model.
    // If 'playerData.salto_vertical_cm' existed, it would be used here.
    // For now, showing N/A based on the image.
    saltoVertical: 'N/A', 
    saltoHorizontal: playerData.salto_horizontal_m ? `${playerData.salto_horizontal_m}` : 'N/A',
    fuerzaRelativa: playerData.fuerza_relativa_1rm_ratio ? `${playerData.fuerza_relativa_1rm_ratio}` : 'N/A',
    potenciaPico: playerData.potencia_pico_w_kg ? `${playerData.potencia_pico_w_kg}` : 'N/A',
    vo2Max: playerData.vo2_max_ml_kg_min ? `${playerData.vo2_max_ml_kg_min}` : 'N/A',
    yoyoTest: playerData.yoyo_ir1_level || 'N/A',
    distanciaMedia: playerData.distancia_media_km_90min ? `${playerData.distancia_media_km_90min}` : 'N/A',
    equilibrioEstatico: playerData.evaluacion_equilibrio_estatico || 'N/A',
    equilibrioDinamico: playerData.evaluacion_equilibrio_dinamico || 'N/A',
  };

  return (
    <div className="physical-tab-content card">
      <div className="card-title">
        <FontAwesomeIcon icon={faHeartbeat} /> Capacidades Físicas
      </div>
      <div className="content-grid">
        <div className="main-column">
          <div className="section-header">
            <FontAwesomeIcon icon={faTachometerAlt} /> Velocidad y Agilidad
          </div>
          <AttributeItem label="Velocidad (0-100)" value={physicalAttrs.velocidad} rawValue={physicalAttrs.velocidad} />
          <AttributeItem label="Velocidad Máxima" value={formattedValues.velocidadMax} unit="km/h" rawValue={null} />
          <AttributeItem label="Aceleración 0-20m" value={formattedValues.aceleracion} unit="s" rawValue={null} />
          <AttributeItem label="Agilidad (0-100)" value={physicalAttrs.agilidad} rawValue={physicalAttrs.agilidad} />
          <AttributeItem label="Agilidad T-Test" value={formattedValues.agilidadTest} unit="s" rawValue={null} />
          <AttributeItem label="Cambio Dirección 5-10-5" value={formattedValues.cambioDireccion} unit="s" rawValue={null} />

          <div className="section-header">
            <FontAwesomeIcon icon={faDumbbell} /> Fuerza y Potencia
          </div>
          <AttributeItem label="Fuerza (0-100)" value={physicalAttrs.fuerza} rawValue={physicalAttrs.fuerza} />
          <AttributeItem label="Fuerza Relativa 1RM/Peso" value={formattedValues.fuerzaRelativa} unit="x" rawValue={null} />
          <AttributeItem label="Potencia Pico" value={formattedValues.potenciaPico} unit="W/kg" rawValue={null} />
          {/* Displaying N/A for Salto Vertical (CMJ) as per image and current model state */}
          <AttributeItem label="Salto Vertical (CMJ)" value={formattedValues.saltoVertical} unit="cm" rawValue={null} /> 
          <AttributeItem label="Salto Horizontal" value={formattedValues.saltoHorizontal} unit="m" rawValue={null} />
        </div>

        <div className="side-column">
          <div className="section-header">
            <FontAwesomeIcon icon={faHeartbeat} /> Resistencia
          </div>
          <AttributeItem label="Resistencia (0-100)" value={physicalAttrs.resistencia} rawValue={physicalAttrs.resistencia} />
          <AttributeItem label="VO2 Máx Estimado" value={formattedValues.vo2Max} unit="ml/kg/min" rawValue={null} />
          <AttributeItem label="Test Intermitente Yo-Yo IR1" value={formattedValues.yoyoTest} unit="Nivel" rawValue={null} />
          <AttributeItem label="Distancia Media Recorrida/90min" value={formattedValues.distanciaMedia} unit="km" rawValue={null} />

          <div className="section-header">
            <FontAwesomeIcon icon={faBalanceScaleRight} /> Equilibrio y Coordinación
          </div>
          <AttributeItem label="Evaluación Equilibrio Estático" value={formattedValues.equilibrioEstatico} rawValue={null} />
          <AttributeItem label="Evaluación Equilibrio Dinámico" value={formattedValues.equilibrioDinamico} rawValue={null} />
        </div>
      </div>
    </div>
  );
};

PhysicalTabContent.propTypes = {
  playerData: PropTypes.shape({
    velocidad: PropTypes.number,
    agilidad: PropTypes.number,
    fuerza: PropTypes.number,
    resistencia: PropTypes.number,
    // salto: PropTypes.number, // 'salto' (0-100 general) is not in the current model snapshot, specific jump metrics are.
    velocidad_max_kmh: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    aceleracion_0_20m_secs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    agilidad_t_test_secs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cambio_direccion_5105_secs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salto_horizontal_m: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fuerza_relativa_1rm_ratio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    potencia_pico_w_kg: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    vo2_max_ml_kg_min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    yoyo_ir1_level: PropTypes.string,
    distancia_media_km_90min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    evaluacion_equilibrio_estatico: PropTypes.string,
    evaluacion_equilibrio_dinamico: PropTypes.string,
    // ... otros campos de playerData
  }),
};

export default PhysicalTabContent;
