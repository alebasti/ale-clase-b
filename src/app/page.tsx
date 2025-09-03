import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="bg-gray-100 flex items-center justify-center min-h-screen p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4" style={{ fontFamily: 'Arial, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
          PracticaVial
        </h1>
        <h2 className="text-2xl text-gray-800 mb-8">Bienvenido</h2>
        <p className="text-gray-600 mb-8">
          Tu plataforma para dominar la Licencia de Conducir Clase B.
        </p>
        <div className="flex flex-col items-center space-y-4">
          <Link href="/examen" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 ease-in-out w-4/5 text-center shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Probar Examen Oficial
          </Link>
          <Link href="/test-rapido" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 ease-in-out w-4/5 text-center shadow-md hover:shadow-lg hover:-translate-y-0.5">
            Probar Test rapido
          </Link>
        </div>
      </div>
    </main>
  );
}
