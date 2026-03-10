export default function Home() {
  return (
    <main style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column', // Organiza los elementos uno debajo de otro
      alignItems: 'center',    // Centra horizontalmente
      backgroundColor: 'white',
      paddingTop: '5vh'        // Separa el nombre un poco del borde superior
    }}>
      
      {/* Tu nombre arriba, pequeño y elegante */}
      <h1 style={{
        fontSize: '0.9rem',     // Tamaño pequeño
        fontWeight: '400',      // Letra no muy gruesa
        letterSpacing: '3px',   // Espaciado entre letras (estilo premium)
        textTransform: 'uppercase', // Todo en mayúsculas
        marginBottom: '35vh',   // Empuja la imagen hacia el centro
        color: '#1a1a1a',
        fontFamily: 'serif'     // Tipo de letra con remates (clásica)
      }}>
        Giulia
      </h1>

      {/* Tu imagen en el centro */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img 
          src="/BEAUTIFUL_FAILURES_AY3.jpg" 
          alt="Logo" 
          style={{ width: '80px', height: 'auto' }} 
        />
      </div>

    </main>
  );
}

