// src/pages/DashboardPage.js

import React from 'react';
// Step 1: Import necessary icons
import {
    faUsers, faFileAlt, faSearchLocation, faBell, faStar,
    faClipboardList, faHistory, faCalendarAlt, faBolt,
    faUserPlus, faSearch, faCalendarPlus, faEye, faShareAlt, faEdit
} from '@fortawesome/free-solid-svg-icons';

// Import Dashboard and common components
import WelcomeHeader from '../components/dashboard/WelcomeHeader';
import StatSummaryCard from '../components/dashboard/StatSummaryCard';
import DashboardCardWrapper from '../components/common/DashboardCardWrapper';
import PlayerHighlightCard from '../components/dashboard/PlayerHighlightCard';
import ActivityFeedItem from '../components/dashboard/ActivityFeedItem';
import EventItem from '../components/dashboard/EventItem';
import ReportPreviewItem from '../components/dashboard/ReportPreviewItem';
import QuickActionButton from '../components/dashboard/QuickActionButton';
import './DashboardPage.css'; // Import page-specific CSS

function DashboardPage() {

    // --- Mock Data (with icon objects) ---
    const summaryStats = [
        { value: 32, label: 'Jugadores Monitoreados', icon: faUsers, iconBgClass: 'blue', trendValue: '+4 este mes', trendDirection: 'up' },
        { value: 18, label: 'Informes Creados', icon: faFileAlt, iconBgClass: 'green', trendValue: '+2 este mes', trendDirection: 'up' },
        { value: 7, label: 'Búsquedas Activas', icon: faSearchLocation, iconBgClass: 'purple', trendValue: '-1 este mes', trendDirection: 'down' },
        { value: 12, label: 'Alertas Nuevas', icon: faBell, iconBgClass: 'orange', trendValue: '+12 este mes', trendDirection: 'up' }
    ];

    const featuredPlayers = [
        { id: 'player-1', name: 'Carlos Rodríguez', position: 'Centrocampista', age: 19, team: 'FC Barcelona B', imageUrl: `https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=random&color=fff&size=300`, rating: 4.5 },
        { id: 'player-2', name: 'Mateo González', position: 'Delantero Centro', age: 20, team: 'River Plate', imageUrl: `https://ui-avatars.com/api/?name=Mateo+Gonzalez&background=random&color=fff&size=300`, rating: 4.8 },
        { id: 'player-3', name: 'Diego Martínez', position: 'Lateral Derecho', age: 18, team: 'Atlético Nacional', imageUrl: `https://ui-avatars.com/api/?name=Diego+Martinez&background=random&color=fff&size=300`, rating: 4.2 },
    ];

    const recentReports = [
        { id: 'report-1', thumbnailUrl: `https://ui-avatars.com/api/?name=Roberto+Sanchez&background=252a34&color=ffc107&bold=true&size=50`, title: 'Evaluación Técnico-Táctica', playerInfo: 'Roberto Sánchez • Portero', date: '10/04/2025' },
        { id: 'report-2', thumbnailUrl: `https://ui-avatars.com/api/?name=Marcos+Lima&background=252a34&color=ffc107&bold=true&size=50`, title: 'Análisis de Rendimiento', playerInfo: 'Marcos Lima • Extremo Izquierdo', date: '08/04/2025' },
        { id: 'report-3', thumbnailUrl: `https://ui-avatars.com/api/?name=Javier+Gomez&background=252a34&color=ffc107&bold=true&size=50`, title: 'Evaluación Física', playerInfo: 'Javier Gómez • Mediocentro', date: '05/04/2025' },
    ];

    const activityFeed = [
        // Pass the icon object as the 'icon' prop
        { id: 1, icon: faUserPlus, iconBgClass: 'blue', text: 'Has añadido a <strong>Luis Díaz</strong> a tu lista de seguimiento', time: 'Hoy, 10:45 AM' },
        { id: 2, icon: faShareAlt, iconBgClass: 'purple', text: '<strong>Carlos López</strong> ha compartido contigo un informe sobre <strong>Martín Pérez</strong>', time: 'Ayer, 18:30 PM' },
        { id: 3, icon: faEdit, iconBgClass: 'green', text: 'Has actualizado el perfil de <strong>Gabriel Torres</strong>', time: '24/04/2025, 14:20 PM' },
        { id: 4, icon: faFileAlt, iconBgClass: 'orange', text: 'Has creado un nuevo informe para <strong>Juan Camilo Ortiz</strong>', time: '23/04/2025, 09:15 AM' },
        { id: 5, icon: faEye, iconBgClass: 'blue', text: 'Has visto el perfil de <strong>Manuel Rodríguez</strong>', time: '22/04/2025, 16:45 PM' }
    ];

    const upcomingEvents = [
        { id: 1, day: '15', month: 'MAY', title: 'FC Barcelona vs Real Madrid', location: 'Camp Nou, Barcelona', type: 'match' },
        { id: 2, day: '18', month: 'MAY', title: 'Copa Juvenil Internacional', location: 'Amsterdam, Países Bajos', type: 'tournament' },
        { id: 3, day: '22', month: 'MAY', title: 'Visita Academia FC Porto', location: 'Porto, Portugal', type: 'scouting' },
        { id: 4, day: '25', month: 'MAY', title: 'Reunión Comité Deportivo', location: 'Oficina Central', type: 'meeting' }
    ];
    // --- End Mock Data ---

    // Function to handle player card clicks (example)
    const handlePlayerClick = (playerId) => {
        console.log(`Navigate to player profile: ${playerId}`);
        // const navigate = useNavigate(); navigate(`/players/${playerId}`); // Requires importing useNavigate
    };

    // Function to handle quick action clicks (example)
    const handleQuickActionClick = (action) => {
        console.log(`Quick action: ${action}`);
        // Implement logic here
    };

    return (
        <div className="dashboard-page">
            {/* Header section */}
            <WelcomeHeader />

            {/* Grid for summary statistics cards */}
            <div className="stats-summary-grid">
                {summaryStats.map((stat, index) => (
                    <StatSummaryCard
                        key={index}
                        value={stat.value}
                        label={stat.label}
                        icon={stat.icon} // Pass the icon object
                        iconBgClass={stat.iconBgClass}
                        trendValue={stat.trendValue}
                        trendDirection={stat.trendDirection}
                    />
                ))}
            </div>

            {/* Main content grid (2 columns) */}
            <div className="dashboard-content-grid">
                {/* Main Column */}
                <div className="dashboard-main-column">
                    {/* Featured Players Section */}
                    <DashboardCardWrapper
                        title="Jugadores Destacados"
                        icon={faStar} // Pass the icon object
                        actionText="Ver todos"
                        actionLink="/players" // Link to player list page
                    >
                        <div className="players-grid">
                            {featuredPlayers.map(player => (
                                <PlayerHighlightCard key={player.id} {...player} onClick={() => handlePlayerClick(player.id)} />
                            ))}
                        </div>
                    </DashboardCardWrapper>

                    {/* Recent Reports Section */}
                    <DashboardCardWrapper
                        title="Informes Recientes"
                        icon={faClipboardList} // Pass the icon object
                        actionText="Ver todos"
                        actionLink="/my-reports" // Link to my reports page
                    >
                        <div className="dashboard-reports-list">
                            {recentReports.map(report => (
                                <ReportPreviewItem key={report.id} {...report} />
                            ))}
                        </div>
                    </DashboardCardWrapper>
                </div>

                {/* Sidebar Column */}
                <div className="dashboard-sidebar-column">
                    {/* Activity Feed Section */}
                    <DashboardCardWrapper
                        title="Actividad Reciente"
                        icon={faHistory} // Pass the icon object
                    >
                        <div className="activity-feed">
                            {activityFeed.map(item => (
                                <ActivityFeedItem key={item.id} {...item} /> // ActivityFeedItem already receives 'icon'
                            ))}
                        </div>
                    </DashboardCardWrapper>

                    {/* Upcoming Events Section */}
                    <DashboardCardWrapper
                        title="Próximos Eventos"
                        icon={faCalendarAlt} // Pass the icon object
                        actionText="Ver calendario"
                        actionLink="/events" // Placeholder link
                    >
                        <div className="events-list">
                            {upcomingEvents.map(event => (
                                <EventItem key={event.id} {...event} />
                            ))}
                        </div>
                    </DashboardCardWrapper>

                    {/* Quick Actions Section */}
                    <DashboardCardWrapper
                        title="Acciones Rápidas"
                        icon={faBolt} // Pass the icon object
                    >
                        <div className="quick-actions-grid">
                            <QuickActionButton
                                icon={faFileAlt} // Pass the icon object
                                text="Nuevo Informe"
                                onClick={() => handleQuickActionClick('nuevo-informe')}
                            />
                             <QuickActionButton
                                icon={faUserPlus} // Pass the icon object
                                text="Nuevo Jugador"
                                onClick={() => handleQuickActionClick('nuevo-jugador')}
                            />
                             <QuickActionButton
                                icon={faSearch} // Pass the icon object
                                text="Nueva Búsqueda"
                                onClick={() => handleQuickActionClick('nueva-busqueda')}
                            />
                             <QuickActionButton
                                icon={faCalendarPlus} // Pass the icon object
                                text="Nuevo Evento"
                                onClick={() => handleQuickActionClick('nuevo-evento')}
                            />
                        </div>
                    </DashboardCardWrapper>

                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
