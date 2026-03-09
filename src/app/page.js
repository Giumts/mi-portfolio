export default function Home() {
  return (
    <main style={{
      height: '100vh',       // Ocupa toda la altura de la pantalla
      display: 'flex',       // Activa el modo caja
      justifyContent: 'center', // Centra horizontalmente
      alignItems: 'center',     // Centra verticalmente
      backgroundColor: 'white'
    }}>
      {/* Aquí va tu imagen */}
      <img 
        src="/window.svg" 
        alt="Logo" 
        style={{ width: '100px', height: 'auto' }} 
      />
    </main>
  );
}