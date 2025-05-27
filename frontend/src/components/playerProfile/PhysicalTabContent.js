// frontend/src/components/playerProfile/PhysicalTabContent.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faDumbbell, faHeartbeat, faBalanceScaleRight } from '@fortawesome/free-solid-svg-icons';
import './PhysicalTabContent.css'; // Importar los nuevos estilos

// Componente auxiliar para renderizar un ítem de atributo con barra
const AttributeItem = ({ label, value, rawValue, unit = '', icon }) => {
  // Calcula el porcentaje para la barra (asume escala 0-100 para rawValue)
  // Si rawValue no existe, intenta usar value si es número, si no, 0.
  const percentage = typeof rawValue === 'number' ? rawValue : (typeof value === 'number' ? value : 0);
  // Limita el porcentaje entre 0 y 100
  const cappedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="attribute-item physical"> {/* Añadimos clase 'physical' */}
      {icon && <FontAwesomeIcon icon={icon} className="attribute-icon" />}
      <div className="attribute-name">{label}</div>
      <div className="attribute-bar">
        {/* La barra usa el valor numérico (0-100) para el ancho */}
        <div className="attribute-fill physical" style={{ width: `${cappedPercentage}%` }}></div>
      </div>
      {/* Muestra el valor formateado (con unidad si existe) */}
      <div className="attribute-value">{value}{unit ? ` ${unit}` : ''}</div>
    </div>
  );
};

// Definir PropTypes para AttributeItem (opcional pero recomendado)
AttributeItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rawValue: PropTypes.number, // El valor numérico (0-100) para la barra
  unit: PropTypes.string,
  icon: PropTypes.object, // Para FontAwesome
};


const PhysicalTabContent = ({ playerData }) => {
  // Si no hay datos, muestra un mensaje o un estado de carga/error si fuera necesario
  if (!playerData) {
    return <div>Cargando datos físicos...</div>; // O un spinner
  }

  // Extraer los valores relevantes de playerData. Usamos '?? 0' para evitar errores si falta algún campo.
  // Idealmente, el backend siempre debería enviar estos campos si existen.
  const physicalAttrs = {
    velocidad: playerData.velocidad ?? 0,
    agilidad: playerData.agilidad ?? 0,
    fuerza: playerData.fuerza ?? 0,
    resistencia: playerData.resistencia ?? 0,
    salto: playerData.salto ?? 0, // Reinstated salto
    // Añade aquí otros atributos físicos si los tienes en el modelo/serializer
    // ej: equilibrio, coordinacion (si son numéricos 0-100)
  };

  // Valores formateados directamente desde playerData o con unidad.
  // Para rawValue en AttributeItem, se usa el valor numérico directo (0-100) si existe, o null si es una métrica específica.
  const formattedValues = {
    velocidadMax: playerData.velocidad_max_kmh ? `${playerData.velocidad_max_kmh} km/h` : 'N/A',
    aceleracion: playerData.aceleracion_0_20m_secs ? `${playerData.aceleracion_0_20m_secs} s` : 'N/A',
    agilidadTest: playerData.agilidad_t_test_secs ? `${playerData.agilidad_t_test_secs} s` : 'N/A',
    cambioDireccion: playerData.cambio_direccion_5105_secs ? `${playerData.cambio_direccion_5105_secs} s` : 'N/A',
    saltoVertical: playerData.salto ? `${playerData.salto} cm (CMJ)` : 'N/A', // Asumiendo que 'salto' es CMJ en cm y 0-100
    saltoHorizontal: playerData.salto_horizontal_m ? `${playerData.salto_horizontal_m} m` : 'N/A',
    fuerzaRelativa: playerData.fuerza_relativa_1rm_ratio ? `${playerData.fuerza_relativa_1rm_ratio} x` : 'N/A',
    potenciaPico: playerData.potencia_pico_w_kg ? `${playerData.potencia_pico_w_kg} W/kg` : 'N/A',
    vo2Max: playerData.vo2_max_ml_kg_min ? `${playerData.vo2_max_ml_kg_min} ml/kg/min` : 'N/A',
    yoyoTest: playerData.yoyo_ir1_level || 'N/A',
    distanciaMedia: playerData.distancia_media_km_90min ? `${playerData.distancia_media_km_90min} km` : 'N/A',
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
          <AttributeItem label="Velocidad Máxima (km/h)" value={formattedValues.velocidadMax} rawValue={null} />
          <AttributeItem label="Aceleración 0-20m (s)" value={formattedValues.aceleracion} rawValue={null} />
          <AttributeItem label="Agilidad (0-100)" value={physicalAttrs.agilidad} rawValue={physicalAttrs.agilidad} />
          <AttributeItem label="Agilidad T-Test (s)" value={formattedValues.agilidadTest} rawValue={null} />
          <AttributeItem label="Cambio Dirección 5-10-5 (s)" value={formattedValues.cambioDireccion} rawValue={null} />

          <div className="section-header">
            <FontAwesomeIcon icon={faDumbbell} /> Fuerza y Potencia
          </div>
          <AttributeItem label="Fuerza (0-100)" value={physicalAttrs.fuerza} rawValue={physicalAttrs.fuerza} />
          <AttributeItem label="Fuerza Relativa 1RM/Peso (x)" value={formattedValues.fuerzaRelativa} rawValue={null} />
          <AttributeItem label="Potencia Pico (W/kg)" value={formattedValues.potenciaPico} rawValue={null} />
          <AttributeItem label="Salto Vertical (CMJ)" value={formattedValues.saltoVertical} rawValue={playerData.salto} /> {/* rawValue usa el campo 'salto' (0-100) */}
          <AttributeItem label="Salto Horizontal (m)" value={formattedValues.saltoHorizontal} rawValue={null} />
        </div>

        <div className="side-column">
          <div className="section-header">
            <FontAwesomeIcon icon={faHeartbeat} /> Resistencia
          </div>
          <AttributeItem label="Resistencia (0-100)" value={physicalAttrs.resistencia} rawValue={physicalAttrs.resistencia} />
          <AttributeItem label="VO2 Máx Estimado (ml/kg/min)" value={formattedValues.vo2Max} rawValue={null} />
          <AttributeItem label="Test Intermitente Yo-Yo IR1 (Nivel)" value={formattedValues.yoyoTest} rawValue={null} />
          <AttributeItem label="Distancia Media Recorrida/90min (km)" value={formattedValues.distanciaMedia} rawValue={null} />

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
    salto: PropTypes.number, // Reinstated salto for CMJ
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
    reports: PropTypes.array,
    // ... otros campos de playerData
  }),
};

export default PhysicalTabContent;
