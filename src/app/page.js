// src/app/page.js
export default function Portfolio() {
  return (
    <div style={{ backgroundColor: '#f9f9f9', color: '#1a1a1a', minHeight: '100vh', fontFamily: 'serif' }}>
      
      {/* Navegación Minimalista */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '40px 10% ', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
        <span>Giulia — 2024</span>
        <div>
          <a href="#work" style={{ marginRight: '20px', textDecoration: 'none', color: 'inherit' }}>Proyectos</a>
          <a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>Sobre mí</a>
        </div>
      </nav>

      {/* Hero Section (Inspirado en Paulet) */}
      <header style={{ padding: '100px 10%', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: '400', fontStyle: 'italic', marginBottom: '20px' }}>
          Digital Creator
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', lineHeight: '1.8', color: '#666' }}>
          Especializada en diseño minimalista y desarrollo frontend con atención al detalle.
        </p>
      </header>

      {/* Galería de Proyectos (Layout Asimétrico) */}
      <section id="work" style={{ padding: '50px 10%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
          <div style={{ marginTop: '40px' }}> {/* Unos más arriba que otros */}
            <div style={{ width: '100%', height: '400px', backgroundColor: '#ddd', marginBottom: '15px' }}></div>
            <h3>Proyecto Uno</h3>
            <p style={{ fontFamily: 'sans-serif', fontSize: '0.9rem', color: '#888' }}>Diseño & Branding</p>
          </div>
          <div>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#eee', marginBottom: '15px' }}></div>
            <h3>Proyecto Dos</h3>
            <p style={{ fontFamily: 'sans-serif', fontSize: '0.9rem', color: '#888' }}>Desarrollo Web</p>
          </div>
        </div>
      </section>

    </div>
  );
}
