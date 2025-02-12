import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, className = '' }) => {
  // Función para detectar si el video es de YouTube
  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const renderYouTubeVideo = (url: string) => {
    // Extraer el ID del video de YouTube
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return (
      <iframe
        className="w-full"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    );
  };

  return (
    <div className={`video-container ${className}`}>
      {isYouTubeUrl(videoUrl) ? (
        renderYouTubeVideo(videoUrl) // Si es YouTube, renderiza el iframe
      ) : (
        <video className="w-full" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video> // Si no es YouTube, es un video directo
      )}
    </div>
  );
};

export default VideoPlayer;
