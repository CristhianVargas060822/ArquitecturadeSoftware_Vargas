import { useState } from "react";
import WeekCard from "./components/WeekCard";
import organizador from "./assets/organizador.jpg";

export default function App() {
  // Estado para controlar qué unidad está seleccionada (1 a 4)
  const [unidad, setUnidad] = useState(1);

  // Arreglo con 16 semanas
  const semanas = Array.from({ length: 16 }, (_, i) => ({
    week: i + 1,
    description: i === 0 ? "Organizador de la primera semana" : "",
    image: i === 0 ? organizador : null,
  }));

  // Calcular las semanas a mostrar según la unidad seleccionada
  const semanasUnidad = semanas.slice((unidad - 1) * 4, unidad * 4);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-700">📘 Mis Semanas de Clase</h1>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((u) => (
            <button
              key={u}
              onClick={() => setUnidad(u)}
              className={`px-4 py-2 rounded-full font-semibold ${
                unidad === u
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-indigo-600 hover:bg-indigo-100"
              }`}
            >
              Unidad {u}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        {semanasUnidad.map((semana) => (
          <WeekCard
            key={semana.week}
            week={semana.week}
            description={semana.description}
            image={semana.image}
          />
        ))}
      </div>
    </div>
  );
}