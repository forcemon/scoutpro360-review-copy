// frontend/src/pages/PlayerProfilePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { fetchPlayerDetail } from '../services/playerService'; // Verifica ruta y nombre
import { fetchReports } from '../services/reportService'; // Import fetchReports
// Changed: Ya no se necesita importar Layout aquí
// import Layout from '../layouts/Layout';
import ProfileHeader from '../components/playerProfile/ProfileHeader';
import ProfileTabs from '../components/playerProfile/ProfileTabs';
// Importa otros componentes necesarios que ProfileTabs renderizará
import './PlayerProfilePage.css'; // Verifica ruta

const PlayerProfilePage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastReport, setLastReport] = useState(null);
  const [lastReportLoading, setLastReportLoading] = useState(false);

  useEffect(() => {
    const loadPlayerData = async () => {
      console.log(`[PlayerProfilePage] Intentando cargar datos para playerId: ${playerId}`);
      if (!playerId) {
          console.error("[PlayerProfilePage] No se proporcionó playerId en la URL.");
          setError("ID de jugador inválido."); // Español
          setLoading(false);
          return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPlayerDetail(playerId);
        // console.log('[PlayerProfilePage] Datos recibidos para el perfil:', data); // Original log, can be kept or removed.
        console.log('[PlayerProfilePage] Datos del jugador establecidos en el estado:', data); // <--- ADDED THIS
        setPlayerData(data);

        if (data && data.id) { // Ensure playerData and its id is available
            setLastReportLoading(true);
            try {
                const reportResponse = await fetchReports({ player: data.id, ordering: '-report_date', page_size: 1 });
                if (reportResponse && reportResponse.results && reportResponse.results.length > 0) {
                    setLastReport(reportResponse.results[0]);
                } else {
                    setLastReport(null); // No reports found
                }
            } catch (reportErr) {
                console.error('[PlayerProfilePage] Error fetching last report:', reportErr);
                // Optionally set a specific error state for the last report
                // setError('No se pudo cargar el último informe.'); // Or a more general error
                setLastReport(null);
            } finally {
                setLastReportLoading(false);
            }
        }
      } catch (err) {
        console.error('[PlayerProfilePage] Error completo al cargar datos del jugador:', err);
         // Español
        setError('No se pudieron cargar los datos del jugador. Verifica la conexión o la API.');
      } finally {
        setLoading(false);
      }
    };

    loadPlayerData();
  }, [playerId]);

  // Renderizado condicional (mensajes en español)
  // Changed: Ya no se envuelven con Layout aquí
  if (loading) {
    // Solo devuelve el mensaje, el Layout lo pone App.js
    return <div className="loading-message">Cargando perfil del jugador...</div>;
  }
  if (error) {
     // Solo devuelve el mensaje
    return <div className="error-message">{error}</div>;
  }
  if (!playerData) {
     // Solo devuelve el mensaje
    return <div className="error-message">No se encontraron datos para este jugador.</div>;
  }

  // Renderiza solo el contenido específico de la página del perfil
  // Changed: Eliminado el <Layout> que envolvía todo
  return (
    <div className="player-profile-page">
      <ProfileHeader playerData={playerData} />
      {/* ProfileTabs recibe playerData y renderiza las pestañas (General, Stats, etc.) */}
      <ProfileTabs playerData={playerData} lastReport={lastReport} lastReportLoading={lastReportLoading} />
    </div>
  );
};

export default PlayerProfilePage;
