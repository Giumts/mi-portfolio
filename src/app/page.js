export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Hola, soy Giulia
        </h1>
        <p className="text-xl text-slate-400 max-w-lg mx-auto">
          Bienvenido a mi nuevo portfolio construido con Next.js. 
          Este es el comienzo de algo increíble... 🚀
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-cyan-400 transition-colors">
            Mis Proyectos
          </button>
          <button className="px-8 py-3 border border-slate-700 rounded-full font-semibold hover:bg-slate-900 transition-colors">
            Sobre mí
          </button>
        </div>
      </div>
    </main>
  );
}