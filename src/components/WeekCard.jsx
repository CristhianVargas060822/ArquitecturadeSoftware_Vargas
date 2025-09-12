export default function WeekCard({ week, description, image }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full sm:w-60 hover:shadow-xl transition">
      {/* Título de la semana */}
      <h2 className="text-lg font-bold text-indigo-600 mb-2">Semana {week}</h2>

      {/* Imagen opcional */}
      {image ? (
        <img
          src={image}
          alt={`Semana ${week}`}
          className="rounded-lg mb-2 object-contain w-full h-40"
        />
      ) : (
        <p className="text-gray-500 italic mb-2">Contenido pendiente...</p>
      )}

      {/* Descripción opcional */}
      {description && <p className="text-gray-700">{description}</p>}
    </div>
  );
}