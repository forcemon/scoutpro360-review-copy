// src/components/playerProfile/MediaTabContent.js
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhotoFilm, faImages, faVideo } from '@fortawesome/free-solid-svg-icons'; // Icons for sections
import './MediaTabContent.css'; // We will create this CSS file next

// --- Placeholder Data ---
// TODO: Backend needs a way to store/link and serve URLs for images/videos
const placeholderImages = [
    { id: 'img1', url: 'https://via.placeholder.com/300x188/444444/FFFFFF/?text=Acción+1', alt: 'Acción 1' }, // 16:10 ratio example
    { id: 'img2', url: 'https://via.placeholder.com/300x188/333333/FFFFFF/?text=Acción+2', alt: 'Acción 2' },
    { id: 'img3', url: 'https://via.placeholder.com/300x188/444444/FFFFFF/?text=Acción+3', alt: 'Acción 3' },
    { id: 'img4', url: 'https://via.placeholder.com/300x188/333333/FFFFFF/?text=Entrenamiento', alt: 'Entrenamiento' },
    { id: 'img5', url: 'https://via.placeholder.com/300x188/444444/FFFFFF/?text=Retrato', alt: 'Retrato' },
    { id: 'img6', url: 'https://via.placeholder.com/300x188/333333/FFFFFF/?text=Celebración', alt: 'Celebración' },
];

const placeholderVideos = [
     { id: 'vid1', thumbnailUrl: 'https://via.placeholder.com/300x188/444444/FFFFFF/?text=Highlights', alt: 'Highlights' },
     { id: 'vid2', thumbnailUrl: 'https://via.placeholder.com/300x188/333333/FFFFFF/?text=Skills', alt: 'Skills' },
     { id: 'vid3', thumbnailUrl: 'https://via.placeholder.com/300x188/444444/FFFFFF/?text=Análisis', alt: 'Análisis' },
     { id: 'vid4', thumbnailUrl: 'https://via.placeholder.com/300x188/333333/FFFFFF/?text=Partido', alt: 'Partido' },
];
// --- End Placeholder Data ---

function MediaTabContent({ playerData }) {

    // TODO: Replace placeholders with real data from playerData when the backend provides it.
    // playerData might contain arrays like 'image_gallery_urls' and 'video_gallery_items'
    const images = placeholderImages;
    const videos = placeholderVideos;

    // Example handlers (for future lightbox/modal implementation)
    const handleImageClick = (imageUrl) => {
        console.log("Open image:", imageUrl);
        // Implement lightbox/modal logic here
    };
    const handleVideoClick = (videoId) => {
         console.log("Open video:", videoId);
         // Implement player/modal logic here
    };


    return (
        // Use global 'card' class and a specific one
        <div className="card media-tab-card">
            <div className="card-title">
                <FontAwesomeIcon icon={faPhotoFilm} /> Multimedia
            </div>

            {/* Image Section */}
            <div className="media-section">
                <h3 className="media-section-title">
                    <FontAwesomeIcon icon={faImages} /> Galería de Imágenes
                </h3>
                {images.length > 0 ? (
                    <div className="media-grid">
                        {images.map(image => (
                            <div
                                key={image.id}
                                className="media-item image-item"
                                title={image.alt}
                                onClick={() => handleImageClick(image.url)} // Add onClick
                                role="button" // Semantics
                                tabIndex={0} // Keyboard accessibility
                                // Allow activation with Enter or Space
                                onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleImageClick(image.url)}
                            >
                                <img src={image.url} alt={image.alt} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-media-info">No hay imágenes disponibles.</p>
                )}
            </div>

             {/* Video Section */}
            <div className="media-section">
                 <h3 className="media-section-title">
                     <FontAwesomeIcon icon={faVideo} /> Videos Destacados
                 </h3>
                 {videos.length > 0 ? (
                     <div className="media-grid">
                         {videos.map(video => (
                             <div
                                key={video.id}
                                className="media-item video-item" // Specific class for video overlay
                                title={video.alt}
                                onClick={() => handleVideoClick(video.id)} // Add onClick
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleVideoClick(video.id)}
                             >
                                 <img src={video.thumbnailUrl} alt={video.alt} />
                                 {/* Play icon overlay (see CSS) */}
                             </div>
                         ))}
                     </div>
                 ) : (
                     <p className="no-media-info">No hay videos disponibles.</p>
                 )}
            </div>

             <p className="data-source-note media-tab-note">
                Nota: Las imágenes y videos son ejemplos. Se requiere implementar almacenamiento y una API en el backend para gestionar archivos multimedia asociados a los jugadores.
            </p>
        </div>
    );
}

MediaTabContent.propTypes = {
    playerData: PropTypes.object, // Would be used to get actual media URLs
};

export default MediaTabContent;
