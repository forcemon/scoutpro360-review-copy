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
    salto: playerData.salto ?? 0,
    // Añade aquí otros atributos físicos si los tienes en el modelo/serializer
    // ej: equilibrio, coordinacion (si son numéricos 0-100)
  };

  // Valores formateados (si los tienes en el backend o los calculas aquí)
  // Estos son ejemplos basados en el mockup, necesitarás la lógica o datos reales
  const formattedValues = {
    velocidadMax: playerData.velocidad_max_kmh || `${physicalAttrs.velocidad}+`, // Ejemplo
    aceleracion: playerData.aceleracion_0_20m || `${(100 - physicalAttrs.velocidad) / 10 + 2}s`, // Ejemplo muy básico
    agilidadTest: playerData.agilidad_t_test || `${(100 - physicalAttrs.agilidad) / 10 + 8}s`, // Ejemplo muy básico
    cambioDireccion: playerData.cambio_direccion_5105 || `${(100 - physicalAttrs.agilidad) / 15 + 4}s`, // Ejemplo
    saltoVertical: playerData.salto_vertical_cm || `${physicalAttrs.salto} cm`, // Ejemplo
    saltoHorizontal: playerData.salto_horizontal_m || `${physicalAttrs.salto / 30 + 1.5} m`, // Ejemplo
    fuerzaRelativa: playerData.fuerza_relativa_1rm || `${physicalAttrs.fuerza / 50 + 1}x`, // Ejemplo
    potenciaPico: playerData.potencia_pico_wkg || `${physicalAttrs.fuerza * 0.8} W/kg`, // Ejemplo
    vo2Max: playerData.vo2_max || `${physicalAttrs.resistencia + 10} ml/kg/min`, // Ejemplo
    yoyoTest: playerData.yoyo_ir1_level || `Nivel ${physicalAttrs.resistencia / 5 + 10}`, // Ejemplo
    distanciaMedia: playerData.distancia_media_km || `${physicalAttrs.resistencia / 10 + 8} km`, // Ejemplo
    equilibrioEstatico: playerData.equilibrio_estatico || (physicalAttrs.agilidad > 75 ? 'Bueno' : 'Satisfactorio'), // Ejemplo
    equilibrioDinamico: playerData.equilibrio_dinamico || (physicalAttrs.agilidad > 65 ? 'Satisfactorio' : 'Mejorable'), // Ejemplo
  };


  return (
    <div className="physical-tab-content card"> {/* Envuelve en 'card' si quieres ese estilo */}
      <div className="card-title">
         <FontAwesomeIcon icon={faHeartbeat} /> {/* Icono general para la tarjeta */}
         Capacidades Físicas
      </div>
      <div className="content-grid"> {/* Contenedor de la cuadrícula */}
        {/* Columna Principal (Izquierda) */}
        <div className="main-column">
          <div className="section-header">
            <FontAwesomeIcon icon={faTachometerAlt} /> Velocidad y Agilidad
          </div>
          <AttributeItem label="Velocidad Máxima (km/h)" value={formattedValues.velocidadMax} rawValue={physicalAttrs.velocidad} />
          <AttributeItem label="Aceleración (0-20m)" value={formattedValues.aceleracion} rawValue={physicalAttrs.velocidad} /> {/* Usa velocidad para barra? O necesita 'aceleracion' 0-100? */}
          <AttributeItem label="Agilidad (T-Test)" value={formattedValues.agilidadTest} rawValue={physicalAttrs.agilidad} />
          <AttributeItem label="Cambio de Dirección (5-10-5)" value={formattedValues.cambioDireccion} rawValue={physicalAttrs.agilidad} />

          <div className="section-header">
            <FontAwesomeIcon icon={faDumbbell} /> Fuerza y Potencia
          </div>
          <AttributeItem label="Salto Vertical (CMJ)" value={formattedValues.saltoVertical} rawValue={physicalAttrs.salto} unit="cm" />
          <AttributeItem label="Salto Horizontal" value={formattedValues.saltoHorizontal} rawValue={physicalAttrs.salto} unit="m" /> {/* Usa salto para barra? */}
          <AttributeItem label="Fuerza Relativa (1RM Squat/Peso)" value={formattedValues.fuerzaRelativa} rawValue={physicalAttrs.fuerza} unit="x" />
          <AttributeItem label="Potencia Pico (W/kg)" value={formattedValues.potenciaPico} rawValue={physicalAttrs.fuerza} unit="W/kg" /> {/* Usa fuerza para barra? */}
        </div>

        {/* Columna Lateral (Derecha) */}
        <div className="side-column">
          <div className="section-header">
            <FontAwesomeIcon icon={faHeartbeat} /> Resistencia
          </div>
          <AttributeItem label="VO2 Máx Estimado" value={formattedValues.vo2Max} rawValue={physicalAttrs.resistencia} unit="ml/kg/min" />
          <AttributeItem label="Test Intermitente (Yo-Yo IR1)" value={formattedValues.yoyoTest} rawValue={physicalAttrs.resistencia} />
          <AttributeItem label="Distancia Media Recorrida/90min" value={formattedValues.distanciaMedia} rawValue={physicalAttrs.resistencia} unit="km" />

          <div className="section-header">
            <FontAwesomeIcon icon={faBalanceScaleRight} /> Equilibrio y Coordinación
          </div>
          <AttributeItem label="Equilibrio Estático (Unipodal)" value={formattedValues.equilibrioEstatico} rawValue={physicalAttrs.agilidad} /> {/* Usa agilidad para barra? O necesita 'equilibrio'? */}
          <AttributeItem label="Equilibrio Dinámico (Y-Balance)" value={formattedValues.equilibrioDinamico} rawValue={physicalAttrs.agilidad} /> {/* Usa agilidad para barra? */}
        </div>
      </div>
    </div>
  );
};

// Definir PropTypes para playerData (opcional pero recomendado)
PhysicalTabContent.propTypes = {
  playerData: PropTypes.shape({
    velocidad: PropTypes.number,
    agilidad: PropTypes.number,
    fuerza: PropTypes.number,
    resistencia: PropTypes.number,
    salto: PropTypes.number,
    // Añade aquí todos los demás campos físicos que esperas recibir
    reports: PropTypes.array, // Asegúrate de incluir esto si ProfileTabs lo necesita para otra pestaña
    // ... otros campos de playerData
  }),
};

export default PhysicalTabContent;
