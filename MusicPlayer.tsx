import { useState, useRef, useEffect } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Reemplazá con la ruta de tu archivo de música en la carpeta /public
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inicializar el audio
    audioRef.current = new Audio('/sounds/ambient-huracan.mp3');
    audioRef.current.loop = true; // Bucle infinito
    audioRef.current.volume = 0.2; // Volumen bajo para que sea "ambiental"
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Error al reproducir:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="music-player">
      <button onClick={togglePlay}>
        {isPlaying ? '⏸️ Pausar Música' : '▶️ Música Ambiental'}
      </button>
    </div>
  );
};

export default MusicPlayer;