import Link from 'next/link';

export default function ExamenPage() {
  return (
    <main className="bg-gray-100 flex items-center justify-center min-h-screen p-4 font-sans">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Cuestionario Licencia Clase B</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Instrucciones del Examen</h2>
        <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left space-y-4">
          <p className="text-gray-700">• El examen consta de 35 preguntas:</p>
          <p className="text-gray-700">• 32 preguntas valen <span className="font-bold">1 punto</span> cada una</p>
          <p className="text-gray-700">• 3 preguntas que valen <span className="font-bold">2 puntos, es decir 2 puntos cada una</span></p>
          <p className="text-gray-700">• Puntaje máximo posible: <span className="font-bold">38 puntos</span></p>
          <p className="text-gray-700">• Para aprobar se requiere: <span className="font-bold text-green-600">Mínimo 33 puntos</span></p>
        </div>
        <Link href="/quiz" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 ease-in-out text-lg inline-block">
          Comenzar Examen
        </Link>
      </div>
    </main>
  );
}
