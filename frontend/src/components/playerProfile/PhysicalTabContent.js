// frontend/src/components/playerProfile/PhysicalTabContent.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faDumbbell, faHeartbeat, faBalanceScaleRight } from '@fortawesome/free-solid-svg-icons';
import './PhysicalTabContent.css';

const AttributeItem = ({ label, value, rawValue, unit = '', icon }) => {
  // Usar rawValue para la barra si es un número; sino, si value es un número y no hay unidad, usar value. Sino, 0.
  const percentage = typeof rawValue === 'number' ? rawValue : (typeof value === 'number' && !unit ? value : 0);
  const cappedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="attribute-item physical">
      {icon && <FontAwesomeIcon icon={icon} className="attribute-icon" />}
      <div className="attribute-name">{label}</div>
      <div className="attribute-bar">
        <div className="attribute-fill physical" style={{ width: `${cappedPercentage}%` }}></div>
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
  icon: PropTypes.object,
};

const PhysicalTabContent = ({ playerData }) => {
  console.log('[PhysicalTabContent] PROPS RECEIVED - playerData:', JSON.stringify(playerData, null, 2));
  if (!playerData) {
    return <div className="physical-tab-content card"><p>Cargando datos físicos...</p></div>;
  }

  // Atributos base (0-100) para las barras
  const physicalAttrs = {
    velocidad: playerData.velocidad ?? 0,
    agilidad: playerData.agilidad ?? 0,
    fuerza: playerData.fuerza ?? 0,
    resistencia: playerData.resistencia ?? 0,
  };

  // Valores formateados para mostrar, incluyendo unidades
  const formattedValues = {
    velocidadMax: playerData.velocidad_max_kmh != null ? `${playerData.velocidad_max_kmh}` : 'N/A',
    aceleracion: playerData.aceleracion_0_20m_secs != null ? `${playerData.aceleracion_0_20m_secs}` : 'N/A',
    agilidadTest: playerData.agilidad_t_test_secs != null ? `${playerData.agilidad_t_test_secs}` : 'N/A',
    cambioDireccion: playerData.cambio_direccion_5105_secs != null ? `${playerData.cambio_direccion_5105_secs}` : 'N/A',
    saltoVertical: playerData.salto_vertical_cmj_cm != null ? `${playerData.salto_vertical_cmj_cm}` : 'N/A',
    saltoHorizontal: playerData.salto_horizontal_m != null ? `${playerData.salto_horizontal_m}` : 'N/A',
    fuerzaRelativa: playerData.fuerza_relativa_1rm_ratio != null ? `${playerData.fuerza_relativa_1rm_ratio}` : 'N/A',
    potenciaPico: playerData.potencia_pico_w_kg != null ? `${playerData.potencia_pico_w_kg}` : 'N/A',
    vo2Max: playerData.vo2_max_ml_kg_min != null ? `${playerData.vo2_max_ml_kg_min}` : 'N/A',
    yoyoTest: playerData.yoyo_ir1_level || 'N/A', // Handles null, empty string
    distanciaMedia: playerData.distancia_media_km_90min != null ? `${playerData.distancia_media_km_90min}` : 'N/A',
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
    velocidad_max_kmh: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    aceleracion_0_20m_secs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    agilidad_t_test_secs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cambio_direccion_5105_secs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salto_horizontal_m: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salto_vertical_cmj_cm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
