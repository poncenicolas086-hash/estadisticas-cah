import React from 'react';

const WidgetCalendario: React.FC = () => {
  // Acá cargás tus partidos manualmente. 
  // El nombre del rival debe coincidir (o parecerse) con el nombre de la imagen en public (ej: 'velez', 'boca', 'san lorenzo' -> 'sanlorenzo.png')
  const ultimoPartido = {
    rival: 'Sarmiento',
    resultado: '2 - 0',
    fecha: '23/08/2026',
    horario: '21:00 hs',
    estadio: 'Eva Perón'
  };

  const proximoPartido = {
    rival: 'Riestra',
    fecha: '23/08/2026',
    horario: '21:00 hs',
    estadio: 'Tomás Adolfo Ducó'
  };

  // Función mágica para leer directamente la carpeta public según el nombre del equipo
  const obtenerEscudo = (nombreRival: string) => {
    const formateado = nombreRival.toLowerCase().replace(/\s+/g, '');
    return `/${formateado}.png`;
  };

  return (
    <div style={styles.contenedorFlotante}>
      {/* Tarjeta Último Partido (Izquierda del escudo) */}
      <div style={styles.card}>
        <div style={styles.badgeAnterior}>Último Partido</div>
        <div style={styles.contentRow}>
          <div style={styles.infoContenedor}>
            <div style={styles.rivalRow}>
              <img 
                src={obtenerEscudo(ultimoPartido.rival)} 
                alt={ultimoPartido.rival} 
                style={styles.escudoMini}
                onError={(e) => {
                  // Si no encuentra la imagen, oculta el ícono para que no rompa
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <h4 style={styles.rival}>{ultimoPartido.rival}</h4>
            </div>
            <p style={styles.detalles}>{ultimoPartido.fecha} • {ultimoPartido.estadio}</p>
          </div>
          <div style={styles.resultadoBox}>{ultimoPartido.resultado}</div>
        </div>
      </div>

      {/* Tarjeta Próximo Partido (Derecha del escudo) */}
      <div style={styles.card}>
        <div style={styles.badgeProximo}>Próximo Partido</div>
        <div style={styles.contentRow}>
          <div style={styles.infoContenedor}>
            <div style={styles.rivalRow}>
              <img 
                src={obtenerEscudo(proximoPartido.rival)} 
                alt={proximoPartido.rival} 
                style={styles.escudoMini}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <h4 style={styles.rival}>{proximoPartido.rival}</h4>
            </div>
            <p style={styles.detalles}>{proximoPartido.horario} • {proximoPartido.estadio}</p>
          </div>
          <div style={styles.fechaBox}>{proximoPartido.fecha}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  contenedorFlotante: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1100px',
    position: 'absolute' as const,
    top: '280px', // Cambiá este valor para subir o bajar las tarjetas respecto al escudo gigante
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0 20px',
    boxSizing: 'border-box' as const,
    zIndex: 10,
    pointerEvents: 'none' as const,
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(252, 18, 18, 0.2)',
    borderRadius: '16px',
    padding: '16px 20px',
    width: '360px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    textAlign: 'left' as const,
    pointerEvents: 'auto' as const,
  },
  contentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  infoContenedor: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  rivalRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  escudoMini: {
    width: '50px',
    height: '50px',
    objectFit: 'contain' as const,
  },
  badgeAnterior: {
    color: '#fc1212',
    fontSize: '0.7rem',
    fontWeight: '800' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  badgeProximo: {
    color: '#fc1212',
    fontSize: '0.7rem',
    fontWeight: '800' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  rival: {
    fontSize: '1.25rem',
    fontWeight: '900' as const,
    margin: '0',
    color: '#fc1212',
  },
  detalles: {
    fontSize: '0.75rem',
    color: '#fc1212',
    margin: '0',
    fontWeight: '500' as const,
  },
  resultadoBox: {
    background: 'linear-gradient(135deg, #fc1212 0%, #fdf9fa 100%)',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '800' as const,
    padding: '8px 14px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(252, 18, 18, 0.3)',
    letterSpacing: '1px',
  },
  fechaBox: {
    background: 'linear-gradient(135deg, #fc1212 0%, #fdf9fa 100%)',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '700' as const,
    padding: '8px 12px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
};

export default WidgetCalendario;