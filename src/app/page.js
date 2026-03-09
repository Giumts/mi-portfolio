export default function Home() {
  return (
    <main style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0a0a0a', // Un negro profundo y elegante
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      {/* Círculo decorativo de fondo */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(10,10,10,0) 70%)',
        zIndex: 0
      }}></div>

      <h1 style={{ 
        fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
        fontWeight: '800',
        marginBottom: '1rem',
        zIndex: 1
      }}>
        Hola, soy <span style={{ 
          color: '#38bdf8',
          textShadow: '0 0 20px rgba(56,189,248,0.3)'
        }}>Giulia</span>
      </h1>

      <p style={{ 
        fontSize: '1.2rem', 
        color: '#a1a1aa', 
        maxWidth: '500px', 
        lineHeight: '1.6',
        zIndex: 1,
        marginBottom: '2.5rem'
      }}>
        Bienvenida a mi nuevo portfolio. Soy desarrolladora en formación 
        creando experiencias digitales modernas con Next.js.
      </p>

      <div style={{ 
        display: 'flex', 
        gap: '15px',
        zIndex: 1,
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <a 
          href="https://github.com/Giumts" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            padding: '12px 24px',
            backgroundColor: '#38bdf8',
            color: '#0a0a0a',
            borderRadius: '12px',
            fontWeight: 'bold',
            textDecoration: 'none',
            transition: 'transform 0.2s'
          }}
        >
          Ver mi GitHub jejejejeje
        </a>

        <a 
          href="mailto:tu-email@ejemplo.com" 
          style={{
            padding: '12px 24px',
            border: '1px solid #3f3f46',
            color: '#ffffff',
            borderRadius: '12px',
            fontWeight: 'bold',
            textDecoration: 'none',
            backgroundColor: 'rgba(255,255,255,0.05)'
          }}
        >
          Contactar
        </a>
      </div>

      <footer style={{
        position: 'absolute',
        bottom: '30px',
        fontSize: '0.9rem',
        color: '#52525b'
      }}>
        © {new Date().getFullYear()} — Diseñado por Giulia
      </footer>
    </main>
  );
}