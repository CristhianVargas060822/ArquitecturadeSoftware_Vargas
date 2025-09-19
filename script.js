// Generar dinámicamente las unidades y semanas
const contenedor = document.getElementById("contenedor-unidades");

// Total de unidades y semanas
const unidades = 4;
const semanasPorUnidad = 4;

let numeroSemana = 1; // contador global

for (let u = 1; u <= unidades; u++) {
  let unidadDiv = document.createElement("div");
  unidadDiv.classList.add("unidad");
  unidadDiv.setAttribute("id", "unidad" + u);

  let tituloUnidad = document.createElement("h2");
  tituloUnidad.textContent = "Unidad " + u;
  unidadDiv.appendChild(tituloUnidad);

  for (let s = 1; s <= semanasPorUnidad; s++) {
    let semanaDiv = document.createElement("div");
    semanaDiv.classList.add("semana");
    semanaDiv.innerHTML = `
      <h3>Semana ${numeroSemana}</h3>
      <p>Aquí colocaré la descripción o enlace del trabajo de esta semana.</p>
    `;
    unidadDiv.appendChild(semanaDiv);

    numeroSemana++; // aumentar el número de semana global
  }

  contenedor.appendChild(unidadDiv);
}
