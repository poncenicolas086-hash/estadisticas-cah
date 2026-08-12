import { useState, useRef, useEffect } from 'react';
import './index.css';
import { HISTORIALES_PRIMERADIV } from './data/primeradivision/historialesPrimeradiv';
import { EQUIPOS_PRIMERADIV } from './data/primeradivision/equiposprimeradiv';

export default function App() {
  const nombreImagenEscudo = '/huracan.png';
  const textoMarcaDeAgua = "Página creada por @leviquemero © 2026 - NO OFICIAL";
  const [busqueda, setBusqueda] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(null);
  const [filtroLocalia, setFiltroLocalia] = useState('todos');

  // Estados y referencias para la música ambiental
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('./public/sounds/musicah.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Error al reproducir audio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const calcularEstadoPartido = (p: any) => {
    const [golesLocal, golesVisitante] = p.final.split('-').map((n: any) => parseInt(n.trim()));
    
    let gHura = 0;
    let gRival = 0;

    if (p.partido.startsWith('Huracán')) {
      gHura = golesLocal;
      gRival = golesVisitante;
    } else if (p.partido.startsWith(equipoSeleccionado || '') || p.localia === 'visitante') {
      gHura = golesVisitante;
      gRival = golesLocal;
    } else {
      gHura = golesLocal;
      gRival = golesVisitante;
    }

    if (gHura > gRival) return { tipo: 'G', texto: 'G', clase: 'ganado' };
    if (gHura === gRival) return { tipo: 'E', texto: 'E', clase: 'empate' };
    return { tipo: 'P', texto: 'P', clase: 'perdido' };
  };

  const equiposFiltrados =
    busqueda.trim() === ''
      ? []
      : EQUIPOS_PRIMERADIV.filter((eq) =>
          eq.nombre.toLowerCase().startsWith(busqueda.toLowerCase())
        );

 const obtenerPartidos = () => {
    if (!equipoSeleccionado) return [];
    const historialEquipo = HISTORIALES_PRIMERADIV[equipoSeleccionado];
    if (!historialEquipo) return [];
    return [...historialEquipo].reverse();
  };

  const partidosActuales = obtenerPartidos().filter((p) => {
    if (filtroLocalia === 'todos') return true;
    return p.localia === filtroLocalia;
  });

  const datosEquipo = EQUIPOS_PRIMERADIV.find((e) => e.nombre === equipoSeleccionado);

  const totalPartidos = obtenerPartidos().length;
  const ganados = obtenerPartidos().filter((p: any) => calcularEstadoPartido(p).tipo === 'G').length;
  const empatados = obtenerPartidos().filter((p: any) => calcularEstadoPartido(p).tipo === 'E').length;
  const perdidos = totalPartidos - (ganados + empatados);

  return (
    <div className="home-container">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', 'Segoe UI', sans-serif; }
        body { background-color: #ffffff; color: #f1f5f9; }
        .home-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 40px 20px; background: radial-gradient(circle at 50% 0%, #ff1a1a 0%, #ffffff 65%); background-attachment: fixed; position: relative; }
        
        .escudo-container { margin-bottom: 15px; animation: flotar 3s ease-in-out infinite; }
        .escudo-img { width: 400px; height: 400px; object-fit: contain; filter: drop-shadow(0 0 20px rgba(225, 29, 72, 0.4)); }
        @keyframes flotar { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        
        .titulo-principal { font-size: 2rem; font-weight: 900; letter-spacing: 1px; text-align: center; margin-bottom: 25px; text-transform: uppercase; color: #fefeff; filter: drop-shadow(0 0 15px rgba(252, 18, 18, 0.2)); }
        .titulo-principal span { color: #fc1212; }
        
        .buscador-wrapper { position: relative; width: 100%; max-width: 450px; margin-bottom: 25px; }
        .input-buscador { width: 100%; padding: 15px 20px; font-size: 1rem; background: #fdfdff; border: 2px solid #f11c1c; border-radius: 14px; color: red; outline: none; transition: all 0.2s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
        .input-buscador:focus { border-color: #f11c1c; box-shadow: 0 0 15px rgba(225, 29, 72, 0.3); }
        
        .sugerencias-lista { position: absolute; top: 100%; left: 0; right: 0; background-color: #131720; border: 1px solid #2a3245; border-radius: 0 0 14px 14px; max-height: 240px; overflow-y: auto; z-index: 10; margin-top: 5px; box-shadow: 0 10px 30px rgba(0,0,0,0.7); }
        .sugerencia-item { display: flex; align-items: center; gap: 15px; padding: 12px 20px; cursor: pointer; border-bottom: 1px solid #1a202c; transition: background 0.15s; }
        .sugerencia-item:hover { background-color: #e11d48; }
        .escudo-miniatura { width: 28px; height: 28px; object-fit: contain; }

        .grid-escudos { display: grid; grid-template-columns: repeat(10, 1fr); gap: 12px; width: 100%; max-width: 900px; margin-bottom: 30px; justify-items: center; }
        @media(max-width: 1024px) { .grid-escudos { grid-template-columns: repeat(6, 1fr); } }
        @media(max-width: 600px) { .grid-escudos { grid-template-columns: repeat(4, 1fr); } }

        .escudo-grid-item { background: #ff1109; border: 1px solid #f3f4f7; border-radius: 12px; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; padding: 10px; cursor: pointer; transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
        .escudo-grid-item img { width: 100%; height: 100%; object-fit: contain; }
        .escudo-grid-item:hover { transform: scale(1.15); border-color: #e11d48; box-shadow: 0 0 15px rgba(225, 29, 72, 0.4); z-index: 2; }

        .historial-view { width: 100%; max-width: 850px; display: flex; flex-direction: column; align-items: center; }
        .btn-volver { align-self: flex-start; background: #fcf8f8; color: #ff0000; border: 1px solid #ff0000; padding: 8px 16px; border-radius: 10px; cursor: pointer; font-weight: 600; margin-bottom: 20px; transition: 0.2s; }
        .btn-volver:hover { background: #ff0000; color: white; border-color: #fffefe; }

        .panel-duelo { width: 100%; background: linear-gradient(145deg, #f4f5f8 0%, #f4f5f8 100%); border: 1px solid #ff0000; border-radius: 20px; padding: 25px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 10px 30px rgba(255, 29, 29, 0.5); margin-bottom: 25px; }
        .enfrentamiento-row { display: flex; align-items: center; gap: 20px; margin-bottom: 15px; }
        .equipo-badge-box { background: rgba(255, 20, 20, 0.42); border: 1px solid #2a3245; border-radius: 50%; width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; padding: 10px; }
        .equipo-badge-box img { width: 100%; height: 100%; object-fit: contain; }
        .vs-tag { font-size: 0.85rem; font-weight: 900; background: #ff0e0e; color: white; padding: 6px 10px; border-radius: 8px; letter-spacing: 1px; }
        
        .rival-titulo { 
          font-size: 1.25rem; 
          font-weight: 800; 
          text-transform: uppercase; 
          margin-bottom: 20px; 
          color: #ff0404; 
          text-align: center; 
          width: 100%; 
          max-width: 700px; 
          padding: 0 15px; 
          line-height: 1.3; 
        }

        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%; margin-bottom: 20px; }
        @media(max-width: 600px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
        .stat-box { background: #fc04048e; border-radius: 10px; padding: 10px; text-align: center; border: 1px solid #f6f7f8; }
        .stat-val { font-size: 1.5rem; font-weight: 900; }
        .stat-lbl { font-size: 0.7rem; text-transform: uppercase; color: #f6f7f8; font-weight: 700; margin-top: 2px; letter-spacing: 0.5px; }
        .stat-box.g { color: #22c55e; }
        .stat-box.e { color: #eab308; }
        .stat-box.p { color: #fa1f1f; }
        .stat-box.t { color: #f8fafc; }

        .filtros-box { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; width: 100%; }
        .btn-filtro { background: #fcfdfd; color: #ff0f0f; border: 1px solid #ff0f0f; padding: 7px 16px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: 0.2s; }
        .btn-filtro.activo, .btn-filtro:hover { background: #ff0f0f; color: white; border-color: #ff0f0f; }

        .partidos-stack { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .partido-item-card { background: #ffffff; border: 1px solid #ff0d0d; border-radius: 14px; display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; transition: transform 0.15s, border-color 0.15s; }
        .partido-item-card:hover { transform: translateY(-2px); border-color: #ff1111; }
        
        .partido-left { display: flex; align-items: center; gap: 15px; }
        
        .resultado-letra-badge { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1rem; color: white; }
        .resultado-letra-badge.ganado { background-color: #22c55e; box-shadow: 0 0 10px rgba(34, 197, 94, 0.4); }
        .resultado-letra-badge.empate { background-color: #eab308; color: #0b0d10; box-shadow: 0 0 10px rgba(234, 179, 8, 0.4); }
        .resultado-letra-badge.perdido { background-color: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.4); }

        .goles-marcador { font-size: 1.1rem; font-weight: 800; letter-spacing: 1px; min-width: 50px; color: #ff1010; }
        
        .info-detalles { display: flex; flex-direction: column; gap: 3px; }
        .torneo-txt { font-size: 0.9rem; font-weight: 700; color: #ff1010; }
        .sub-detalles { display: flex; gap: 8px; align-items: center; font-size: 0.75rem; color: #ff1010; }
        .partido-nombre-tag { background: rgba(252, 252, 252, 0.94); padding: 1px 6px; border-radius: 4px; color: #ff1010; }

        .partido-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .localia-chip { font-size: 0.65rem; text-transform: uppercase; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: #ff1010; color: #ffffff; border: 1px solid #ff0000; }
        .fecha-txt { font-size: 0.75rem; color: #ff1010; font-weight: 500; }

        .marca-agua { font-size: 0.70rem; color: #1f0808ad; font-weight: 700; text-align: center; margin-top: 30px; letter-spacing: 0.5px; }

        .reproductor-flotante { position: fixed; bottom: 20px; right: 20px; z-index: 100; background: #ff0000; color: #ffffff; border: 2px solid #ffffff; padding: 10px 16px; border-radius: 30px; cursor: pointer; font-weight: 700; font-size: 0.85rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: transform 0.2s, background 0.2s; display: flex; align-items: center; gap: 8px; }
        .reproductor-flotante:hover { transform: scale(1.05); background: #cc0000; }
      `}</style>

      <button className="reproductor-flotante" onClick={toggleMusic}>
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </button>

      {!equipoSeleccionado ? (
        <>
          <div className="escudo-container" style={{ marginTop: '30px' }}>
            <img src={nombreImagenEscudo} alt="Huracán" className="escudo-img" />
          </div>

          <h1 className="titulo-principal">
            Historiales <span>Quemeros</span>
          </h1>

          <div className="buscador-wrapper">
            <input
              type="text"
              className="input-buscador"
              placeholder="Buscar rival (ej. San Lorenzo...)"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {equiposFiltrados.length > 0 && (
              <div className="sugerencias-lista">
                {equiposFiltrados.map((eq, i) => (
                  <div
                    key={i}
                    className="sugerencia-item"
                    onClick={() => {
                      setEquipoSeleccionado(eq.nombre);
                      setFiltroLocalia('todos');
                      setBusqueda('');
                    }}
                  >
                    <img src={eq.archivo} alt={eq.nombre} className="escudo-miniatura" />
                    <span>{eq.nombre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid-escudos">
            {EQUIPOS_PRIMERADIV.map((eq, i) => (
              <div
                key={i}
                className="escudo-grid-item"
                title={eq.nombre}
                onClick={() => {
                  setEquipoSeleccionado(eq.nombre);
                  setFiltroLocalia('todos');
                }}
              >
                <img src={eq.archivo} alt={eq.nombre} />
              </div>
            ))}
          </div>

          <div className="marca-agua">{textoMarcaDeAgua}</div>
        </>
      ) : (
        <div className="historial-view">
          <div className="marca-agua" style={{ marginTop: '0', marginBottom: '20px' }}>{textoMarcaDeAgua}</div>

          <button className="btn-volver" onClick={() => setEquipoSeleccionado(null)}>
            ← Volver al buscador
          </button>

          <div className="panel-duelo">
            <div className="enfrentamiento-row">
              <div className="equipo-badge-box">
                <img src={nombreImagenEscudo} alt="Huracán" />
              </div>
              <div className="vs-tag">VS</div>
              <div className="equipo-badge-box">
                {datosEquipo && <img src={datosEquipo.archivo} alt={equipoSeleccionado} />}
              </div>
            </div>
            
            <div className="rival-titulo">Huracán vs {equipoSeleccionado}</div>

            <div className="stats-row">
              <div className="stat-box t">
                <div className="stat-val">{totalPartidos}</div>
                <div className="stat-lbl">Jugados</div>
              </div>
              <div className="stat-box g">
                <div className="stat-val">{ganados}</div>
                <div className="stat-lbl">Ganados</div>
              </div>
              <div className="stat-box e">
                <div className="stat-val">{empatados}</div>
                <div className="stat-lbl">Empates</div>
              </div>
              <div className="stat-box p">
                <div className="stat-val">{perdidos}</div>
                <div className="stat-lbl">Perdidos</div>
              </div>
            </div>

            <div className="filtros-box">
              <button className={`btn-filtro ${filtroLocalia === 'todos' ? 'activo' : ''}`} onClick={() => setFiltroLocalia('todos')}>
                Todos
              </button>
              <button className={`btn-filtro ${filtroLocalia === 'local' ? 'activo' : ''}`} onClick={() => setFiltroLocalia('local')}>
                Local
              </button>
              <button className={`btn-filtro ${filtroLocalia === 'visitante' ? 'activo' : ''}`} onClick={() => setFiltroLocalia('visitante')}>
                Visitante
              </button>
              <button className={`btn-filtro ${filtroLocalia === 'neutral' ? 'activo' : ''}`} onClick={() => setFiltroLocalia('neutral')}>
                Neutral
              </button>
            </div>
          </div>

          <div className="partidos-stack">
            {partidosActuales.length > 0 ? (
              partidosActuales.map((p) => {
                const estado = calcularEstadoPartido(p);
                return (
                  <div key={p.id} className="partido-item-card">
                    <div className="partido-left">
                      <div className={`resultado-letra-badge ${estado.clase}`}>
                        {estado.texto}
                      </div>
                      <div className="goles-marcador">{p.final}</div>
                      <div className="info-detalles">
                        <div className="torneo-txt">{p.torneo}</div>
                        <div className="sub-detalles">
                          <span className="partido-nombre-tag">{p.partido}</span>
                          <span>• {p.dia}</span>
                        </div>
                      </div>
                    </div>
                    <div className="partido-right">
                      <span className="localia-chip">{p.localia}</span>
                      <span className="fecha-txt">{p.dia}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ff1d1d', background: '#ffffff', borderRadius: '14px', width: '100%', border: '1px solid #ff1d1d' }}>
                No hay partidos cargados para este historial todavía.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}